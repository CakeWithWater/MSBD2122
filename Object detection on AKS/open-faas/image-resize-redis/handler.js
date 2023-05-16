"use strict"

const redis = require('redis');
const path = require('path');
const sharp = require('sharp');

const redis_client = redis.createClient({url: 'redis://:ZuTGL52vk5@redis-master.redis.svc.cluster.local:6379'});

module.exports = async (event, context) => {
  const image_key = event.query.image_key;

  const key_parse = path.parse(image_key);
  const extension = key_parse.ext;
  const name = key_parse.dir + '/' + key_parse.name;
  const thumbnail_key = name + '_thumbnail' + extension;

  const fit = event.body.fit || 'inside';
  context.cbCalled++;
  
  await redis_client.connect();
  const buffer = await redis_client.get(redis.commandOptions({ returnBuffers: true }), image_key);
  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
    const width = event.query.width ? Number(event.query.width) : 300;
    const height = event.query.height ? Number(event.query.height) : 300;
    
    const image = sharp(buffer);
    image.resize(width, height, { fit }).toBuffer().then(async (buffer) => {
      
      await redis_client.set(thumbnail_key, buffer);
      redis_client.quit();
      context
        .status(200)
        .headers({'content-type': 'text/plain'})
        .succeed(thumbnail_key);
    }).catch(error => {
      redis_client.quit();
      context.fail(error);
    });
  } else {
    redis_client.quit();
    context.fail('Unsupported image format.')
  }
}