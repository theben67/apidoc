const fs = require("fs"),
  path = require("path");

module.exports = {
  async readMdSources(folder){
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
  async getJSModules(folder){
    try {
      let result = [], files = await fs.promises.readdir(folder);
      for(let i = 0; i < files.length; i++){
        let component = {
          name: files[i].split(".js").join(""),
          filename: files[i],
          path: path.join(folder, files[i]),
          exec: require(path.join(folder, files[i]))
        };
        result.push(component);
      }
      return result;
    } catch(err) {
      throw new Error(err)
    }
  },
  parseHmlDynamicDatas(html, datas, datasParams, methods){
    for(let data of datas) html = html.replace(new RegExp(`{{{${data.name}}}}`, "gi"), data.exec(datasParams));
    for(let method of methods) html = html.replace(new RegExp(`{{{${method.name}\((.*)\)}}}`, "gi"), function(match, contents, offset, input_string){
        return eval("method.exec" + contents);
    });
    return html;
  }
}
