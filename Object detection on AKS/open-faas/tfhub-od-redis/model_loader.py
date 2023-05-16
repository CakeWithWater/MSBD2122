from multiprocessing.sharedctypes import Value
import tensorflow as tf
import tensorflow_hub as hub

import socket

import redis

import collections

import json
import urllib.parse

detector_module = hub.load("https://tfhub.dev/google/openimages_v4/ssd/mobilenet_v2/1")
detector = detector_module.signatures['default']

r = redis.from_url('redis://:ZuTGL52vk5@redis-replicas.redis.svc.cluster.local:6379')

def load_image_into_tensor(key):
    raw_bytes = r.get(key)
    img_tensor = tf.io.decode_image(raw_bytes, channels=3)
    return img_tensor


def detect(b):
    req = urllib.parse.parse_qs(urllib.parse.unquote(b.decode()))
    img_tensor = load_image_into_tensor(req['image_key'][0])
    input_tensor = tf.image.convert_image_dtype(img_tensor, dtype=tf.float32)[tf.newaxis, ...]
    detector_output = detector(input_tensor)
    class_names = detector_output['detection_class_entities'].numpy().tolist()
    unique_class_names = [class_name.decode() for class_name in collections.Counter(class_names).keys()]
    return json.dumps({'label': unique_class_names}).encode()

server = socket.socket()
port = 12345
server.bind(('', port))
server.listen(5)

while True:
    client, addr = server.accept()
    req = client.recv(1024)
    client.send(detect(req))
    client.close()