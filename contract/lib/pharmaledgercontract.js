/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * farma ledger supply chain network smart contract
 * O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 * Author: Brian Wu
 */
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
class PharmaLedgerContract extends Contract {

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
        if (role == 'supervisor') accountDetail.permission = 1;
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

    async makePreTrade(ctx, name, cate, price, amount) {
        console.info('============= START : makePreTrade call ===========');
        let dt = new Date().toString();
        let equipment = {}, orderID;
        equipment.price = parseFloat(price);
        equipment.amount = parseFloat(amount);
        equipment.available = 1;
        equipment.createDateTime = dt;
        if (cate == "producer") equipment.seller = name, orderID = "sell-" + name;
        else equipment.buyer = name, orderID = "purchase-" + name;

        console.log(orderID + " is using");
        console.log(equipment);
        await ctx.stub.putState(orderID, Buffer.from(JSON.stringify(equipment)));
        console.info('============= END : Create preTrade ===========');
    }

    async makeTrade(ctx, seller, buyer, role) {
        console.info('============= START : makeTrade call ===========');
        //1. 交易确认
        let dt = new Date().toString();
        let order = {};
        order.seller = seller;
        order.buyer = buyer;
        order.createDateTime = dt;
        //1.1 获取交易细节
        var recordID;
        if (role == "producer") recordID = "purchase-" + buyer;
        else recordID = "sell-" + seller;
        const equipmentAsBytes = await ctx.stub.getState(recordID);
        if (!equipmentAsBytes || equipmentAsBytes.length === 0) {
            throw new Error(`${recordID} does not exist`);
        }
        const strValue = Buffer.from(equipmentAsBytes).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            order.price = record.price;
            order.amount = record.amount;
        } catch (err) {
            console.log(err);
            throw new Error(`equipmet ${recordID} data can't be processed`);
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
        let totPrice = parseFloat(record.price) * parseFloat(record.amount);
        // let isTrade = 1;
        //buyer action
        buyerRecord.balance = parseFloat(buyerRecord.balance) - totPrice;
        buyerRecord.amount = parseFloat(buyerRecord.amount) + parseFloat(record.amount);
        buyerRecord.updateTime = dt;
        //seller action
        sellerRecord.balance = parseFloat(sellerRecord.balance) + totPrice;
        sellerRecord.amount = parseFloat(sellerRecord.amount) - parseFloat(record.amount);
        sellerRecord.updateTime = dt;
        let msg = "";
        if(buyerRecord.permission == 0 ) msg += " buyer do not have trade permission &";
        if(sellerRecord.permission == 0) msg += " seller do not have trade permission &";
        if(buyerRecord.balance < 0) msg += " buyer do not have enough money &";
        if(sellerRecord.amount < 0 ) msg += " seller do not have enough electric amount &";
        if(record.available == 0) msg += " this trade order is unavailable &";
        

        if (msg!="") {
            console.info('============= END : Trade failed > ACCOUNT ERROR ===========');
            throw new Error(msg);
        } else {
            try {
                //2.1 删除发布信息
                record.available = 0;
                console.log(record);
                await ctx.stub.putState(recordID, Buffer.from(JSON.stringify(record)));

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
                console.info('============= END : Trade failed > SELL/PURCAHSE ORDER HAS DONE ===========');
            }

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
        return JSON.stringify({
            Key: key,
            Record: record
        });
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
        await iterator.close();
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
        await iterator.close();
        console.info(result);
        console.info('============= Get records with partialKey done');
        return JSON.stringify(result);
    }


    //origin
    async makeEquipment(ctx, manufacturer, equipmentNumber, equipmentName, ownerName) {
        console.info('============= START : makeEquipment call ===========');
        let dt = new Date().toString();
        const equipment = {
            equipmentNumber,
            manufacturer,
            equipmentName,
            ownerName,
            previousOwnerType: 'MANUFACTURER',
            currentOwnerType: 'MANUFACTURER',
            createDateTime: dt,
            lastUpdated: dt
        };
        await ctx.stub.putState(equipmentNumber, Buffer.from(JSON.stringify(equipment)));
        console.info('============= END : Create equipment ===========');
    }

    async wholesalerDistribute(ctx, equipmentNumber, ownerName) {
        console.info('============= START : wolesalerDistribute call ===========');
        const equipmentAsBytes = await ctx.stub.getState(equipmentNumber);
        if (!equipmentAsBytes || equipmentAsBytes.length === 0) {
            throw new Error(`${equipmentNumber} does not exist`);
        }
        let dt = new Date().toString();
        const strValue = Buffer.from(equipmentAsBytes).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            if (record.currentOwnerType !== 'MANUFACTURER') {
                throw new Error(` equipment - ${equipmentNumber} owner must be MANUFACTURER`);
            }
            record.previousOwnerType = record.currentOwnerType;
            record.currentOwnerType = 'WHOLESALER';
            record.ownerName = ownerName;
            record.lastUpdated = dt;
        } catch (err) {
            console.log(err);
            throw new Error(`equipmet ${equipmentNumber} data can't be processed`);
        }
        await ctx.stub.putState(equipmentNumber, Buffer.from(JSON.stringify(record)));
        console.info('============= END : wolesalerDistribute  ===========');
    }

    async pharmacyReceived(ctx, equipmentNumber, ownerName) {
        console.info('============= START : pharmacyReceived call ===========');
        const equipmentAsBytes = await ctx.stub.getState(equipmentNumber);
        if (!equipmentAsBytes || equipmentAsBytes.length === 0) {
            throw new Error(`${equipmentNumber} does not exist`);
        }
        let dt = new Date().toString();
        const strValue = Buffer.from(equipmentAsBytes).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            //make sure owner is wholesaler
            if (record.currentOwnerType !== 'WHOLESALER') {
                throw new Error(` equipment - ${equipmentNumber} owner must be WHOLESALER`);
            }
            record.previousOwnerType = record.currentOwnerType;
            record.currentOwnerType = 'PHARMACY';
            record.ownerName = ownerName;
            record.lastUpdated = dt;
        } catch (err) {
            console.log(err);
            throw new Error(`equipmet ${equipmentNumber} data can't be processed`);
        }
        await ctx.stub.putState(equipmentNumber, Buffer.from(JSON.stringify(record)));
        console.info('============= END : pharmacyReceived  ===========');
    }
}
module.exports = PharmaLedgerContract;
