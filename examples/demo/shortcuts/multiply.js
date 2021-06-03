module.exports = function (...args){
  return args.reduce((acc, val) => acc * val);
}
