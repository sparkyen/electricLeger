'use strict';
// Fabric smart contract classes
const {
    Contract,
    Context
} = require('fabric-contract-api');

/**
 * Define PharmaLedger smart contract by extending Fabric Contract class
 *
 */
class ElectricContract extends Contract {

    constructor() {
        // Unique namespace pcn - PharmaChainNetwork when multiple contracts per chaincode file
        super('org.pln.PharmaLedgerContract');
    }
    /**
     * Instantiate to set up ledger.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No default implementation for this example
        console.log('Instantiate the Elctric contract');
    }

    async initAccount(ctx, name, role) {
        console.info('============= START : initAccount call ===========');
        let dt = new Date().toString(),
            accountID = "account-" + name;
        let accountDetail = {};
        accountDetail.name = name;
        accountDetail.role = role;
        accountDetail.amount = 3400;
        accountDetail.balance = 52000;
        if (role == 'admin') accountDetail.permission = 1;
        else accountDetail.permission = 0;
        accountDetail.updateTime = dt;

        console.log(accountID + " is using");
        console.log(accountDetail);
        await ctx.stub.putState(accountID, Buffer.from(JSON.stringify(accountDetail)));

        console.info('============= END : initAccount Done ===========');
    }

    async activeAccount(ctx, name) {
        console.info('============= START : activeAccount call ===========');
        let dt = new Date().toString(),
            accountID = "account-" + name;
        const accountAsBytes = await ctx.stub.getState(accountID);
        if (!accountAsBytes || accountAsBytes.length === 0) {
            throw new Error(`account ${accountID} does not exist`);
        }
        const strValue = Buffer.from(accountAsBytes).toString('utf8');
        const record = JSON.parse(strValue);
        record.permission = 1;
        record.updateTime = dt;

        console.log(accountID + " is using");
        console.log(record);
        await ctx.stub.putState(accountID, Buffer.from(JSON.stringify(record)));

        console.info('============= END : activeAccount Done ===========');
    }


    async rechargeAccount(ctx, name, money) {
        console.info('============= START : rechargeAccount call ===========');
        let dt = new Date().toString(),
            accountID = "account-" + name;
        const accountAsBytes = await ctx.stub.getState(accountID);
        if (!accountAsBytes || accountAsBytes.length === 0) {
            throw new Error(`account ${accountID} does not exist`);
        }
        const strValue = Buffer.from(accountAsBytes).toString('utf8');
        const record = JSON.parse(strValue);
        record.balance = parseFloat(record.balance) + parseFloat(money);
        record.updateTime = dt;

        console.log(accountID + " is using");
        console.log(record);
        await ctx.stub.putState(accountID, Buffer.from(JSON.stringify(record)));
        console.info('============= END : rechargeAccount Done ===========');
    }

    //bottomPrice==-1代表手动交易
    async makePreTrade(ctx, name, cate, expectPrice, bottomPrice, amount) {
        console.info('============= START : makePreTrade call ===========');
        let dt = new Date().toString();
        let equipment = {}, orderID;
        equipment.expectPrice = parseFloat(expectPrice);
        equipment.bottomPrice = parseFloat(bottomPrice);
        equipment.amount = parseFloat(amount);
        equipment.available = 1;
        equipment.createDateTime = dt;
        if (cate == "sell") equipment.seller = name, orderID = "sell-" + name;
        else equipment.buyer = name, orderID = "purchase-" + name;

        console.log(orderID + " is using");
        console.log(equipment);
        await ctx.stub.putState(orderID, Buffer.from(JSON.stringify(equipment)));
        console.info('============= END : Create preTrade ===========');
    }

    async makeTrade(ctx, seller, buyer) {

        // function getRecord
        console.info('============= START : makeTrade call ===========');
        //1. 交易确认
        let dt = new Date().toString();
        let order = {};
        order.seller = seller;
        order.buyer = buyer;
        //1.1 获取交易细节
        var purchaseRecordID = "purchase-" + buyer;
        var sellRecordID = "sell-" + seller;
        const sellEquipmentAsBytes = await ctx.stub.getState(sellRecordID);
        if (!sellEquipmentAsBytes || sellEquipmentAsBytes.length === 0) {
            throw new Error(`${sellRecordID} does not exist`);
        }
        const purchaseEquipmentAsBytes = await ctx.stub.getState(purchaseRecordID);
        if (!purchaseEquipmentAsBytes || purchaseEquipmentAsBytes.length === 0) {
            throw new Error(`${purchaseRecordID} does not exist`);
        }
        const sellStrValue = Buffer.from(sellEquipmentAsBytes).toString('utf8');
        const purchaseStrValue = Buffer.from(purchaseEquipmentAsBytes).toString('utf8');
        
        
        let sellRecord, purchaseRecord;
        try {
            sellRecord = JSON.parse(sellStrValue);
            purchaseRecord = JSON.parse(purchaseStrValue);
            order.price = (parseFloat(sellRecord.expectPrice)+parseFloat(purchaseRecord.expectPrice))/2
            order.amount = Math.min(sellRecord.amount, purchaseRecord.amount)
            sellRecord.amount = parseFloat(sellRecord.amount)-parseFloat(order.amount);
            purchaseRecord.amount = parseFloat(purchaseRecord.amount)-parseFloat(order.amount);
            order.createDateTime = dt;
        } catch (err) {
            console.log(err);
            throw new Error(`equipmet ${sellRecordID} and ${purchaseRecordID} data can't be processed`);
        }
        //1.2 确认账号信息
        const buyerAsBytes = await ctx.stub.getState("account-" + buyer);
        const sellerAsBytes = await ctx.stub.getState("account-" + seller);
        if (!buyerAsBytes || buyerAsBytes.length === 0) {
            throw new Error(`account ${buyer} does not exist`);
        }
        if (!sellerAsBytes || sellerAsBytes.length === 0) {
            throw new Error(`account ${seller} does not exist`);
        }
        const strValue1 = Buffer.from(buyerAsBytes).toString('utf8'),
            buyerRecord = JSON.parse(strValue1);
        const strValue2 = Buffer.from(sellerAsBytes).toString('utf8'),
            sellerRecord = JSON.parse(strValue2);
        let totPrice = parseFloat(order.price) * parseFloat(order.amount);
        // let isTrade = 1;
        //buyer action
        buyerRecord.balance = parseFloat(buyerRecord.balance) - totPrice;
        buyerRecord.amount = parseFloat(buyerRecord.amount) + parseFloat(order.amount);
        buyerRecord.updateTime = dt;
        //seller action
        sellerRecord.balance = parseFloat(sellerRecord.balance) + totPrice;
        sellerRecord.amount = parseFloat(sellerRecord.amount) - parseFloat(order.amount);
        sellerRecord.updateTime = dt;

        try {
            //2.1 更改发布信息
            if(sellRecord.amount==0) sellRecord = null;
            if(purchaseRecord.amount==0) purchaseRecord = null;
            console.log(sellRecord);
            console.log(purchaseRecord);
            await ctx.stub.putState(sellRecordID, Buffer.from(JSON.stringify(sellRecord)));
            await ctx.stub.putState(purchaseRecordID, Buffer.from(JSON.stringify(purchaseRecord)));

            //2.2 双方进行交易
            console.info('----------------------------------------------');
            console.log(order);
            await ctx.stub.putState("trade-" + seller, Buffer.from(JSON.stringify(order)));
            await ctx.stub.putState("trade-" + buyer, Buffer.from(JSON.stringify(order)));

            //2.3 更新账号信息
            console.info('----------------------------------------------');
            console.log(buyerRecord);
            console.log(sellerRecord);
            await ctx.stub.putState("account-" + buyer, Buffer.from(JSON.stringify(buyerRecord)))
            await ctx.stub.putState("account-" + seller, Buffer.from(JSON.stringify(sellerRecord)))
            console.info('============= END : Create trade ===========');
        } catch (err) {
            console.log(err);
        }

    }

    

    async queryByKey(ctx, key) {
        console.info('============= Getting record for key: ' + key + "============= ");
        let value = await ctx.stub.getState(key);
        const strValue = Buffer.from(value).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            console.log(record);
        } catch (err) {
            console.log(err);
            record = strValue;
        }
        console.info('============= Get record with compelteKey done ============= ');
        return JSON.stringify(record);
        // return JSON.stringify({
        //     Key: key,
        //     Record: record
        // });
    }

    async queryHistoryByKey(ctx, key) {
        console.info('============= Getting history records for key: ' + key + "============= ");
        let iterator = await ctx.stub.getHistoryForKey(key);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        // await iterator.close();
        console.info(result);
        console.info('============= Get history records done ============= ');
        return JSON.stringify(result);
    }

    async queryByPartialKey(ctx, startKey, endKey) {
        console.info("============= Getting records for partialKey ============= ");
        let iterator = await ctx.stub.getStateByRange(startKey, endKey);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                const obj = JSON.parse(res.value.value.toString('utf8'));
                result.push(obj);
            }
            res = await iterator.next();
        }
        // await iterator.close();
        console.info(result);
        console.info('============= Get records with partialKey done');
        return JSON.stringify(result);
    }

}
module.exports = ElectricContract;
