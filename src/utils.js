const fs = require("fs"),
  path = require("path");

module.exports = {
  async getRessources(folder){
    try {
      let result = [], files = await fs.promises.readdir(folder);
      for(let i = 0; i < files.length; i++){
        let isDirectory = await fs.statSync(path.join(folder,files[i])).isDirectory()
        if(!isDirectory) continue;
        let ressource = {
          name: files[i],
          path: path.join(folder, files[i])
        };
        ressource.categories = await fs.promises.readdir(ressource.path);
        ressource.categories = ressource.categories.filter(x => fs.lstatSync(path.join(ressource.path, x)).isDirectory() )
        for(let y = 0; y < ressource.categories.length; y++){
          let category = {
            name: ressource.categories[y],
            path: path.join(ressource.path, ressource.categories[y])
          };
          category.requests = await fs.promises.readdir(category.path);
          category.requests = category.requests.filter(x => x != "main.md");
          ressource.categories[y] = category;
        }
        result.push(ressource)
      }
      return result;
    } catch(err) {
      throw new Error(err)
    }
  },
  getUrl(folder){
    if(folder.split(path.sep).length == 1 && folder.split(path.sep)[0].length <= 0) return "";
    return folder.split(path.sep).map(x => "../").join("");
  },
  getTitle(folder, separator){
    return folder.split(path.sep).filter((x,i) => i > folder.split(path.sep).length - 3).map(x => x.charAt(0).toUpperCase() + x.slice(1) ).join(" " + separator + " ").split("_").join(" ");
  },
  getBreadcrumbs(folder, separator){
    return folder.split(path.sep).map((x, i) => {
      return `
        ${i == folder.split(path.sep).length -1 ? `<span>` + x.charAt(0).toUpperCase() + x.slice(1) + `</span>` : `<a href="{{{url}}}${folder.split(path.sep).filter((y,i2) => i2 <= i).join("/")}/index.html">` + x.charAt(0).toUpperCase() + x.slice(1) + `</a>`}
      `;
    }).join(" " + separator + " ").split("_").join(" ");
  }
}
