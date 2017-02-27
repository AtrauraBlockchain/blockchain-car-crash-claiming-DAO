"use strict";

var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if its available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var BigNumber = require('bignumber.js');

var eth = web3.eth;
var async = require('async');

var CarCrashClaimDAO = require('./dist/CarCrashClaimDAO.js');

var gcb = function(err, res) {
    if (err) {
        console.log("ERROR: "+err);
    } else {
        console.log(JSON.stringify(res,null,2));
    }
}

var CarCrashClaimDAO;

function deployExample(cb) {
    cb = cb || gcb;
    async.series([
        function(cb) {
            CarCrashClaimDAO.deploy(web3, {
                tokenName: "ModuleToken",
                decimalUnits: 0,
                tokenSymbol: "MT",
                daoName: "CarCrashClaimDAO",
                founderCompanies:[ web3.eth.accounts[0], web3.eth.accounts[1]],
                modulePrice: 980,
            }, function(err, _CarCrashClaimDAO) {
                if (err) return err;
                CarCrashClaimDAO = _CarCrashClaimDAO;
                console.log("CarCrashClaimDAO: " + CarCrashClaimDAO.address);
                cb();
            });
        }
    ], cb);

}

function uploadClaim(_ipfsPdfURL, _faultCompany, _nonFaultCompany, cb) {
    cb = cb || gcb;
    async.series([
        function(cb) {
            CarCrashClaimDAO.uploadClaim(web3, {
                ipfsPdfURL: web3.toHex(_ipfsPdfURL),
                faultCompany: _faultCompany,
                nonFaultCompany: _nonFaultCompany,
            }, function(err) {
                if (err) return err;
                cb();
            });
        }
    ], cb);
}