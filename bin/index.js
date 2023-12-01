#! /usr/bin/env node --no-warnings

const { fetchRawAdventData, writeAndLog } = require('../utils');
const authHeaders = require('../auth.json');

const [, , year, day, relativeFilePath] = process.argv;

writeAndLog(relativeFilePath, year, day, authHeaders);
