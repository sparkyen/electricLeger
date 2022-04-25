/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const electricContract = require('./lib/electric.js');

module.exports.electric = electricContract;
module.exports.contracts = [electricContract];
