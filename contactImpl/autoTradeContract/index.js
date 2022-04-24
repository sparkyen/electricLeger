/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const assetTransfer = require('./lib/assetTransfer');
const electricContract = require('./lib/electric.js');

module.exports.AssetTransfer = assetTransfer;
module.exports.electric = electricContract;
module.exports.contracts = [assetTransfer, electricContract];
