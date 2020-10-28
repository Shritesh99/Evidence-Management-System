"use strict";
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");
const Utils = require("./utils");
class EMSPayload {
	constructor(payload) {
		if (payload) {
			try {
				const JSONPayload = Utils.decode(payload);
				if (!JSONPayload.action)
					throw new InvalidTransaction("Action is required");
				else if (!JSONPayload.timestamp)
					throw new InvalidTransaction("Timestamp is required");
				this.payload = JSONPayload;
			} catch (err) {
				throw new InvalidTransaction(
					"Failed to decode payload: " + err
				);
			}
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
			(this.payload.action === "CREATE_EVIDENCE" ||
				this.payload.action === "CREATE_PERSON") &&
			this.payload.data
		)
			return this.payload.data;
		else
			throw new InvalidTransaction(
				"Action does not have payload data"
			);
	}
}

module.exports = EMSPayload;
