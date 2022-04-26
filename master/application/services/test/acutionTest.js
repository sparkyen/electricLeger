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

function randomNum(m, n) {
    return Math.floor(Math.random() * (n - m)) + m;
}

function randomFloat(m, n) {
    return parseFloat((Math.random() * (n - m) + m).toFixed(2));
}

function randomString(length) {
    var str = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) 
        result += str[Math.floor(Math.random() * str.length)];
    return result;
}

async function dataGenerater(cate, num, minPrice, maxPrice, minAmount, maxAmount) {
    let id = 1;
    let role;
    // data = [];
    while (id <= num) {
        let dataDetail = {};
        dataDetail.name = randomString(3), id = id + 1;
        dataDetail.expectPrice = randomFloat(minPrice, maxPrice);
        if (cate == 'sell') {
            role = 'producer'
            dataDetail.bottomPrice = randomFloat(minPrice, dataDetail.expectPrice);
        }
        else {
            role = 'consumer'
            dataDetail.bottomPrice = randomFloat(dataDetail.expectPrice, maxPrice);
        }
            
        dataDetail.amount = randomNum(minAmount, maxAmount);
        console.log('============== begin to generat data ==============');
        await accountSvcInstance.regAccount(dataDetail.name, role);
        await accountSvcInstance.initAccount(dataDetail.name, role)
        await accountSvcInstance.activeAccount(dataDetail.name, role);
        await tradeSvcInstance.makePreTrade(dataDetail.name, cate, dataDetail.expectPrice, dataDetail.bottomPrice, dataDetail.amount);
        // data.push(dataDetail);
        
    }
    // return data;

}

async function generate(sellerNum, buyerNum) {
    // var data = [];
    // var sellerData = 
    await dataGenerater('sell', sellerNum, 4.5, 9.8, 120, 240); 
    // .sort((a, b) =>{
    //     return a.expectPrice - b.expectPrice;
    // });
    // var buyerData = 
    await dataGenerater('buy', buyerNum, 2.3, 7.8, 50, 130);
    // .sort((a, b) =>{
    //     return b.expectPrice - a.expectPrice;
    // });
    // data.push(sellerData), data.push(buyerData);
    // console.log('Seller: '), console.log(sellerData);
    // console.log('Buyer: '), console.log(buyerData);
    // return data;
}

async function main() {
    // await generate(12, 15);
    await acutionSvcInstance.excute();
}

main();