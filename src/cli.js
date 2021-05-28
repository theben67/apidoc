#!/usr/bin/env node
const Apidoc = require("./index.js");
let argv = require('minimist')(process.argv.slice(2));
argv.version = String(argv.version)
argv.out = !argv.out || argv.out.length <= 0 ? 'build' : argv.out;

async function main(){
  try {
    let api = new Apidoc(argv.name, argv.version, argv.src, argv.out);
    await api.generate();
  } catch(err){
    console.error(err);
    process.exit();
  }
}
main();
