// producer.js - 维基路由模块

const express = require('express');
const producer = express.Router();
var cache = require('memory-cache');
//测试模块
const Auth = require('../services/authTest.js');
const authTestInstance = new Auth();

//交易模块
const EquipmentService = require('../services/equipmentService.js');
const equipmentSvcInstance = new EquipmentService();

//查询模块
const QueryService = require( "../services/electric/queryService.js" );
const QueryHistoryService = require( "../services/queryHistoryService.js" );
const querySvcInstance = new QueryService();
const queryHistorySvcInstance = new QueryHistoryService();

// 主页路由
producer.get('/', (req, res) => {
  cache.put('producer', 'queen');
  res.render('producer.ejs');
});

producer.post('/connectTest', async (req, res, next) => {
  console.log("======/connectTest router is running======");
  var userName = cache.get('producer');
  try {
    const result = await authTestInstance.connect(userName, "producer");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
  // return res.status(200).json("Connect with network successfully");
})

producer.post('/makeEquipment', async (req, res, next) => {
    // console.log(req.body);
    var manufacturer = req.body.manufacturer;
    var equipmentNumber = req.body.equipmentNumber;
    var equipmentName = req.body.equipmentName;
    var ownerName = req.body.ownerName;
    var userName = cache.get('producer');
    try {
      if(!userName || userName.lenth<1) {
        return res.status(500).json("User is missing");
      } else if (!manufacturer || !equipmentName || !ownerName || !equipmentNumber) {
        return res.status(500).json("Missing requied fields: manufacturer, equipmentName, ownerName, equipmentNumber");
      } else {
        const result = await equipmentSvcInstance.makeEquipment(userName, manufacturer, equipmentNumber, equipmentName, ownerName);
        
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  })

// producer.get('/queryHistoryByKey', async (req, res, next) => {
//     // console.log(req.body);
//     var userName = cache.get('producer')
//     let key = req.query.key;
//     try {
//       if(!userName || userName.lenth<1) {
//         return res.status(500).json("User is missing");
//       } else {
//         const result = await querySvcInstance.queryHistoryByKey(userName, 'org1', key);
//         // const result = await queryHistorySvcInstance.queryHistoryByKey(userName, key);
//         console.log(result);
//         return res.status(200).json(result);
//       }
//     } catch (error) {
//       return res.status(500).json(error);
//     }
  
//   })

// producer.get('/queryByKey', async (req, res, next) => {
//     // console.log(req.body);
//     // console.log(req);
//     var userName = cache.get('producer')
//     let key = req.query.key;
//     try {
//       if(!userName || userName.lenth<1) {
//         return res.status(500).json("User is missing");
//       } else {
//         const result = await querySvcInstance.queryByKey(userName, 'org1', key);
//         // console.log(result);
//         return res.status(200).json(result);
//       }
//     } catch (error) {
//       return res.status(500).json(error);
//     }
  
//   })

  // producer.get('/queryPartialKey', async (req, res, next) => {
  //   // console.log(req.body);
  //   var userName = cache.get('producer')
  //   // let key = req.query.key;
  //   try {
  //     if(!userName || userName.lenth<1) {
  //       return res.status(500).json("User is missing");
  //     } else {
  //       const result = await querySvcInstance.queryPartialKey(userName, 'org1', key)
  //       console.log(result);
  //       return res.status(200).json(result);
  //     }
  //   } catch (error) {
  //     return res.status(500).json(error);
  //   }
  
  // })

// “关于页面”路由
// producer.get('/about', (req, res) => {
//   res.send('producer');
// });

module.exports = producer;