/*
 # O'Reilly - Accelerated Hands-on Smart Contract Development with Hyperledger Fabric V2
 # farma ledger supply chain network
 # Author: Brian Wu
 # WalletService -addToWallet:
 # handle wholesaler org2 wallet
 */
'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const {
  Wallets
} = require('fabric-network');
const path = require('path');
const fixtures = path.resolve(__dirname, '../../../../pln/organizations');

const authService = require('./authService.js');
const authSvcInstance = new authService();

const crypto = require('crypto');
const hash = crypto.createHash('md5');

class accountService {
  async regAccount(user, passwd, role) {
    console.log("============= regAccount > user: "+user+", role: "+role+" ==================");
    try {
      if (!user || user.length < 1) {
        throw ({
          status: 500,
          message: 'User is not defined.'
        });
      }
      // A wallet stores a collection of identities
      // const wallet = await Wallets.newFileSystemWallet('../identity/user/' + user + '/wallet');
      // /home/sean/project/electric/master/identity/user

      // console.log(('/home/sean/project/electric/master/identity/user' + user + '/wallet'));
      const wallet = await Wallets.newFileSystemWallet('/home/sean/project/electric/master/identity/user/' + user + '/wallet');
      let orgId;
      if (role == 'producer') orgId = '1';
      else if (role == 'consumer') orgId = '2';
      else orgId = '3';
      // Identity to credentials to be stored in the wallet (tmp:'+orgId+')
      const credPath = path.join(fixtures, '/peerOrganizations/org' + orgId + '.example.com/users/User1@org' + orgId + '.example.com');
      const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org' + orgId + '.example.com-cert.pem')).toString();
      const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();
      // Load credentials into wallet
      // const identityLabel = user;
      hash.update(user+passwd);
      const identityLabel = hash.digest('hex');
      const identity = {
        credentials: {
          certificate,
          privateKey
        },
        mspId: 'Org' + orgId + 'MSP',
        type: 'X.509'
      }
      // console.log(identity);
      const response = await wallet.put(identityLabel, identity);
      console.log('addToWallet mspId:Org' + orgId + `MSP response: ${response}`);
      return response ? JSON.parse(response) : response;
    } catch (error) {
      console.log(`Error adding to wallet. ${error}`);
      console.log(error.stack);
      throw ({
        status: 500,
        message: `Error adding to wallet. ${error}`
      });
    }
  }

  async initAccount(user, role) {
    let gateway;
    try {
      gateway = await authSvcInstance.getGateway(user, role);
      const network = await gateway.getNetwork('plnchannel');
      const contract = await network.getContract('pharmaLedgerContract', 'org.pln.PharmaLedgerContract');
      // console.log(network);

      console.log('Submit pharmaledger initAccount request.');
      const response = await contract.submitTransaction('initAccount', user, role);
      console.log('initAccount request complete.');
      return response;
      //?JSON.parse(response):response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({
        status: 500,
        message: `Error processing transaction. ${error}`
      });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }

  async activeAccount(user, role) {
    let gateway;
    try {
      gateway = await authSvcInstance.getGateway(user, role);
      const network = await gateway.getNetwork('plnchannel');
      const contract = await network.getContract('pharmaLedgerContract', 'org.pln.PharmaLedgerContract');

      console.log('Submit pharmaledger activeAccount request.');
      const response = await contract.submitTransaction('activeAccount', user);
      console.log('activeAccount request complete.');
      return response;
      //?JSON.parse(response):response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({
        status: 500,
        message: `Error processing transaction. ${error}`
      });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }

  async rechargeAccount(user, role, money) {
    let gateway;
    try {
      gateway = await authSvcInstance.getGateway(user, role);
      const network = await gateway.getNetwork('plnchannel');
      const contract = await network.getContract('pharmaLedgerContract', 'org.pln.PharmaLedgerContract');

      console.log('Submit pharmaledger rechargeAccount request.');
      const response = await contract.submitTransaction('rechargeAccount', user, money);
      console.log('rechargeAccount request complete.');
      return response;
      //?JSON.parse(response):response;
    } catch (error) {
      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
      throw ({
        status: 500,
        message: `Error processing transaction. ${error}`
      });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }


}
module.exports = accountService;
