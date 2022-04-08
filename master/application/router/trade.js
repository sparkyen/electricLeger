// query.js - 

const express = require('express');
const trade = express.Router();
var cache = require('memory-cache');

const TradeService = require( "../services/electric/tradeService" );
const tradeSvcInstance = new TradeService();


trade.post('/makePretrade', async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.body.role);
    // console.log(req);
    var price = req.body.price;
    var amount = req.body.amount;
    let role = req.body.role;
    var userName = role=='producer' ? req.body.seller : req.body.buyer;
    
    console.log(role+' is using /*/makePretrade with {price:'+price+", amount:"+amount+"} ");
    
    try {
        const result = await tradeSvcInstance.makePreTrade(userName, role, price, amount);
        // console.log(result.toJSON());
        return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })



  trade.post('/makeTrade', async (req, res, next) => {
    // console.log(req.body);
    // console.log(req);
    var buyer = req.body.buyer;
    var seller = req.body.seller;
    var role = req.body.role;

    console.log(role+' is using /*/makeTrade');
    // var userName = 'wizard';
    // var userName = cache.get(role)
    try {
        const result = await tradeSvcInstance.makeTrade(seller, buyer, role);
        // console.log(result);
        return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })

module.exports = trade;