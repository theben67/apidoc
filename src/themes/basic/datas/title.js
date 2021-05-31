module.exports = function(datas) {
  if(datas.folder.length == 0) return datas.argv.homeTitle;
  return datas.folder.split(datas.path_sep).filter((x,i) => i > datas.folder.split(datas.path_sep).length - 3).map(x => x.charAt(0).toUpperCase() + x.slice(1) ).join(" " + datas.argv.separator + " ").split("_").join(" ");
}
