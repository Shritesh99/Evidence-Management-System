"use strict";

const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");

const UTILS = require("./utils");

class EMSState {
	constructor(context, timeout = 500) {
		this.context = context;
		this.timeout = timeout;
	}

	getPerson(signer) {
		const address = UTILS.getPersonAddress(signer);
		return this.context
			.getState([address], this.timeout)
			.then((entries) => {
				const entry = entries[address];
				if (!entry || entry.length === 0) return null;
				return UTILS.decode(entry);
			});
	}

	createPerson(signer, data) {
		if (!data.name) throw new InvalidTransaction("No name provided");
		if (!data.email) throw new InvalidTransaction("No email provided");
		if (!data.password)
			throw new InvalidTransaction("No password provided");
		if (!data.timestamp)
			throw new InvalidTransaction("No timestamp provided");
		const address = UTILS.getPersonAddress(signer);
		const person = {
			name: data.name,
			email: data.email,
			password: data.password,
			timestamp: data.timestamp,
			evidences: [],
			publicKey: signer,
		};
		return this.context.setState(
			{ [address]: UTILS.encode(person) },
			this.timeout
		);
	}

	createEvidence(signer, person, data) {
		if (!data.cid) throw new InvalidTransaction("No cid provided");
		if (!data.title) throw new InvalidTransaction("No title provided");
		if (!data.timestamp)
			throw new InvalidTransaction("No timestamp provided");
		if (!data.mimeType)
			throw new InvalidTransaction("No mime type provided");
		const evidence = {
			title: data.title,
			timeout: data.timeout,
			owner: signer,
			cid: data.cid,
			mimeType: data.mimeType,
		};
		const eAddress = UTILS.getEvidenceAddress(data.cid);
		const pAddress = UTILS.getPersonAddress(signer);
		person.evidences.push(eAddress);
		return this.context.setState(
			{
				[pAddress]: UTILS.encode(person),
				[eAddress]: UTILS.encode(evidence),
			},
			this.timeout
		);
	}
}

module.exports = EMSState;
