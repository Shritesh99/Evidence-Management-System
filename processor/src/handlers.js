"use strict";

const { createHash } = require("crypto");
const { TransactionHandler } = require("sawtooth-sdk/processor/handler");
const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");
const { TransactionHeader } = require("sawtooth-sdk/protobuf");

const UTILS = require("./utils");

class EMSHandler extends TransactionHandler {
    constructor() {
        console.log("Initializing JSON handler for Transfer-Chain");
        super(UTILS.FAMILY, "0.0", [UTILS.NAMESPACE]);
    }

    apply(txn, state) {
        // Parse the transaction header and payload
        const header = TransactionHeader.decode(txn.header);
        const signer = header.signerPubkey;
        // const { action, asset, owner } = JSON.parse(txn.payload);

        // Design payload
        // if (action === "create") return createAsset(asset, signer, state);
        // if (action === "transfer")
        //     return transferAsset(asset, owner, signer, state);
        // if (action === "accept") return acceptTransfer(asset, signer, state);
        // if (action === "reject") return rejectTransfer(asset, signer, state);

        return Promise.resolve().then(() => {
            throw new InvalidTransaction("Action must be in Payload");
        });
    }
}

module.exports = EMSHandler;
