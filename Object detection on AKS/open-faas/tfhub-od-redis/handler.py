import socket
import json
from time import sleep

client = socket.socket()
port = 12345
while True:
    try:
        client.connect(('', port))
        break
    except:
        sleep(1)
        continue

def handle(req):
    """handle a request to the function
    Args:
        req (str): request body
    """
    client.send(req.encode())
    return client.recv(1024).decode()
