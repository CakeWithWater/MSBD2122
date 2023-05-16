//express_demo.js 文件
var express = require('express');
var app = express();
const redis = require('redis');
var multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// var fs = require('fs')
// var path = require('path')
// var bodyParser = require('body-parser');
// var sharp = require('sharp')
const { resolve } = require('dns');
var axios = require('axios')

const { Client } = require('pg')
const pgclient = new Client({
  user: 'postgres',
  host: 'pgsql-postgresql.pgsql.svc.cluster.local',
  database: 'postgres',
  password: 'EnyOLp1iuG',
  port: 5432,
})
pgclient.connect().then(()=>{
  console.log("pgsql connect");
})


const client = redis.createClient({ url : 'redis://:ZuTGL52vk5@redis-master.redis.svc.cluster.local:6379' });
// const client = redis.createClient();
client.connect().then(()=>{
  console.log("redis connect");
})

app.get('/', function (req, res) {
  async () => {
    await pgclient.connect()
    const res = await pgclient.query('SELECT $1::text as message', ['Hello world!'])
    console.log(res.rows[0].message) // Hello world!
    await pgclient.end()
    res.send(res.rows[0].message);
  }
})

app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Accept,Content-type");
  res.header("Access-Control-Allow-Credentials", true);
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8")
  if (req.method.toLowerCase() == 'options')
    res.sendStatus(200);  //让options尝试请求快速结束
  else
    next();
})


// for parsing multipart/form-data
app.use(upload.single('photo')); 

app.post('/up', function (req, res) {
  var user = req.body['name'];
  // console.log(req.file.buffer.toJSON());
  // console.log(req.file.buffer.toString());
  var buffer =  req.file.buffer;
  var key = user + '/' + req.file.originalname;
  console.log(req.file);
  // var parser = require('exif-parser').create(req.file.buffer);
  // var result = parser.parse();
  // console.log(result);

  // var tmp = sharp(req.file.buffer);
  // console.log(tmp.options.input.buffer);
  // console.log(req.file.buffer.toString().length);

  // const client = redis.createClient({ return_buffers : true });
  // tmp.withMetadata().toBuffer().then(async (buffer) => {
  //   await client.connect();
  //   console.log(buffer);
  //   await client.set(key, buffer);
  // }).catch(err => {
  //   console.log(err);
  // })
  (async () => {
    // await client.connect();
    await client.set(key, req.file.buffer);
    // await client.quit();
    axios({
      method: 'post',
      url: 'http://airflow-cluster-web.airflow225.svc.cluster.local:8081/api/v1/dags/taskflow_image/dagRuns',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({conf : {image_key: key}}),
      auth: {
        username: 'admin',
        password: 'admin'
      }    
    }).then( res => {
      console.log("finish")
      console.log(res)
    }).catch( err => {
      console.log(err)
    });
  })();

  // client.connect()
  // .then(()=>{
  //   client.set(key, req.file.buffer)
  //   .then(()=>{
  //     client.quit();
  //   })
  // })

  res.send();
});

app.get('/pic/:user/:filename', function(req, res){
  var params = req.params;
  var key = params.user + '/' + params.filename;
  (async () => {
    // await client.connect();
    var buffer = await client.get(redis.commandOptions({ returnBuffers: true }), key);
    // await client.quit();
    res.header('Content-Type', 'image/jpeg');
    res.header('Content-Disposition', `inline; filename="${key}"`);
    res.send(buffer);
    // const value = await client.get('key');
  })();
  // client.connect()
  // .then(()=>{
  //   var buffer = client.get(redis.commandOptions({ returnBuffers: true }), key)
  //   .then(()=>{
  //     client.quit();
  //     res.header('Content-Type', 'image/jpeg');
  //     res.header('Content-Disposition', `inline; filename="${key}"`);
  //     res.send(buffer);
  //   })
  // })

});

app.get('/all/:user', function(req, resp){
  var params = req.params;
  var user = params.user;
  var search_sql = `SELECT * FROM metadata WHERE img_id LIKE ('` + user + `' || '/%');`
  console.log("call all")
  pgclient.query(search_sql, (err, res) => {
    console.log(err)
    console.log(res.rows)
    resp.send(res.rows);
  })

  // pgclient.connect().then(()=>{
  //   pgclient.query(search_sql).then(res => {
  //     resp.send(res.rows);
  //     pgclient.end();
  //     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })

  // (async () => {
  //   await pgclient.connect()
  //   const res = await pgclient.query(search_sql)
  //   await pgclient.end()
  //   console.log(res.rows)
  //   res.send(res.rows);
  // })();

});



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

// console.log('close server');