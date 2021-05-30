#!/usr/bin/env node
const Apidoc = require("./index.js");
let argv = require('minimist')(process.argv.slice(2));

argv.version = argv.version ? String(argv.version) : "1.0";
argv.name = argv.name ? String(argv.name) : "Documentation";
argv.out = argv.out ? String(argv.out) : "build";
if(!argv.src) throw new Error("The parameter 'src' is required");

(async function(){
  try {
    let api = new Apidoc(argv.name, argv.version, argv.src, argv.out, argv.separator , argv.homeTitle);
    await api.generate();
  } catch(err){
    throw new Error(err);
  }
})()
