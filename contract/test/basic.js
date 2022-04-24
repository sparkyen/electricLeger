'use strict';

const electricContract = require("../lib/pharmaledgercontract.js" );
const assert = require('assert');

const { ChaincodeStub, ClientIdentity } = require('fabric-shim'); 
const chai = require('chai'); 
const sinon = require('sinon'); 
const sinonChai = require('sinon-chai'); 
chai.should(); 
chai.use(sinonChai);


class Context { 
    constructor() { 
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity); 
    }
}

describe('Array', function () {
	describe('#indexOf()', function () {
	  it('should return -1 when the value is not present', function () {
		assert.equal([1, 2, 3].indexOf(4), -1);
	  });
	});
});

describe('toolTest', () => {
	describe('#assert', () =>{
		var assert = require('chai').assert
			, foo = 'bar'
			, beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

		assert.typeOf(foo, 'string'); // without optional message
		assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
		assert.equal(foo, 'bar', 'foo equal `bar`');
		assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
		assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
		assert.ty
	})
});

// describe('accountTest', () => {
// 	describe('#instantiate', () => { 
// 		it('should instantiate', async () => { 
// 			const ctx = new Context(); 
// 			const contract = new electricContract(); 
// 			const result = await contract.instantiate(ctx); 
// 			assert.equal(result, 'Instantiate Invoke');
// 		});
// 	}); 
// 	describe('#invoke transaction', () => {
// 		it('should invoke transaction', async () => { 
// 			const ctx = new Context(); 
// 			const contract = new electricContract(); 
// 			await contract.initAccount(ctx, 'wizard', 'producer'); 
// 			const result = contract.queryByKey(ctx, 'wizard-account')
			
// 			assert(revertedAddAdmin)
// 		}); 

// 	}); 

// });