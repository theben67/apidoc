module.exports = function(datas) {
  if(datas.folder.split(datas.path_sep).length == 1 && datas.folder.split(datas.path_sep)[0].length <= 0) return "";
  return datas.folder.split(datas.path_sep).map(x => "../").join("");
}
