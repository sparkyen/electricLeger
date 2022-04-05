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
class AuthService {
  /**
  * 1. Select an identity from a wallet
  * 2. Connect to network gateway
  **/
  async getGateway(userName, role) {
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/'+userName+'/wallet');
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    console.log('userName:'+ userName + " role:"+ role);
    if(!userName || userName.length<1) {
        throw ({ status: 500,  message: 'User Name is not defined.' });
    }
    if(role!='org1'&&role!='org2'&&role!='org3') {
        throw ({ status: 500,  message: 'role is not exist.' });
    }
    try {
      // Load connection profile; will be used to locate a gateway
      var path = '../../pln/organizations/peerOrganizations/'+role+'.example.com/connection-'+role+'.json';
      let connectionProfile = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
      let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:true, asLocalhost: true }
      };
      // Connect to gateway using application specified parameters
      console.log('Connect to Fabric gateway.');
      await gateway.connect(connectionProfile, connectionOptions);
      return gateway;
    } catch (error) {
      console.log(`Error get contract. ${error}`);
      process.exit(1);
    } 
    
  }
}
module.exports = AuthService;
