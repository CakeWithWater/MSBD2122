import pendulum
import os
import json
import redis
import logging

from datetime import datetime

from airflow.decorators import dag, task
from airflow.providers.http.hooks.http import HttpHook
from airflow.providers.postgres.operators.postgres import PostgresOperator
from airflow.operators.python import BranchPythonOperator
from airflow.utils.trigger_rule import TriggerRule

@dag(
    schedule_interval=None,
    start_date=pendulum.datetime(2021, 1, 1, tz="UTC"),
    catchup=False,
    tags=['image'],
    render_template_as_native_obj=True
)
def taskflow_image():
    """
    ### Image processing taskflow
    """
    faas_hook = HttpHook(method="POST", http_conn_id="openfaas")
    r = redis.from_url('redis://:ZuTGL52vk5@redis-master.redis.svc.cluster.local:6379')

    @task()
    def task_extract_metadata(**kwargs):
        image_key = kwargs['dag_run'].conf.get('image_key')
        metadata_res = faas_hook.run(endpoint="function/extract-metadata-redis", 
                                     params={'image_key': image_key})
        if 'application/json' in metadata_res.headers['Content-Type']:
            metadata_json = metadata_res.json()
            creation_time = str(datetime.fromisoformat(metadata_json['creationTime'][:19]))[:19]
            metadata_json['creationTime'] = creation_time
            if metadata_json['geo']['latitude']['Direction'] != 'DEFAULT':
                metadata_json['geo']['latitude']['Direction'] = "\'" + metadata_json['geo']['latitude']['Direction'] + "\'"
            if metadata_json['geo']['longitude']['Direction'] != 'DEFAULT':
                metadata_json['geo']['longitude']['Direction'] = "\'" + metadata_json['geo']['longitude']['Direction'] + "\'"
            if metadata_json['exifMake'] != 'DEFAULT':
                metadata_json['exifMake'] = "\'" + metadata_json['exifMake'] + "\'"
            if metadata_json['exifModel'] != 'DEFAULT':
                metadata_json['exifModel'] = "\'" + metadata_json['exifModel'] + "\'"
            return metadata_json
        else:
            return {}

    metadata_json = task_extract_metadata()

    def branch_func(metadata_json):
        if metadata_json:
            return ['task_resize_image', 'task_label_image']
        else:
            return 'task_unsupported_format'
    branch_accept_image = BranchPythonOperator(task_id='branch_accept_image',
                                               op_args=[metadata_json],
                                               python_callable=branch_func)

    @task()
    def task_label_image(**kwargs):
        image_key = kwargs['dag_run'].conf.get('image_key')
        label_res = faas_hook.run(endpoint="function/tfhub-od-redis",
                                  headers={'Content-Type': 'text/plain'}, 
                                  data={'image_key': image_key})

        return json.loads(label_res.text)['label']

    @task()
    def task_resize_image(**kwargs):
        image_key = kwargs['dag_run'].conf.get('image_key')
        thumbnail_key_res = faas_hook.run(endpoint="function/image-resize-redis",
                                          params={'image_key': image_key})
        return thumbnail_key_res.text

    @task()
    def task_unsupported_format(**kwargs):
        image_key = kwargs['dag_run'].conf.get('image_key')
        head, ext = os.path.splitext(image_key)
        thumbnail_key = head + "_thumbnail" + ext
        r.set(thumbnail_key, 'Unsupported image format.')
        return    
    
    label = task_label_image()
    thumbnail_key = task_resize_image()
    fail_end = task_unsupported_format()

    task_insert_data = PostgresOperator(task_id="task_insert_data",
                                        sql="insert_data.sql",
                                        postgres_conn_id='pgsql')
                                        # params={"labels": label,
                                        #         "thumbnail": thumbnail_key,
                                        #         "creation_time": metadata_json['creationTime'],
                                        #         "lat_d": metadata_json['geo']['latitude']['D'],
                                        #         "lat_m": metadata_json['geo']['latitude']['M'],
                                        #         "lat_s": metadata_json['geo']['latitude']['S'],
                                        #         "lat_direction": metadata_json['geo']['latitude']['Direction'],
                                        #         "long_d": metadata_json['geo']['longitude']['D'],
                                        #         "long_m": metadata_json['geo']['longitude']['M'],
                                        #         "long_s": metadata_json['geo']['longitude']['S'],
                                        #         "long_direction": metadata_json['geo']['longitude']['Direction'],
                                        #         "exif_make": metadata_json['exifMake'],
                                        #         "exif_model": metadata_json['exifModel'],
                                        #         "dimen_width": metadata_json['dimensions']['width'],
                                        #         "dimen_height": metadata_json['dimensions']['height'],
                                        #         "file_size": metadata_json['fileSize'],
                                        #         "format": metadata_json['format']
                                        #         }
       
    
    metadata_json >> branch_accept_image
    branch_accept_image >> label >> task_insert_data
    branch_accept_image >> thumbnail_key >> task_insert_data
    branch_accept_image >> fail_end


tutorial_etl_dag = taskflow_image()
