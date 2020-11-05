"use strict";

const { TransactionProcessor } = require("sawtooth-sdk/processor");

const EMSHandler = require("./handlers");

const VALIDATOR_URL = process.env.VALIDATOR_URL || "tcp://localhost:4004";

const tp = new TransactionProcessor(VALIDATOR_URL);
const handler = new EMSHandler();

const baseApply = handler.apply;
handler.apply = (txn, context) => {
	try {
		return baseApply.call(handler, txn, context);
	} catch (err) {
		return new Promise((_, reject) => reject(err));
	}
};

tp.addHandler(handler);
tp.start();
