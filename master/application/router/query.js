// query.js - 

const express = require('express');
const query = express.Router();
var cache = require('memory-cache');

const queryService = require( "../services/electric/queryService" );
const querySvcInstance = new queryService();


query.get('/queryByKey', async (req, res, next) => {
    // console.log(req.body);
    let role = req.query.role;
    let userName = req.query.userName;
    let key = req.query.key;
    console.log('\n'+role+' is using /*/queryByKey');
    // var userName = 'wizard';
    // var userName = cache.get(role)
    
    try {
      if(!userName || userName.lenth<1) {
        return res.status(500).json("User is missing");
      } else {
        const result = await querySvcInstance.queryByKey(userName, role, key);
        console.log(result);
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })

query.get('/queryHistoryByKey', async (req, res, next) => {
  // console.log(req.body);
  let role = req.query.role;
  let userName = req.query.userName;
  let key = req.query.key;
  console.log('\n'+role+' is using /*/queryHistoryByKey');
  // var userName = cache.get(role);
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else {
      const result = await querySvcInstance.queryHistoryByKey(userName, role, key);
      console.log(result);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }

})

query.get('/queryPartialKey', async (req, res, next) => {
  // console.log(req.body);
  let role = req.query.role;
  let userName = req.query.userName;
  let key = req.query.key;
  let startKey = key+'-', endKey = key + '-z';
  console.log('\n'+role+' is using /*/queryPartialKey');
  // var userName = cache.get(role);
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else {
      const result = await querySvcInstance.queryPartialKey(userName, role, startKey, endKey);
      console.log(result);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }

})

module.exports = query;