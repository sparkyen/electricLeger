'use strict';
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views');

const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');

app.use(express.static('public'))
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var cache = require('memory-cache');
const schedule = require("node-schedule");

const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })


//路由模块
const query = require('./router/query.js');
const account = require('./router/account.js');
const trade = require('./router/trade');
const scheduleService = require('./services/electric/scheduleService')

// const testService = require('../test/acutionTest');
const scheduleSvcInstance = new scheduleService();
// const testSvcInstance = new testService();

const crypto = require('crypto');

app.use('/*/query', query);
app.use('/*/account', account);
app.use('/*/trade', trade);
app.use('/index', function (req, res) {
  res.render('index.ejs');
})
app.use('/tmp', function (req, res) {
  res.render('tmp.ejs')
})
app.use('/admin', function (req, res) {
  res.render('admin', {name:cache.get('admin')});
  
})
app.use('/producer', function (req, res) {
  res.render('producer.ejs', {name:cache.get('producer')});
  
})
app.use('/consumer', function (req, res) {
  res.render('consumer.ejs', {name:cache.get('consumer')});
  
})

// app.use('/upload', function (req, res) {
//   res.render('upload.ejs');
// })

app.use('/upload', upload.single('uploaded_file'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any 
  console.log(req.body)
});

// app.use('/producer', producer);
// app.use('/consumer', consumer);



app.use('/login', async (req, res, next) => {
  console.log("\n======app.js_login is Running======");
  console.log(req.body.userName);
  console.log(req.body.role);
  // console.log(req.body);
  var userName = req.body.userName;
  var role = req.body.role;
  var passwd = req.body.passwd;
  // var file = req.body.file;
  try {
    if (!userName || userName.lenth < 1) {
      console.log("USER MISSING");
      return res.status(500).json("Fill in User Please");
    }
    if (!passwd || passwd.lenth < 1) {
      console.log("PASSWORD MISSING");
      return res.status(500).json("Fill in Password Please");
    }
    // else {
    var hash = crypto.createHash('md5');
    hash.update(userName+passwd);
    const identityLabel = hash.digest('hex');
    var file = '/home/sean/project/electric/master/identity/user/' + userName + '/wallet/'+identityLabel+'.id';
    console.log(file)
    fs.access(file, fs.constants.F_OK, (err) => {
      console.log(`${file} ${err ? '不存在' : '存在'}`);
      if(err){
        return res.status(500).json("用户名或者密码错误，请重试");
      }
      else {
        cache.put('role', role);
        if (role == 'producer') cache.put('producer', userName);
        else if (role == 'consumer') cache.put('consumer', userName);
        else cache.put('admin', userName);
        // targetUrl = urlBase + ":" + port;
        let msg = "User - " + userName + " was successfully login";
        console.log(msg);
        // console.log(file.fieldname);

        return res.status(200).json(msg);
      }
    });


    
    // }
  } catch (error) {
    return res.status(500).json(error);
  } finally {
    // res.render('consumer.ejs');
  }
})

// scheduleSvcInstance.run()
// scheduleSvcInstance.test()
var hostname = "127.0.0.1";
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})
