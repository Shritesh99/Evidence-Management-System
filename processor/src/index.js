"use strict";

const { TransactionProcessor } = require("sawtooth-sdk/processor");

const EMSHandler = require("./handlers");

const VALIDATOR_URL = "tcp://localhost:4004";

const baseApply = EMSHandler.apply;
EMSHandler.apply = (txn, context) => {
	try {
		return baseApply.call(handler, txn, context);
	} catch (err) {
		return new Promise((_, reject) => reject(err));
	}
};

// Initialize Transaction Processor
const tp = new TransactionProcessor(VALIDATOR_URL);
tp.addHandler(new EMSHandler());
tp.start();
