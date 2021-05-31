const fs = require("fs"),
  path = require("path")
  ncp = require('ncp').ncp,
  utils = require('./utils.js'),
  converter = new (require('showdown')).Converter({tables: true});

class Apidoc {

  constructor(name, version, src, out, separator, homeTitle){
    this.name = name, this.version = version, this.src = src, this.out = out, this.homeTitle = homeTitle ?? "Home", this.separator = separator ?? ">", this.theme = "basic", this.outputDir = path.join(out, version);
  }

  async generate(){
    try {
      /** Remove outputDir if exist and create a new */
      await fs.rmdirSync(this.outputDir, { recursive: true });
      await fs.promises.mkdir(this.outputDir, { recursive: true });

      /** Copy into the created outputDir the "static" folder from src & the "js" folder from the selected theme */
      await ncp(path.join(this.src,"static"), this.outputDir);
      await ncp(path.join(__dirname,"themes", this.theme,"js"), path.join(this.outputDir, "js"));

      await this.initDatas();

      await this.createDefaultHTML();
      await this.createPagesFromMd();

      return "ok";
    } catch(err) {
      console.error(err);
      return err;
    }
  }

  async createHtmlFile(mdPath, out){
    try {
      let ressourceMd = await fs.promises.readFile(mdPath,'utf8');
      await fs.promises.mkdir(path.join(this.outputDir, out), { recursive: true });
      await fs.promises.writeFile(path.join(this.outputDir,out,'index.html'), utils.parseHmlDynamicDatas(this.indexHtml, this.datas, {
        argv: {
          name: this.name,
          version: this.version,
          src: this.src,
          out: this.out,
          homeTitle: this.homeTitle,
          separator: this.separator
        },
        path_sep: path.sep,
        folder: out,
        mdParsed: converter.makeHtml(ressourceMd)
      }, this.methods));
      return "ok";
    } catch(err){
      throw new Error(err);
    }
  }

  async createPagesFromMd(){
    try {
      for(let ressource of this.ressources){
        await this.createHtmlFile(path.join(this.src,"markdown",ressource.name,"main.md"), ressource.name.toLowerCase());
        for(let category of ressource.categories){
          await this.createHtmlFile(path.join(this.src,"markdown",ressource.name,category.name,"main.md"), path.join(ressource.name.toLowerCase(), category.name.toLowerCase()));
          for(let request of category.requests) {
            await this.createHtmlFile(path.join(this.src,"markdown",ressource.name,category.name,request), path.join(ressource.name.toLowerCase(), category.name.toLowerCase(), request.toLowerCase().split(".md").join("")));
          }
        }
      }
      for(let file of this.root_files){
        let isDirectory = await fs.statSync(path.join(this.src,"markdown",file)).isDirectory();
        if(isDirectory) continue;
        if(file == "main.md") await this.createHtmlFile(path.join(this.src, "markdown", "main.md"), "");
        else await this.createHtmlFile(path.join(this.src, "markdown", file), file.split(".md").join(""));
      }
      return "ok";
    } catch(err){
      throw new Error(err);
    }
  }

  async createDefaultHTML(){
    try {
      this.indexHtml = await fs.promises.readFile(path.join(__dirname, "themes", this.theme, "index.html"),'utf8');
      let componentsDatas = {
        ressources: this.ressources,
        root_files: this.root_files.map(x => x.split(".md").join("")).filter(x => x != 'main'),
        name: this.name ?? 'Documentation',
        version: this.version ?? '1.0'
      };
      for(let component of this.components) {
        this.indexHtml = this.indexHtml.replace(new RegExp(`{{{${component.name}}}}`, "gi"), component.exec(componentsDatas))
      }
      return "ok";
    } catch(err) {
      throw new Error(err);
    }
  }

  async initDatas(){
    try {
      this.root_files = await fs.promises.readdir(path.join(this.src,"markdown"));
      for(let i = 0; i < this.root_files.length; i++){
        let isDirectory = await fs.statSync(path.join(this.src,"markdown",this.root_files[i])).isDirectory();
        if(isDirectory) {
          this.root_files.splice(i, 1);
          i--;
        }
      }
      this.ressources = await utils.readMdSources(path.join(this.src ,"markdown"));
      this.components = await utils.getJSModules(path.join(__dirname, "themes", this.theme, "components"));
      this.datas = await utils.getJSModules(path.join(__dirname, "themes", this.theme, "datas"));
      this.methods = await utils.getJSModules(path.join(__dirname, "themes", this.theme, "methods"));
      return "ok";
    } catch (err) {
      throw new Error(err);
    }
  }

}

module.exports = Apidoc;
