/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const ElectricTrade = require('../lib/electric');

let assert = sinon.assert;
chai.use(sinonChai);

describe('Electric Trade Tests', () => {

    const originalLogFunction = console.log;
    let output;

    before(() =>{
        
    })

    after(() => {
        
    });

    afterEach(function() {
        console.log = originalLogFunction; // undo dummy log function
        if (this.currentTest.state === 'failed') {
          console.log(output);
        }
      });

    let transactionContext, chaincodeStub, asset;
    beforeEach(() => {
        // output = '';
        // console.log = (msg) => {
        //     output += msg + '\n';
        // };

        transactionContext = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            if(!chaincodeStub.states[key]){
                chaincodeStub.states[key] = [];
                chaincodeStub.states[key][0] = 1;
            }
            let id = chaincodeStub.states[key][0];
            chaincodeStub.states[key][id] = value;
            chaincodeStub.states[key][0] += 1
            // console.log(chaincodeStub.states);

        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states[key]) {
                let id = chaincodeStub.states[key][0]-1;
                ret = chaincodeStub.states[key][id];
            }
            return Promise.resolve(ret);
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                let id = chaincodeStub.states[key][0]-1;
                delete chaincodeStub.states[key][id];
            }
            return Promise.resolve(key);
        });

        chaincodeStub.getHistoryForKey.callsFake(async (key) => {
            // let ret;
            // if (chaincodeStub.states[key]) {
            //     console.log(chaincodeStub.states[key]);
            //     ret = chaincodeStub.states[key];
            // }
            // return Promise.resolve(chaincodeStub.states[key]);
            function* internalGetHistoryForKey() {
                if (chaincodeStub.states) {
                    // Shallow copy
                    const copied = Object.assign({}, chaincodeStub.states[key]);
                    // console.log("************  This is copied ************  ");
                    // console.log(copied);
                    // yield copied;
                    for (let index in copied) {
                        if(typeof(copied[index])=="number") continue;
                        yield {value: copied[index]};
                    }
                }
            }

            return Promise.resolve(internalGetHistoryForKey());
        });

        chaincodeStub.getStateByRange.callsFake(async (stratKey, endKey) => {
            function* internalGetStateByRange() {
                if (chaincodeStub.states) {
                    // Shallow copy
                    const copied = Object.assign({}, chaincodeStub.states);
                    // console.log("This is copied:");
                    // console.log(copied);

                    for (let key in copied) {
                        if(key < stratKey|| key > endKey) continue;
                        let id = copied[key][0] - 1;
                        yield {value: copied[key][id]};
                    }
                }
            }

            return Promise.resolve(internalGetStateByRange());
        });
    });


    describe('Basic Account Service', () => {
        describe('Test initAccount', () => {
            it('should return success on initAccount', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'wizard', 'producer');
                let ret = JSON.parse((await chaincodeStub.getState('account-wizard')).toString());
                expect(ret).to.include({
                    name: 'wizard',
                    role: 'producer',
                    amount: 3400,
                    balance: 52000,
                    permission: 0,
                  });
            });
            // it('should return error on initAccount', async () => {
                
            // });
        });

        describe('Test activeAccount', () => {
            it('should return success on activeAccount', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'wizard', 'producer');
                await electricTrade.activeAccount(transactionContext, 'wizard');
                let ret = JSON.parse((await chaincodeStub.getState('account-wizard')).toString());
                expect(ret.permission).to.eql(1);
            });
            // it('should return error on ', async () => {
                
            // });
        });

        describe('Test rechargeAccount', () => {
            it('should return success on rechargeAccount', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'wizard', 'producer');
                await electricTrade.rechargeAccount(transactionContext, 'wizard', 2615);
                let ret = JSON.parse((await chaincodeStub.getState('account-wizard')).toString());
                expect(ret.balance).to.eql(54615);
            });
            // it('should return error on ', async () => {
                
            // });
        });

    });

    describe('Basic Trade Service', () => {
        describe('Test makePreTrade', () => {
            it('should return success on makePreTrade', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.makePreTrade(transactionContext, 'wizard', 'sell', 12.9, 8.7, 240);
                let ret = JSON.parse((await chaincodeStub.getState('sell-wizard')).toString());
                expect(ret).to.include({
                    expectPrice: 12.9,
                    bottomPrice: 8.7,
                    amount: 240,
                    available: 1,
                    seller: 'wizard'
                  });
            });
            // it('should return error on ', async () => {
                
            // });
        });
        describe('Test makeTrade', () => {
            it('should return success on makeTrade', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'wizard', 'producer');
                await electricTrade.activeAccount(transactionContext, 'wizard');
                await electricTrade.initAccount(transactionContext, 'queen', 'consumer');
                await electricTrade.activeAccount(transactionContext, 'queen');
                await electricTrade.makePreTrade(transactionContext, 'wizard', 'sell', 12.4, 8.7, 240);
                await electricTrade.makePreTrade(transactionContext, 'queen', 'purchase', 9.2, 11.5, 69);
                await electricTrade.makeTrade(transactionContext, 'wizard', 'queen', 10, 55);
                let ret = JSON.parse((await chaincodeStub.getState('trade-wizard')).toString());
                expect(ret).to.include({
                    seller: 'wizard',
                    buyer: 'queen',
                    price: 10,
                    amount: 55,
                  });
            });
            // it('should return error on ', async () => {
                
            // });
        });
    });

    describe('Basic Query Service', () => {
        describe('Test queryByKey', () => {
            it('should return success on ', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'queen', 'consumer');
                let ret = await electricTrade.queryByKey(transactionContext, 'account-queen');
                ret = JSON.parse(ret);
                expect(ret).to.include({
                    name: 'queen',
                    role: 'consumer',
                    amount: 3400,
                    balance: 52000,
                    permission: 0,
                })
            });
            // it('should return error on ', async () => {
                
            // });
        });
        describe('Test queryHistoryByKey', () => {
            it('should return success on ', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'queen', 'consumer');
                await electricTrade.activeAccount(transactionContext, 'queen');
                await electricTrade.rechargeAccount(transactionContext, 'queen', 2121);
                let ret = await electricTrade.queryHistoryByKey(transactionContext, 'account-queen');
                ret = JSON.parse(ret);
                expect(ret[0]).to.include({name: 'queen',role: 'consumer',amount: 3400,balance: 52000,permission: 0});
                expect(ret[1]).to.include({name: 'queen',role: 'consumer',amount: 3400,balance: 52000,permission: 1});
                expect(ret[2]).to.include({name: 'queen',role: 'consumer',amount: 3400,balance: 54121,permission: 1});
            });
            // it('should return error on ', async () => {
                
            // });
        });

        describe('Test queryByPartialKey', () => {
            it('should return success on ', async () => {
                let electricTrade = new ElectricTrade();
                await electricTrade.initAccount(transactionContext, 'wizard', 'producer');
                await electricTrade.initAccount(transactionContext, 'queen', 'consumer');
                await electricTrade.initAccount(transactionContext, 'XiaoPei', 'admin');
                await electricTrade.makePreTrade(transactionContext, 'wizard', 'sell', 12.4, 8.7, 240);
                let ret = await electricTrade.queryByPartialKey(transactionContext, 'account-', 'account-z');
                ret = JSON.parse(ret);                
                expect(ret[0]).to.include({name: 'wizard',role: 'producer',amount: 3400,balance: 52000,permission: 0})
                expect(ret[1]).to.include({name: 'queen',role: 'consumer',amount: 3400,balance: 52000,permission: 0})
                expect(ret[2]).to.include({name: 'XiaoPei',role: 'admin',amount: 3400,balance: 52000,permission: 1})
                // expect(ret[3]).to.not.include({expectPrice: 12.9,bottomPrice: 8.7,amount: 240,available: 1,seller: 'wizard'});
            });
            // it('should return error on ', async () => {
                
            // });
        });
    });

    describe('Trade Strategy Service', () => {
        describe('Test Strategy', () => {
            
            it('should return success on ', async () => {
                
            });
        })
    })

});
