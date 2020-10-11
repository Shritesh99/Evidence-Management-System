"use strict";

const { createHash } = require("crypto");
const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");
const { TransactionHeader } = require("sawtooth-sdk/protobuf");

const UTILS = require("./utils");
const EMSState = require("./state");
const EMSPayload = require("./payload");

const SYNC_TOLERANCE = 5 * 60 * 1000; // 5 min tolerance

class EMSHandler extends TransactionHandler {
	constructor() {
		console.log("Initializing JSON handler for Evidence_Management_System");
		super(UTILS.FAMILY, "0.0", [UTILS.NAMESPACE]);
	}

	apply(txn, context) {
		// Parse the transaction header and payload
		const header = TransactionHeader.decode(txn.header);
		const signer = header.signerPublicKey;
		const payload = new EMSPayload(txn.payload);
		const state = new EMSState(context);

		validateTimestamp(payload.getTimestamp());

		if (payload.getAction() === "CREATE_EVIDENCE")
			createEvidence(signer, state, payload);
		if (payload.getAction() === "CREATE_PERSON")
			createPerson(signer, state, payload);

		return Promise.resolve().then(() => {
			throw new InvalidTransaction("Invalid payload");
		});
	}
	createEvidence(signer, state, payload) {
		// TODO: Validate
	}
	createPerson(signer, state, payload) {
		// TODO: Validate
	}
	validateTimestamp(timestamp) {
		const current_time = Date.getTime();
		if (current_time - timestamp < SYNC_TOLERANCE)
			throw new InvalidTransaction(
				"Timestamp must be less than local time."
			);
	}
}

module.exports = EMSHandler;
