"use strict";
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");

class EMSPayload {
	constructor(payload) {
		if (payload) {
			const JSONPayload = JSON.parse(payload);
			if (!JSONPayload.action)
				throw new InvalidTransaction("Action is required");
			else if (!JSONPayload.timestamp)
				throw new InvalidTransaction("Timestamp is required");
			this.payload = JSONPayload;
		} else throw new InvalidTransaction("Invalid payload serialization");
	}
	getTimestamp() {
		return this.payload.timestamp;
	}
	getAction() {
		return this.payload.action;
	}
	getData() {
		if (
			this.payload.action === "CREATE_EVIDENCE" &&
			this.payload.create_evidence
		)
			return this.payload.create_evidence;
		else if (
			this.payload.action === "CREATE_PERSON" &&
			this.payload.create_person
		)
			return this.payload.create_person;
		else throw new InvalidTransaction("Action does not match payload data");
	}
}

module.exports = EMSPayload;
