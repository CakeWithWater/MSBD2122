import numpy as np

from google.cloud import storage

import cma
import json

from time import sleep
from multiprocessing import Process, Value, Queue


def upload_blob_from_memory(bucket_name, contents, destination_blob_name):
    """Uploads a file to the bucket."""

    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"

    # The contents to upload to the file
    # contents = "these are my contents"

    # The ID of your GCS object
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_string(contents)

    print(f"Upload: Object {destination_blob_name} with contents {contents} is uploaded to {bucket_name}.")


def download_blob_into_memory(bucket_name, blob_name):
    """Downloads a blob into memory."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"

    # The ID of your GCS object
    # blob_name = "storage-object-name"

    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)

    # Construct a client side representation of a blob.
    # Note `Bucket.blob` differs from `Bucket.get_blob` as it doesn't retrieve
    # any content from Google Cloud Storage. As we don't need additional data,
    # using `Bucket.blob` is preferred here.
    blob = bucket.blob(blob_name)
    contents = blob.download_as_string()

    print(f"Download: Object {blob_name} from bucket {bucket_name} is downloaded as the following string: {contents}.")

    return contents


def list_blobs_with_prefix(bucket_name, prefix, delimiter=None):
    storage_client = storage.Client()

    blobs = storage_client.list_blobs(bucket_name, prefix=prefix, delimiter=delimiter)

    return [blob.name for blob in blobs]


def auto_rl_reward_objective(raw_reward_param):
    """
    Rescale parameter from search space to actual reward parameter

    sigma0 = 2, i.e. raw search space width ~ 10
    x0 will be 0 so transformation handle the sign and width

    Transformation from search guess into reward parameter:
    baseline:
    transformation = 2 * x (actual reward range from -10 to 10)
    goal_distance:
    transformation = -x**2 * 0.2 (raw value: [0, 5], actual reward component: [-25, 0] )
    goal:
    transformation = x**2 * 1 (raw value: [0, 1], actual reward component: [0, 25])
    turning:
    transformation = -x**2 * 0.4 (raw value: [0, 1], actual reward component: [-10, 0])
    clearance:
    transformation = x**2 * 0.1 (raw value: [0, 4], actual reward component: [0, 10])
    collision:
    transformation = -x**2 * 1 (raw value: [0, 1], actual reward component: [-25, 0])
    """
    current_trial = trial_count.value
    print(f'Preparing trial {current_trial}')

    reward_param_json = json.dumps({'baseline': 2 * raw_reward_param[0],
                                    'goal_distance': -(raw_reward_param[1] ** 2) * 0.2,
                                    'goal': (raw_reward_param[2] ** 2) * 1,
                                    'turning': -(raw_reward_param[3] ** 2) * 0.4,
                                    'clearance': (raw_reward_param[4] ** 2) * 0.1,
                                    'collision': -(raw_reward_param[5] ** 2) * 0.1,
                                    'current_trial': current_trial})
    if current_trial > 27:
        upload_blob_from_memory(gcloud_bucket_name, reward_param_json, f"reward_trial/trial_{current_trial}.json")
        sleep(60 * 60 * 20)

    while True:
        output = list_blobs_with_prefix(gcloud_bucket_name, f'reward_trial/output_{current_trial}.txt')
        if not output:
            sleep(60)
        else:
            objective_value = -float(download_blob_into_memory(gcloud_bucket_name,
                                                              f'reward_trial/output_{current_trial}.txt'))
            queue.put((tuple(raw_reward_param), objective_value))
            break


def parallel_auto_rl_reward_objective(list_raw_reward_param):
    processes = []
    for raw_reward_param in list_raw_reward_param:
        with trial_count.get_lock():
            trial_count.value += 1
        p = Process(target=auto_rl_reward_objective, args=(raw_reward_param,))
        p.start()
        processes.append(p)
        sleep(1)

    for p in processes:
        p.join()

    while True:
        while not queue.empty():
            output = queue.get()
            param_output[output[0]] = output[1]
        finished = True
        for raw_reward_param in list_raw_reward_param:
            if tuple(raw_reward_param) not in param_output:
                finished = False
                break
        if not finished:
            sleep(60)
            continue
        objective_values = []
        for raw_reward_param in list_raw_reward_param:
            objective_values.append(param_output[tuple(raw_reward_param)])

        return objective_values


if __name__ == '__main__':
    gcloud_bucket_name = "independent-project-rl-content-bucket"
    queue = Queue()
    trial_count = Value('i', 0)
    param_output = {}
    x, es = cma.fmin2(None, np.zeros(6), 2, parallel_objective=parallel_auto_rl_reward_objective, options={'seed': 1007037})
