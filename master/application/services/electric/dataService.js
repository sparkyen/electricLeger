/*
 # O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 # farma ledger supply chain network
 # Author: Brian Wu
 # QueryService -queryByKey:
 */
'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const accountService = require('../electric/accountService');
const queryService = require('../electric/queryService');
const tradeService = require('../electric/tradeService');
const acutionService = require('../electric/acutionService');

const accountSvcInstance = new accountService();
const querySvcInstance = new queryService();
const tradeSvcInstance = new tradeService();
const acutionSvcInstance = new acutionService();

class DataService {
    randomNum(m, n) {
        return Math.floor(Math.random() * (n - m)) + m;
    }
    
    randomFloat(m, n) {
        return parseFloat((Math.random() * (n - m) + m).toFixed(2));
    }
    
    randomString(length) {
        var str = 'abcdefghijklmnopqrstuvwxyz';
        var result = '';
        for (var i = length; i > 0; --i) 
            result += str[Math.floor(Math.random() * str.length)];
        return result;
    }
    
    async dataGenerater(cate, num, minPrice, maxPrice, minAmount, maxAmount) {
        let id = 1;
        let role;
        // data = [];
        while (id <= num) {
            let dataDetail = {};
            dataDetail.name = this.randomString(this.randomNum(3, 5)), id = id + 1;
            dataDetail.expectPrice = this.randomFloat(minPrice, maxPrice);
            if (cate == 'sell') {
                role = 'producer'
                dataDetail.bottomPrice = this.randomFloat(minPrice, dataDetail.expectPrice);
            }
            else {
                role = 'consumer'
                dataDetail.bottomPrice = this.randomFloat(dataDetail.expectPrice, maxPrice);
            }
                
            dataDetail.amount = this.randomNum(minAmount, maxAmount);
            console.log('============== begin to generat data ==============');
            await accountSvcInstance.regAccount(dataDetail.name, role);
            await accountSvcInstance.initAccount(dataDetail.name, role)
            await accountSvcInstance.activeAccount(dataDetail.name, role);
            await tradeSvcInstance.makePreTrade(dataDetail.name, cate, dataDetail.expectPrice, dataDetail.bottomPrice, dataDetail.amount);
            // data.push(dataDetail);
            
        }
        // return data;
    
    }
    
    async generate(sellerNum, buyerNum) {
        // var data = [];
        // var sellerData = 
        await this.dataGenerater('sell', sellerNum, 4.5, 9.8, 120, 240); 
        // .sort((a, b) =>{
        //     return a.expectPrice - b.expectPrice;
        // });
        // var buyerData = 
        await this.dataGenerater('buy', buyerNum, 2.3, 7.8, 50, 130);
        // .sort((a, b) =>{
        //     return b.expectPrice - a.expectPrice;
        // });
        // data.push(sellerData), data.push(buyerData);
        // console.log('Seller: '), console.log(sellerData);
        // console.log('Buyer: '), console.log(buyerData);
        // return data;
    }

}
module.exports = DataService;
