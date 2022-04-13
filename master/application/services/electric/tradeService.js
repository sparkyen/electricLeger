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
// const PharmaLedgerContract = require('../../../contract/lib/pharmaledgercontract.js');

const authService = require('./authService.js');
const authSvcInstance = new authService();

class TradeService {
  /**
  * 1. Select an identity from a wallet
  * 2. Connect to network gateway
  * 3. Access farma ledger supply chain network
  * 4. Construct request to issue commercial paper
  * 5. Submit invoke queryByKey transaction
  * 6. Process response
  **/
  async makePreTrade(userName, role, price, amount) {
    let gateway;
    try {
      gateway = await authSvcInstance.getGateway(userName, role);
      const network = await gateway.getNetwork('plnchannel');
      const contract = await network.getContract('pharmaLedgerContract', 'org.pln.PharmaLedgerContract');

      console.log('Submit pharmaledger makePreTrade request.');
      const response = await contract.submitTransaction('makePreTrade', userName, role, price, amount);
      console.log('makePreTrade request complete.');
      return response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({ status: 500,  message: `Error processing transaction. ${error}` });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }

  async makeTrade(seller, buyer, role) {
    let gateway;
    try {
      var userName;
      if(role=='producer') userName = seller;
      else userName = buyer;
      gateway = await authSvcInstance.getGateway(userName, role);
      const network = await gateway.getNetwork('plnchannel');
      const contract = await network.getContract('pharmaLedgerContract', 'org.pln.PharmaLedgerContract');

      console.log('Submit pharmaledger makeTrade request.');
      const response = await contract.submitTransaction('makeTrade', seller, buyer, role);
      console.log('makeTrade request complete.');
      return response;
      //?JSON.parse(response):response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({ status: 500,  message: `Error processing transaction. ${error}` });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }

  }

}
module.exports = TradeService;
