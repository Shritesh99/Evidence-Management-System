"use strict";

const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");
const { TransactionHeader } = require("sawtooth-sdk/protobuf");

const UTILS = require("./utils");
const EMSState = require("./state");
const EMSPayload = require("./payload");

const SYNC_TOLERANCE = 5 * 60 * 1000; // 5 min sync tolerance

class EMSHandler extends TransactionHandler {
	constructor() {
		console.log("Initializing EMS handler for Evidence Management System");
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
		return state.getPerson(signer).then((person) => {
			if (!person)
				throw new InvalidTransaction(
					`Person with the public key ${signer} does not exists`
				);
			return state.createEvidence(signer, person, payload.data);
		});
	}

	createPerson(signer, state, payload) {
		return state.getPerson(signer).then((person) => {
			if (person)
				throw new InvalidTransaction(
					`Person with the public key ${signer} already exists`
				);
			return state.createPerson(signer, payload.data);
		});
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
