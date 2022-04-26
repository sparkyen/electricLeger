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
//注册用户模块


//路由模块
const query = require('./router/query.js');
const account = require('./router/account.js');
const trade = require('./router/trade');
const scheduleService = require('./services/electric/scheduleService')
const scheduleSvcInstance = new scheduleService();

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


// app.use('/producer', producer);
// app.use('/consumer', consumer);



app.use('/login', async (req, res, next) => {
  console.log("\n======app.js_login is Running======");
  console.log(req.body.userName);
  console.log(req.body.role);
  var userName = req.body.userName;
  var role = req.body.role;
  try {
    if (!userName || userName.lenth < 1) {
      console.log("USER MISSING");
      return res.status(500).json("Fill in User Please");
    }
    else {
      cache.put('role', role);
      if (role == 'producer') cache.put('producer', userName);
      else if (role == 'consumer') cache.put('consumer', userName);
      else cache.put('admin', userName);
      // targetUrl = urlBase + ":" + port;
      let msg = "User - " + userName + " was successfully login";
      console.log(msg);

      return res.status(200).json(msg);
    }
  } catch (error) {
    return res.status(500).json(error);
  } finally {
    // res.render('consumer.ejs');
  }
})

scheduleSvcInstance.test();
var hostname = "127.0.0.1";
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})
