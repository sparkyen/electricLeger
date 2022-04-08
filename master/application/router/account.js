// account.js - 

const express = require('express');
const account = express.Router();
var cache = require('memory-cache');

const accountService = require( "../services/electric/accountService" );
const accountSvcInstance = new accountService();

account.post('/regAccount', async (req, res, next) => {
    console.log("\n======account.js_regAccount is Running======");
    // alert("======app.js_addUser is Running======\n");
     console.log(req.body.userName);
     console.log(req.body.role);
     var userName = req.body.userName;
     var role = req.body.role;
     try {
       if(!userName || userName.lenth<1) {
        console.log("USER MISSING");
        return res.status(500).json("Fill in User please!");
       } else {
        var result = await accountSvcInstance.regAccount(userName, role);
        console.log(result);
        let msg = 'User '+ userName + ' was successfully registered and enrolled and is ready to intreact with the fabric network';
        console.log(msg);
        return res.status(200).json(msg);
       }
     } catch (error) {
       return res.status(500).json(error);
     }
   })

   account.post('/initAccount', async (req, res, next) => {
    console.log("\n======account.js_initAccount is Running======");
     console.log(req.body.userName);
     console.log(req.body.role);
     var userName = req.body.userName;
     var role = req.body.role;
     try {
       if(!userName || userName.lenth<1) {
        console.log("USER MISSING");
        return res.status(500).json("Fill in User please!");
       } else {
        var result = await accountSvcInstance.initAccount(userName, role);
        console.log(result);
        let msg = 'User '+ userName + ' was successfully init';
        console.log(msg);
        return res.status(200).json(msg);
       }
     } catch (error) {
       return res.status(500).json(error);
     }
   })

   account.post('/activeAccount', async (req, res, next) => {
    console.log("\n======account.js_activeAccount is Running======");
     console.log(req.body.userName);
     console.log(req.body.role);
     var userName = req.body.userName;
     var role = req.body.role;
     try {
       if(!userName || userName.lenth<1) {
        console.log("USER MISSING");
        return res.status(500).json("Fill in User please!");
       } else {
        var result = await accountSvcInstance.activeAccount(userName, role);
        console.log(result);
        let msg = 'User '+ userName + ' was successfully active and can be used as you wish !';
        console.log(msg);
        return res.status(200).json(msg);
       }
     } catch (error) {
       return res.status(500).json(error);
     }
   })

   account.post('/rechargeAccount', async (req, res, next) => {
    console.log("\n======account.js_activeAccount is Running======");
     console.log(req.body.userName);
     console.log(req.body.role);
     console.log(req.body.money)
     var userName = req.body.userName;
     var role = req.body.role;
     var money = req.body.money;
     try {
       if(!userName || userName.lenth<1) {
        console.log("USER MISSING");
        return res.status(500).json("Fill in User please!");
       } else {
        var result = await accountSvcInstance.rechargeAccount(userName, role, money);
        console.log(result);
        let msg = 'User '+ userName + ' was successfully recharge '+money;
        console.log(msg);
        return res.status(200).json(msg);
       }
     } catch (error) {
       return res.status(500).json(error);
     }
   })

module.exports = account;