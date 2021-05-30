const fs = require("fs"),
  path = require("path"),
  ncp = require('ncp').ncp,
  utils = require('./utils.js'),
  generateSidebar = require("./sidebar.js"),
  generateNavbar = require("./navbar.js"),
  generatePage = require("./page.js"),
  showdown = require('showdown');
let converter = new showdown.Converter({tables: true});

class Apidoc {

  constructor(name, version, src, out, separator, homeTitle){
    this.name = name, this.version = version, this.src = src, this.out = out, this.homeTitle = homeTitle ?? "Home", this.separator = separator ?? ">";
  }

  async generate(){
    let outputDir = path.join(this.out, this.version);
    /** Remove the out dir if exist and create it */
    await fs.rmdirSync(outputDir, { recursive: true });
    await fs.promises.mkdir(outputDir, { recursive: true });
    /** Copy & past the static & the js folder into the out dir */
    await ncp(path.join(this.src,"static"), outputDir);
    await ncp(path.join(__dirname,"theme","js"), path.join(outputDir, "js"));
    /** List the folder markdown/ and keep only files  */
    let root_files = await fs.promises.readdir(path.join(this.src,"markdown"));
    for(let i = 0; i < root_files.length; i++){
      let isDirectory = await fs.statSync(path.join(this.src,"markdown",root_files[i])).isDirectory();
      if(isDirectory) {
        root_files.splice(i, 1);
        i--;
      }
    }
    /** Get dynamic HTML */
    this.ressources = await utils.getRessources(path.join(this.src ,"markdown"));
    this.sidebar = generateSidebar(this.ressources, { name: this.name, version: this.version });
    this.navbar = generateNavbar(this.ressources, root_files.map(x => x.split(".md").join("")).filter(x => x != 'main'));
    /** Create the default HTML template used everywhere */
    this.indexHtml = await fs.promises.readFile(path.join(__dirname, "theme" ,"index.html"),'utf8');
    this.emptyDefaultHtml = this.indexHtml.split("{{{sidebar}}}").join(this.sidebar).split("{{{navbar}}}").join(this.navbar);
    /** For each .md file listed in th src/ directory create a HTML file */
    for(let ressource of this.ressources){
      await this.createHtmlPage(path.join(this.src,"markdown",ressource.name,"main.md"), ressource.name.toLowerCase());
      for(let category of ressource.categories){
        await this.createHtmlPage(path.join(this.src,"markdown",ressource.name,category.name,"main.md"), path.join(ressource.name.toLowerCase(), category.name.toLowerCase()));
        for(let request of category.requests) {
          await this.createHtmlPage(path.join(this.src,"markdown",ressource.name,category.name,request), path.join(ressource.name.toLowerCase(), category.name.toLowerCase(), request.toLowerCase().split(".md").join("")));
        }
      }
    }
    /** Create HTML page from the .md files in the markdown/ folder */
    for(let file of root_files){
      let isDirectory = await fs.statSync(path.join(this.src,"markdown",file)).isDirectory();
      if(isDirectory) continue;
      if(file == "main.md") await this.createHtmlPage(path.join(this.src, "markdown", "main.md"), "");
      else await this.createHtmlPage(path.join(this.src, "markdown", file), file.split(".md").join(""));
    }
  }

  async createHtmlPage(mdPath, out){
    let outputDir = path.join(this.out, this.version);
    let ressourceMd = await fs.promises.readFile(mdPath,'utf8');
    let ressourcePage = generatePage(converter.makeHtml(ressourceMd));
    let ressourceHtml = this.emptyDefaultHtml.split("{{{page}}}").join(ressourcePage).split("{{{breadcrumbs}}}").join(utils.getBreadcrumbs(out.length <= 0 ? this.homeTitle : out, this.separator)).split("{{{url}}}").join(utils.getUrl(out)).split("{{{title}}}").join(utils.getTitle(out.length <= 0 ? this.homeTitle : out, this.separator));
    await fs.promises.mkdir(path.join(outputDir, out), { recursive: true });
    await fs.promises.writeFile(path.join(outputDir,out,'index.html'), ressourceHtml)
  }

}

module.exports = Apidoc;
