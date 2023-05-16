"use strict"

const redis = require('redis');
const path = require('path');
const sharp = require('sharp');
const exif = require('exif-reader');

const redis_client = redis.createClient({url: 'redis://:ZuTGL52vk5@redis-replicas.redis.svc.cluster.local:6379'});

module.exports = async (event, context) => {
  const image_key = event.query.image_key;

  console.log(image_key);

  const key_parse = path.parse(image_key);
  const extension = key_parse.ext

  context.cbCalled++;
  
  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {   
    await redis_client.connect();
    const buffer = await redis_client.get(redis.commandOptions({ returnBuffers: true }), image_key);
    redis_client.quit();
    sharp(buffer).metadata().then((metadata) => {
      const format = metadata.format;
      if (format === 'png' || format === 'jpeg') {
        if (metadata.exif) {
          const metadata_exif = exif(metadata.exif);
          const sample_metadata = {
            "creationTime": metadata_exif.exif.DateTimeOriginal,
            "geo": {
              "latitude": {
                "D": metadata_exif.gps ? metadata_exif.gps.GPSLatitude[0] : 'DEFAULT',
                "M": metadata_exif.gps ? metadata_exif.gps.GPSLatitude[1] : 'DEFAULT',
                "S": metadata_exif.gps ? metadata_exif.gps.GPSLatitude[2] : 'DEFAULT',
                "Direction": metadata_exif.gps ? metadata_exif.gps.GPSLatitudeRef : 'DEFAULT',
              },
              "longitude": {
                "D": metadata_exif.gps ? metadata_exif.gps.GPSLongitude[0] : 'DEFAULT',
                "M": metadata_exif.gps ? metadata_exif.gps.GPSLongitude[1] : 'DEFAULT',
                "S": metadata_exif.gps ? metadata_exif.gps.GPSLongitude[2] : 'DEFAULT',
                "Direction": metadata_exif.gps ? metadata_exif.gps.GPSLongitudeRef : 'DEFAULT',
              }
            },
            "exifMake": metadata_exif.image ? metadata_exif.image.Make : 'DEFAULT',
            "exifModel": metadata_exif.image ? metadata_exif.image.Model : 'DEFAULT',
            "dimensions": {
              "width": metadata.width,
              "height": metadata.height
            },
            "fileSize": metadata.size,
            "format": metadata.format
          };
          context
          .status(200)
          .headers({'Content-type': "application/json"})
          .succeed(sample_metadata);
        } else {
          const sample_metadata = {
            "creationTime": new Date().toISOString(),
            "geo": {
              "latitude": {
                "D": 'DEFAULT',
                "M": 'DEFAULT',
                "S": 'DEFAULT',
                "Direction": 'DEFAULT',
              },
              "longitude": {
                "D": 'DEFAULT',
                "M": 'DEFAULT',
                "S": 'DEFAULT',
                "Direction": 'DEFAULT',
              }
            },
            "exifMake": 'DEFAULT',
            "exifModel": 'DEFAULT',
            "dimensions": {
              "width": metadata.width,
              "height": metadata.height
            },
            "fileSize": metadata.size,
            "format": metadata.format
          };
          context
          .status(200)
          .headers({'Content-type': "application/json"})
          .succeed(sample_metadata);
        }        
      } else {
        context
          .status(200)
          .headers({'Content-type': "text/plain"})
          .succeed('Unsupported image format.')
      }    
    }).catch( (error) => {
      context.fail(error);
    });
  } else {
    context
      .status(200)
      .headers({'Content-type': "text/plain"})
      .succeed('Unsupported image format.')
  }
}