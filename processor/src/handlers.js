"use strict";

const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");

const Utils = require("./utils");
const EMSState = require("./state");
const EMSPayload = require("./payload");

const SYNC_TOLERANCE = 5 * 60 * 1000; // 5 min sync tolerance

class EMSHandler extends TransactionHandler {
	constructor() {
		console.log(
			"Initializing EMS handler for Evidence Management System"
		);
		super(Utils.FAMILY, [Utils.FAMILY_VERSION], [Utils.NAMESPACE]);
	}

	apply(txn, context) {
		// Parse the transaction header and payload
		const header = txn.header;
		const signer = header.signerPublicKey;
		const payload = new EMSPayload(txn.payload);
		const state = new EMSState(context, payload.getTimestamp());

		this.validateTimestamp(payload.getTimestamp());

		if (payload.getAction() === "CREATE_EVIDENCE")
			return this.createEvidence(signer, state, payload);
		else if (payload.getAction() === "CREATE_PERSON")
			return this.createPerson(signer, state, payload);
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
			return state.createEvidence(signer, person, payload.getData());
		});
	}

	createPerson(signer, state, payload) {
		return state.getPerson(signer).then((person) => {
			if (person)
				throw new InvalidTransaction(
					`Person with the public key ${signer} already exists`
				);
			return state.createPerson(signer, payload.getData());
		});
	}
	validateTimestamp(timestamp) {
		const current_time = Date.now();
		if (current_time - timestamp > SYNC_TOLERANCE)
			throw new InvalidTransaction(
				"Timestamp must be less than local time."
			);
	}
}

module.exports = EMSHandler;
