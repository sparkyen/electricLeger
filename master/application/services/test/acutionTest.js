/*
 # O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 # farma ledger supply chain network
 # Author: Brian Wu
 # QueryService -queryByKey:
 */
'use strict';
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

async function dataGenerater(role, num, minPrice, maxPrice, minAmount, maxAmount) {
    let id = 0,
    // data = [];
    while (id < num) {
        let dataDetail = {};
        dataDetail.name = id, id = id + 1;
        dataDetail.expectPrice = this.randomFloat(minPrice, maxPrice);
        if (role == 'seller') {
            dataDetail.bottomPrice = this.randomFloat(minPrice, dataDetail.expectPrice);
        }
        else {
            dataDetail.bottomPrice = this.randomFloat(dataDetail.expectPrice, maxPrice);
        }
            
        dataDetail.amount = this.randomNum(minAmount, maxAmount);
        await accountSvcInstance.regAccount(dataDetail.name, role);
        await accountSvcInstance.activeAccount(dataDetail.name, role);
        await tradeSvcInstance.makePreTrade(dataDetail.name, role, dataDetail.expectPrice, dataDetail.bottomPrice, dataDetail.amount);
        // data.push(dataDetail);
        
    }
    // return data;

}

async function generate(sellerNum, buyerNum) {
    // var data = [];
    // var sellerData = 
    dataGenerater('seller', sellerNum, 4.5, 9.8, 120, 240).sort((a, b) =>{
        return a.expectPrice - b.expectPrice;
    });
    // var buyerData = 
    dataGenerater('buyer', buyerNum, 2.3, 7.8, 50, 130).sort((a, b) =>{
        return b.expectPrice - a.expectPrice;
    });
    // data.push(sellerData), data.push(buyerData);
    // console.log('Seller: '), console.log(sellerData);
    // console.log('Buyer: '), console.log(buyerData);
    // return data;
}

async function main() {
    await generate(89, 73);
    acutionSvcInstance.excute();
}

main();