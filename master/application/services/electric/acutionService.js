'use strict';
const accountService = require('./accountService');
const queryService = require('./queryService');
const tradeService = require('./tradeService');

const accountSvcInstance = new accountService();
const querySvcInstance = new queryService();
const tradeSvcInstance = new tradeService();

class AcutionService {
    
    trade(sellBids, buyBids) {
        console.log("================== begin to simulate trade ==================")
        let tradeRecord = [], nowSellRestNum, nowBuyRestNum;
        var bestPrice = 0, roundNum = 1;
        let k = 0.91, maxtry = 0;
        while (sellBids.length != 0 && buyBids.length != 0) {
            let m = sellBids.length, n = buyBids.length;
            let sid = 0, bid = 0;
            let sellRest = [], buyRest = [];
            
            // trade going
            console.log('*********************** Round ' + roundNum + ' ***********************');
            while (sid < m || bid < n) {
                // console.log("sellerId: "+sid+", buyerId: "+bid);
                let nowSeller = sellBids[sid], nowBuyer = buyBids[bid];
                if (nowSeller && nowBuyer && nowSeller.expectPrice <= nowBuyer.expectPrice) {
                    let tradeDetail = {};
                    tradeDetail.round = roundNum;
                    tradeDetail.seller = nowSeller.seller;
                    tradeDetail.buyer = nowBuyer.buyer;
                    bestPrice = tradeDetail.price = parseFloat(((nowSeller.expectPrice + nowBuyer.expectPrice) / 2).toFixed(2));
                    if (nowSeller.amount > nowBuyer.amount) {
                        tradeDetail.amount = nowBuyer.amount, bid += 1;
                        nowSeller.amount -= nowBuyer.amount, nowBuyer.amount = 0;
                    } else if(nowSeller.amount < nowBuyer.amount){
                        tradeDetail.amount = nowSeller.amount, sid += 1;
                        nowBuyer.amount -= nowSeller.amount, nowSeller.amount = 0;
                    }
                    else {
                        tradeDetail.amount = nowBuyer.amount;
                        bid += 1, sid += 1;
                        nowSeller.amount = nowBuyer.amount = 0;
                    }
                    tradeRecord.push(tradeDetail);
                } else {
                    if(nowSeller) sellRest.push(nowSeller), sid += 1;
                    if(nowBuyer) buyRest.push(nowBuyer), bid += 1;
                }
            }
            console.log('tradeRecord: '), console.log(tradeRecord);
            console.log('sellRest: '), console.log(sellRest);
            console.log('buyRest: '), console.log(buyRest);
    
            let done = 0;
            //???????????????(??????????????????)??????????????????
            if(sellRest.length==sellBids.length && buyRest.length==buyBids.length){
                //??????????????????????????????????????????????????????
                if(roundNum==1){
                    let sellSum = 0, buySum = 0, tmpMin, tmpMax;
                    tmpMin = 1e9, tmpMax = -1;
                    for (let i = 0; i < sellBids.length; i++) {
                        sellSum += sellBids[i].expectPrice;
                        tmpMax = Math.max(tmpMax, sellBids[i].expectPrice);
                        tmpMin = Math.min(tmpMin, sellBids[i].expectPrice);
                    }
                    sellSum = sellSum - tmpMax - tmpMin;
                    tmpMin = 1e9, tmpMax = -1;
                    for (let i = 0; i < buyBids.length; i++) {
                        buySum += buyBids[i].expectPrice;
                        tmpMax = Math.max(tmpMax, buyBids[i].expectPrice);
                        tmpMin = Math.min(tmpMin, buyBids[i].expectPrice);
                    }
                    buySum = buySum - tmpMax - tmpMin;
                    bestPrice = parseFloat(((sellSum/(sellBids.length-2)+buySum/(buyBids.length-2))/2).toFixed(2));
                }
                //??????????????????
                else if(maxtry==0) k = 1, maxtry += 1;
                else if(maxtry==1) k = 1.5, maxtry += 1;
                else if(maxtry==2) k = 2, maxtry += 1;
                else done = 1;
    
            }
            //???????????????????????????????????????????????????????????????
            if((sellRest.length==0 || buyRest.length==0) || done == 1){
                console.log("All trade has been done, market closed !")
                break;
            }
            
            console.log('==================== Best Price: '+bestPrice+' ==================== ');
            
            //??????????????????
            let srid = 0, brid = 0;
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
            sellBids = sellRest.sort(function (a, b) {
                return a.expectPrice - b.expectPrice;
            });
            buyBids = buyRest.sort(function (a, b) {
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
        // var data = this.generate(134, 120);
        // console.log(data);
        console.log("================= begin to excute trade strategy================")
        let sellDataTmp = await querySvcInstance.queryPartialKey('wizard', 'admin','sell-', 'sell-z'), sellData=[], id1 = 0;
        for(let i in sellDataTmp){
            if(sellDataTmp[i]==null) continue;
            sellData[id1++] = sellDataTmp[i];
        }
        sellData = sellData.sort((a, b) =>{
            return a.expectPrice - b.expectPrice;
        });
        let purchaseDataTmp = await querySvcInstance.queryPartialKey('wizard', 'admin','purchase-', 'purchase-z'), purchaseData=[], id2 = 0;
        for(let i in purchaseDataTmp){
            if(purchaseDataTmp[i]==null) continue;
            purchaseData[id2++] = purchaseDataTmp[i];
        }
        purchaseData = purchaseData.sort((a, b) =>{
            return b.expectPrice - a.expectPrice;
        });
        console.log('Seller: '), console.log(sellData);
        console.log('Buyer: '), console.log(purchaseData);
        let res = this.trade(sellData, purchaseData);
        console.log(res);

        for(let i in res){
            console.log(res[i])
            await tradeSvcInstance.makeTrade(res[i].seller, res[i].buyer, res[i].price, res[i].amount);
        }

        return res;

        // sellData = await querySvcInstance.queryPartialKey('wizard', 'producer','sell-', 'sell-z');
        // purchaseData = await querySvcInstance.queryPartialKey('wizard', 'producer','purchase-', 'purchase-z')
        // console.log('After Trade Seller: '), console.log(sellData);
        // console.log('After Trade Buyer: '), console.log(purchaseData);
        
    }
    
    
}

module.exports = AcutionService;