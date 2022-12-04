#! /usr/bin/env node --no-warnings

const { fetchRawAdventData, writeAndLog } = require('../utils');
const authHeaders = require('../auth.json');

const [, , day, relativeFilePath] = process.argv;

writeAndLog(relativeFilePath, day, authHeaders);
