const messagingTests = require('messagingTests.js');
const drawingTests = require('drawingTests.js');
const serverTests = require('serverTests.js');
const clientTests = require('clientTests.js');
//const mocha = require('mocha');

describe('All tests suite', () => {
    describe('client/socket tests', clientTests);
    describe('server tests', () => serverTests);
    describe('drawing tests', () => drawingTests);
    describe('messaging tests', () => messagingTests);
});