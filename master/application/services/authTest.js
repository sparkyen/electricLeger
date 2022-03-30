'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const PharmaLedgerContract = require('../../contract/lib/pharmaledgercontract.js');
class Auth {
   async connect(userName, role) {
    // alert("======connet function is running");
    // console.log("======connet function is running");
    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/'+userName+'/wallet');
    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    try {
      // Load connection profile; will be used to locate a gateway
      var connectionProfile;
      console.log("role is "+role);
      if (role=="producer")
        connectionProfile = yaml.safeLoad(fs.readFileSync('../../pln/organizations/peerOrganizations/org1.example.com/connection-org1.json', 'utf8'));
      else 
        connectionProfile = yaml.safeLoad(fs.readFileSync('../../pln/organizations/peerOrganizations/org2.example.com/connection-org2.json', 'utf8'));
        // Set connection options; identity and wallet
      let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:true, asLocalhost: true }
      };
      // Connect to gateway using application specified parameters
      console.log('Connect to Fabric gateway.');
      const response = await gateway.connect(connectionProfile, connectionOptions);
      console.log(response);
      console.log('Connection complete.');
      return ({ status: 200,  message: 'successful connect to network: ' +response});
    } catch (error) {
      console.log(`Error connect to network. ${error}`);
      console.log(error.stack);
      throw ({ status: 500,  message: `Error connect to network. ${error}` });
    } finally {
      // Disconnect from the gateway
      console.log('Disconnect from Fabric gateway.')
      gateway.disconnect();
    }
  }
}
// Main program function
module.exports = Auth;
