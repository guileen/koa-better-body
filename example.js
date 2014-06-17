/**
 * koa-better-body - example.js
 * Copyright(c) 2014
 * MIT Licensed
 *
 * @author  Charlike Mike Reagent (@tunnckoCore)
 * @api private
 */
var app       = require('koa')(),
    router    = require('koa-router'),
    koaBody   = require('./index')(/*defaults*/);
    multiline = require('multiline');

app.use(router(app));

app.post('/users', koaBody,
  function *(next) {
    console.log(this.request.body);
    // => POST body
    this.body = JSON.stringify(this.request.body, null, 2);
    yield next;
  }
);
app.get('/', function *(next) {
  this.set('Content-Type', 'text/html');
  this.body = multiline.stripIndent(function(){/*
      <!doctype html>
      <html>
          <body>
              <form action="/" enctype="multipart/form-data" method="post">
              <input type="text" name="username" placeholder="username"><br>
              <input type="text" name="title" placeholder="tile of film"><br>
              <input type="file" name="uploads" multiple="multiple"><br>
              <button type="submit">Upload</button>
          </body>
      </html>
  */});
});
app.post('/', koaBody,
  function *(next) {
    console.log(this.request.body.fields);
    // => {username: ""} - if empty

    console.log(this.request.body.files);
    /* => {uploads: [
            {
              "size": 748831,
              "path": "/tmp/f7777b4269bf6e64518f96248537c0ab.png",
              "name": "some-image.png",
              "type": "image/png",
              "mtime": "2014-06-17T11:08:52.816Z"
            },
            {
              "size": 379749,
              "path": "/tmp/83b8cf0524529482d2f8b5d0852f49bf.jpeg",
              "name": "nodejs_rulz.jpeg",
              "type": "image/jpeg",
              "mtime": "2014-06-17T11:08:52.830Z"
            }
          ]}
    */
   this.body = JSON.stringify(this.request.body, null, 2)
   yield next;
  }
)

var port = process.env.PORT || 3333;
app.listen(port);
console.log('Koa server with `koa-better-body` parser start listening to port %s', port);
console.log('curl -i http://localhost:%s/users -d "user=admin"', port);
console.log('curl -i http://localhost:%s/ -F "source=@/path/to/file.png"', port);
