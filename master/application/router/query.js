// query.js - 

const express = require('express');
const query = express.Router();
var cache = require('memory-cache');

const queryService = require( "../services/electric/queryService" );
const querySvcInstance = new queryService();


query.get('/queryByKey', async (req, res, next) => {
    // console.log(req.body);
    // console.log(req);
    let role = req.query.role;
    console.log(role+'is using /*/queryByKey');
    var userName = cache.get(role)
    let key = req.query.key;
    try {
      if(!userName || userName.lenth<1) {
        return res.status(500).json("User is missing");
      } else {
        let orgName;
        if(role=='producer') orgName = 'org1';
        else if(role=='consumer') orgName = 'org2';
        else orgName = 'org3';
        const result = await querySvcInstance.queryByKey(userName, orgName, key);
        // console.log(result);
        return res.status(200).json(result);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })

query.get('/queryHistoryByKey', async (req, res, next) => {
  // console.log(req.body);
  let role = req.query.role;
  console.log(role+'is using /*/queryHistoryByKey');
  var userName = cache.get(role);
  let key = req.query.key;
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else {
      let orgName;
      if(role=='producer') orgName = 'org1';
      else if(role=='consumer') orgName = 'org2';
      else orgName = 'org3';
      const result = await querySvcInstance.queryHistoryByKey(userName, orgName, key);
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
  console.log(role+'is using /*/queryPartialKey');
  var userName = cache.get(role);
  let key = req.query.key;
  try {
    if(!userName || userName.lenth<1) {
      return res.status(500).json("User is missing");
    } else {
      let orgName;
      if(role=='producer') orgName = 'org1';
      else if(role=='consumer') orgName = 'org2';
      else orgName = 'org3';
      const result = await querySvcInstance.queryPartialKey(userName, orgName, key)
      console.log(result);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }

})

module.exports = query;