'use strict';
const accountService = require('./accountService');
const queryService = require('./queryService');
const tradeService = require('./tradeService');

const accountSvcInstance = new accountService();
const querySvcInstance = new queryService();
const tradeSvcInstance = new tradeService();

class AcutionService {
    
    trade(sellBids, buyBids) {
        let tradeRecord = [], nowSellRestNum, nowBuyRestNum;
        var bestPrice = 0, roundNum = 1;
        while (sellBids.length != 0 && buyBids.length != 0) {
            let m = sellBids.length, n = buyBids.length;
            let sid = 0, bid = 0;
            let sellRest = [], buyRest = [];
            
            // trade going
            while (sid < m && bid < n) {
                // console.log("sellerId: "+sid+", buyerId: "+bid);
                let nowSeller = sellBids[sid], nowBuyer = buyBids[bid];
                if (nowSeller.expectPrice <= nowBuyer.expectPrice) {
                    let tradeDetail = {};
                    tradeDetail.round = roundNum;
                    tradeDetail.seller = nowSeller.seller;
                    tradeDetail.buyer = nowBuyer.buyer;
                    bestPrice = tradeDetail.price = parseFloat(((nowSeller.expectPrice + nowBuyer.expectPrice) / 2).toFixed(2));
                    if (nowSeller.amount >= nowBuyer.amount) {
                        tradeDetail.amount = nowBuyer.amount, bid += 1;
                        nowSeller.amount -= nowBuyer.amount, nowBuyer.amount = 0;
                    } else {
                        tradeDetail.amount = nowSeller.amount, sid += 1;
                        nowBuyer.amount -= nowSeller.amount, nowSeller.amount = 0;
                    }
                    tradeRecord.push(tradeDetail);
                } else {
                    sellRest.push(nowSeller), sid += 1;
                    buyRest.push(nowBuyer), bid += 1;
                }
            }
            console.log('*********************** Round ' + roundNum + ' ***********************');
    
            if(sellRest.length==sellBids.length && buyRest.length==buyBids.length){
                console.log("All trade has been done, market closed !")
                break;
            }
            console.log('tradeRecord: '), console.log(tradeRecord);
            console.log('sellRest: '), console.log(sellRest);
            console.log('buyRest: '), console.log(buyRest);
    
            console.log('==================== Best Price: '+bestPrice+' ==================== ');
            //ajust
            let srid = 0, brid = 0, k = 0.91;
            for (let i = 0; i < sellRest.length; i++) {
                if (sellRest[i].expectPrice <= bestPrice) continue;
                let nowExpectPrice = sellRest[i].expectPrice - k * (sellRest[i].expectPrice - bestPrice);
                sellRest[i].expectPrice = Math.max(sellRest[i].bottomPrice, parseFloat(nowExpectPrice.toFixed(2)));
            }
            for (let i = 0; i < buyRest.length; i++) {
                if (buyRest[i].expectPrice >= bestPrice) continue;
                let nowExpectPrice = buyRest[i].expectPrice - k * (buyRest[i].expectPrice - bestPrice);
                buyRest[i].expectPrice = Math.min(buyRest[i].bottomPrice, parseFloat(nowExpectPrice.toFixed(2)));
            }
            sellBids = sellRest.sort(function(a, b) {
                return a.expectPrice - b.expectPrice;
            });
            buyBids = buyRest.sort(function(a, b) {
                return b.expectPrice - a.expectPrice;
            });
            roundNum += 1;
            
            console.log('After ajust sellBids: '), console.log(sellBids);
            console.log('After ajust buyBids: '), console.log(buyBids);
    
            // break;
        }
        return tradeRecord;
    
    
    }
    
    async excute(){
        // console.log(this.randomNum(7, 34));
        // console.log(this.randomFloat(2.3, 9.8));
        var data = this.generate(134, 120);
        // console.log(data);
        let sellData = await querySvcInstance.queryPartialKey('sell-', 'sell-z')
        let purchaseData = await querySvcInstance.queryPartialKey('purchase-', 'purchase-z')
        let res = this.trade(sellData, purchaseData);
        
        for(let item in res){
            await tradeSvcInstance.makeTrade(item.seller, item.buyer, item.price, item.amount);
        }
        
    }
    
    
}

module.exports = AcutionService;