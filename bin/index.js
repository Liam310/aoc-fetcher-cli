#! /usr/bin/env node

const { fetchRawAdventData, writeAndLog } = require('../utils');
const authHeaders = require('../auth.json');

const [, , day, relativeFilePath] = process.argv;

writeAndLog(relativeFilePath, day, authHeaders);
