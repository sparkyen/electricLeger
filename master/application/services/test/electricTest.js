/*
 # O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 # farma ledger supply chain network
 # Author: Brian Wu
 # QueryService -queryByKey:
 */
'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
// const PharmaLedgerContract = require('../../../../../contract/lib/pharmaledgercontract.js');
async function main() {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../../../identity/user/wizard/wallet');
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    console.log('userName: wizard');
    // if(!userName || userName.length<1) {
    //     throw ({ status: 500,  message: 'User Name is not defined.' });
    // }
    // if(!key || key.length<1) {
    //     throw ({ status: 500,  message: 'key is not defined.' });
    // }
    try {
      // Load connection profile; will be used to locate a gateway
      let connectionProfile = yaml.safeLoad(fs.readFileSync('../../../../pln/organizations/peerOrganizations/org1.example.com/connection-org1.json', 'utf8'));
      let connectionOptions = {
        identity: "wizard",
        wallet: wallet,
        discovery: { enabled:true, asLocalhost: true }
      };
      // Connect to gateway using application specified parameters
      console.log('Connect to Fabric gateway.');
      await gateway.connect(connectionProfile, connectionOptions);
      // Access farma ledger supply chain network
      console.log('Use network channel: plnchannel.');
      const network = await gateway.getNetwork('plnchannel');
      // Get addressability to farma ledger supply chain network contract
      console.log('Use org.pln.PharmaLedgerContract smart contract.');
      const contract = await network.getContract('pharmaLedgerContract', 'org.pln.PharmaLedgerContract');

      // console.log('Submit medicine querybyKey request.');
      // await contract.submitTransaction('queryByKey', "2000.002");

      /* 测试账户功能 */
      //初始化
      // console.log('Submit electric initAccount request.');
      // await contract.submitTransaction('initAccount', 'QingWeiJie', 'producer');
      // console.log('Submit electric initAccount request.');
      // await contract.submitTransaction('initAccount', 'ZhangZhiLong', 'producer');
      // console.log('Submit electric initAccount request.');
      // await contract.submitTransaction('initAccount', 'wizard', 'producer');
      // console.log('Submit electric initAccount request.');
      // await contract.submitTransaction('initAccount', 'queen', 'consumer');
      // console.log('Submit electric initAccount request.');
      // await contract.submitTransaction('initAccount', 'XiaoYan', 'consumer');
      //充值
      // console.log('Submit electric rechargeAccount request.');
      // await contract.submitTransaction('rechargeAccount', 'wizard', 1314);
      //查询
      // console.log('Submit electric findbyKey request.');
      // await contract.submitTransaction('findByKey', 'wizard', 'account');
      // console.log('Submit electric findbyKey request.');
      // await contract.submitTransaction('findByKey', 'none', 'account');
      //激活
      // console.log('Submit electric activeAccount request.');
      // await contract.submitTransaction('activeAccount', 'wizard');
      // console.log('Submit electric activeAccount request.');
      // await contract.submitTransaction('activeAccount', 'queen');

      /*测试交易功能*/
      // console.log('Submit electric makePreTrade sell request.');
      // await contract.submitTransaction('makePreTrade', 'QingWeiJie', 'producer', 17.5, 50);
      // console.log('Submit electric makePreTrade sell request.');
      // await contract.submitTransaction('makePreTrade', 'ZhangZhiLong', 'producer', 9.8, 100);
      // console.log('Submit electric makePreTrade purchase request.');
      // await contract.submitTransaction('makePreTrade', 'XiaoYan', 'consumer', 13.5, 130);
      // console.log('Submit electric makePreTrade purchase request.');
      // await contract.submitTransaction('makePreTrade', 'wizard', 'producer', 17.8, 120);
      // console.log('Submit electric makePreTrade purchase request.');
      // await contract.submitTransaction('makePreTrade', 'queen', 'consumer', 8.5, 370);
      console.log('Submit electric makeTrade request.');
      await contract.submitTransaction('makeTrade', 'wizard', 'queen', 'producer');
      // console.log('Submit electric makeTrade request.');
      // await contract.submitTransaction('makeTrade', 'ZhangZhiLong', 'XiaoYan', 'consumer');

      /*应为error*/
      // console.log('Submit electric makeTrade request.');
      // await contract.submitTransaction('makeTrade', 'ZhangZhiLong', 'XiaoYan', 'producer');

      // console.log('Submit electric findByKey request.');
      // await contract.submitTransaction('findByKey', 'XiaoYan', 'purchase');
      // console.log('Submit electric findByKey request.');
      // await contract.submitTransaction('findByKey', 'ZhangZhiLong', 'sell');
      // console.log('Submit electric findByKey request.');
      // await contract.submitTransaction('findByKey', 'ZhangZhiLong', 'trade');
      // console.log('Submit electric findHistoryByKey request.');
      // await contract.submitTransaction('findHistoryByKey', 'ZhangZhiLong', 'sell');
      // console.log('Submit electric queryByPartialKey request.');
      // await contract.submitTransaction('queryByPartialKey', "account-", "account-z");
      // console.log('Submit electric findByPartialKey request.');
      // await contract.submitTransaction('findByPartialKey', "purchase-", "purchase-z");


    //   console.log(response);
    //   return response?JSON.parse(response):response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      process.exit(1);
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
}

main();