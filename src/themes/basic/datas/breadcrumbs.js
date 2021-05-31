module.exports = function(datas) {
  if(datas.folder.length == 0) return `<span>${datas.argv.homeTitle}</span>`;
  return datas.folder.split(datas.path_sep).map((x, i) => {
    return `
      ${i == datas.folder.split(datas.path_sep).length -1 ? `<span>` + x.charAt(0).toUpperCase() + x.slice(1) + `</span>` : `<a href="{{{url}}}${datas.folder.split(datas.path_sep).filter((y,i2) => i2 <= i).join("/")}/index.html">` + x.charAt(0).toUpperCase() + x.slice(1) + `</a>`}
    `;
  }).join(" " + datas.argv.separator + " ").split("_").join(" ");
}
