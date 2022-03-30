// consumer.js - 维基路由模块

const express = require('express');
const consumer = express.Router();
var cache = require('memory-cache');

//测试模块
const AuthTest = require('../services/authTest.js');
const authTestInstance = new AuthTest();

//交易模块
const WholesalerService = require('../services/wholesalerService.js');
const wholesalerSvcInstance = new WholesalerService();

//查询模块
const QueryService = require( "../services/queryService.js" );
const QueryHistoryService = require( "../services/queryHistoryService.js" );
const querySvcInstance = new QueryService();
const queryHistorySvcInstance = new QueryHistoryService();

// 主页路由
consumer.get('/', (req, res) => {
    res.render('consumer.ejs');
});

consumer.post('/connectTest', async (req, res, next) => {
  try {
    const result = await authTestInstance.connect(userName, "producer");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
  // return res.status(200).json("Connect with network successfully");
})

consumer.post('/wholesalerDistribute', async (req, res, next) => {
    console.log(req.body);
    var equipmentNumber = req.body.equipmentNumber;
    var ownerName = req.body.ownerName;
    var userName = cache.get('consumer')
    try {
      if(!userName || userName.lenth<1) {
        return res.status(500).json("User is missing");
      } else if (!ownerName || !equipmentNumber) {
        return res.status(500).json("Missing requied fields: ownerName, equipmentNumber");
      } else {
        const result = await wholesalerSvcInstance.wholesalerDistribute(userName, equipmentNumber, ownerName);
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  })

consumer.get('/queryHistoryByKey', async (req, res, next) => {
    console.log(req.body);
    var userName = cache.get('consumer')
    //var userName = "brian";
    let key = req.query.key;
    try {
      if(!userName || userName.lenth<1) {
        return res.status(500).json("User is missing");
      } else {
        const result = await queryHistorySvcInstance.queryHistoryByKey(userName, key);
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })

consumer.get('/queryByKey', async (req, res, next) => {
    console.log(req.body);
    var userName = cache.get('consumer')
    //var userName = "brian";
    let key = req.query.key;
    try {
      if(!userName || userName.lenth<1) {
        return res.status(500).json("User is missing");
      } else {
        const result = await querySvcInstance.queryByKey(userName, key);
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })

// “关于页面”路由
consumer.get('/about', (req, res) => {
  res.send('consumer');
});

module.exports = consumer;