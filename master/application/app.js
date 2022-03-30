'use strict';
const express = require('express')
const app = express()
app.set('view engine', 'ejs')

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
//注册用户模块
const proWalletService = require( "./services/producerWalletsService" );
const conWalletService = require( "./services/consumerWalletsService" );
const proWalletSvcInstance = new proWalletService();
const conWalletSvcInstance = new conWalletService();

//路由模块
const producer = require('./router/producer.js');
const consumer = require('./router/consumer.js');

app.use('/index', function (req, res) {
   res.render('index.ejs');
})
app.use('/producer', producer);
app.use('/consumer', consumer);

app.post('/addUser', async (req, res, next) => {
  console.log("\n======app.js_addUser is Running======");
  // alert("======app.js_addUser is Running======\n");
   console.log(req.body.userName);
   console.log(req.body.option);
   var userName = req.body.userName;
   var option = req.body.option;
   try {
     if(!userName || userName.lenth<1) {
      console.log("USER MISSING");
      return res.status(500).json("Fill in User please!");
     } else {
      var result;
      if(option=='producer') result = await proWalletSvcInstance.addToWallet(userName);
      else result = await conWalletSvcInstance.addToWallet(userName);
      console.log(result);
      let msg = 'User '+ userName + ' was successfully registered and enrolled and is ready to intreact with the fabric network';
      console.log(msg);
      return res.status(200).json(msg);
     }
   } catch (error) {
     return res.status(500).json(error);
   }
 })
 app.post('/login', async (req, res, next) => {
  // function fileDisplay(filePath){
  //   //根据文件路径读取文件，返回文件列表
  //   //遍历读取到的文件列表
  //   files.forEach(function(filename){
  //     //获取当前文件的绝对路径
  //     var filedir = path.join(filePath,filename);
  //     //根据文件路径获取文件信息，返回一个fs.Stats对象
  //     fs.stat(filedir,function(eror,stats){
  //       if(eror){
  //       console.warn('获取文件stats失败');
  //       }else{
  //         var isFile = stats.isFile();//是文件
  //         var isDir = stats.isDirectory();//是文件夹
  //         if(isFile){
  //           console.log(filedir);
  //         }
  //         if(isDir){
  //           fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
  //         }
  //       }
  //     })
  //   });
  // }
  // function find(userName, option){

  // }
  console.log("\n======app.js_login is Running======");
  console.log(req.body.userName);
  console.log(req.body.option);
  var userName = req.body.userName;
  var option = req.body.option;
  try {
    if(!userName || userName.lenth<1) {
      console.log("USER MISSING");
      return res.status(500).json("Fill in User Please");
    } 
    // else if(!find(userName, option)) {
    //   console.log("USER UNREGISTERED");
    //   return res.status(500).json("User has not been registered!");
    // }
    else {
      if(option=='producer') cache.put('producer', userName);
      else cache.put('consumer', userName);
      // targetUrl = urlBase + ":" + port;
      let msg = "User - "+ userName+ " was successfully login";
      console.log(msg);
      return res.status(200).json(msg);
    }
  } catch (error) {
      return res.status(500).json(error);
  }
 })
var port = process.env.PORT || 8080;
var server = app.listen(port, "127.0.0.1", function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})
