"use strict";

const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");

const Utils = require("./utils");

class EMSState {
	constructor(context, timestamp, timeout = 500) {
		this.context = context;
		this.timeout = timeout;
		this.timestamp = timestamp;
	}

	getPerson(signer) {
		const address = Utils.getPersonAddress(signer);
		return this.context
			.getState([address], this.timeout)
			.then((entries) => {
				const entry = entries[address];
				if (!entry || entry.length === 0) return null;
				return Utils.decode(entry);
			});
	}

	createPerson(signer, data) {
		if (!data.name) throw new InvalidTransaction("No name provided");
		if (!data.email) throw new InvalidTransaction("No email provided");
		const address = Utils.getPersonAddress(signer);
		const person = {
			name: data.name,
			email: data.email,
			timestamp: this.timestamp,
			evidences: [],
			publicKey: signer,
		};
		return this.context.setState(
			{ [address]: Utils.encode(person) },
			this.timeout
		);
	}

	createEvidence(signer, person, data) {
		if (!data.cid) throw new InvalidTransaction("No cid provided");
		if (!data.title) throw new InvalidTransaction("No title provided");
		if (!data.mimeType)
			throw new InvalidTransaction("No mime type provided");
		const evidence = {
			title: data.title,
			timestamp: this.timestamp,
			owner: signer,
			cid: data.cid,
			mimeType: data.mimeType,
		};
		const eAddress = Utils.getEvidenceAddress(data.cid);
		const pAddress = Utils.getPersonAddress(signer);
		person.evidences.push(eAddress);
		return this.context.setState(
			{
				[pAddress]: Utils.encode(person),
				[eAddress]: Utils.encode(evidence),
			},
			this.timeout
		);
	}
}

module.exports = EMSState;
