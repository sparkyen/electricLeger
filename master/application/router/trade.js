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
    var expectPrice = req.body.expectPrice;
    var bottomPrice = req.body.bottomPrice;
    var amount = req.body.amount;
    let cate = req.body.cate;
    var userName = req.body.name;
    
    console.log('\n'+cate+' action /*/makePretrade with {expectPrice:'+expectPrice+", bottomPrice:"+bottomPrice+", amount:"+amount+"} ");
    
    try {
        const result = await tradeSvcInstance.makePreTrade(userName, cate, expectPrice, bottomPrice, amount);
        // console.log(result.toJSON());
        return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error);
    }
  
  })



  // trade.post('/makeTrade', async (req, res, next) => {
  //   // console.log(req.body);
  //   // console.log(req);
  //   var buyer = req.body.buyer;
  //   var seller = req.body.seller;
  //   var role = req.body.role;

  //   console.log('\n'+role+' is using /*/makeTrade');
  //   // var userName = 'wizard';
  //   // var userName = cache.get(role)
  //   try {
  //       const result = await tradeSvcInstance.makeTrade(seller, buyer, role);
  //       // console.log(result);
  //       return res.status(200).json(result);
  //   } catch (error) {
  //     return res.status(500).json(error);
  //   }
  
  // })

module.exports = trade;