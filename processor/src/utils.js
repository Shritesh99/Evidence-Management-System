"use strict";

const { createHash } = require("crypto");

const FAMILY = "Evidence_Management_System";
const TYPES = {
    EVIDENCE: "evidence",
    PERSON: "person",
};

const NAMESPACE_BASE_LENGTH = 6;
const NAMESPACE_OFFSET_LENGTH = 62;
const NAMESPACE_PREFIX_OFFSET_LENGTH = 64;
const TYPE_PREFIXES = { 
    EVIDENCE_PREFIX = "00",
    PERSON_PREFIX = "01"
}

// Encoding helpers and constants
const getAddress = (key, length = NAMESPACE_PREFIX_OFFSET_LENGTH) =>
    createHash("sha512").update(key).digest("hex").slice(0, length);

const NAMESPACE = getAddress(FAMILY, NAMESPACE_BASE_LENGTH);

const getEvidenceAddress = (name) =>
    PREFIX + EVIDENCE_PREFIX.EVIDENCE_PREFIX + getAddress(name, NAMESPACE_OFFSET_LENGTH);

const getPersonAddress = (asset) =>
    PREFIX + TYPE_PREFIXES.PERSON_PREFIX + getAddress(asset, NAMESPACE_OFFSET_LENGTH);

const getType = (address) =>
    address.slice(NAMESPACE_BASE_LENGTH + 1, NAMESPACE_BASE_LENGTH + 3) ==
    TYPE_PREFIXES.EVIDENCE_PREFIX
        ? TYPES.EVIDENCE
        : TYPES.PERSON;

const encode = (obj) =>
    Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));

const decode = (buf) => JSON.parse(buf.toString());

module.exports = {
    FAMILY,
    TYPES,
    NAMESPACE,
    getAddress,
    getEvidenceAddress,
    getPersonAddress,
    getType,
    encode,
    decode,
};
