const fs = require("fs"),
  path = require("path"),
  ncp = require('ncp').ncp,
  utils = require('./utils.js'),
  generateSidebar = require("./sidebar.js"),
  generateNavbar = require("./navbar.js"),
  generatePage = require("./page.js"),
  showdown = require('showdown'),
  argv = require('minimist')(process.argv.slice(2));;
let converter = new showdown.Converter({tables: true});

argv.version = String(argv.version)
argv.out = !argv.out || argv.out.length <= 0 ? 'build' : argv.out;

async function main(){
  try {
    let outputDir = path.join(argv.out, argv.version);
    await fs.rmdirSync(outputDir, { recursive: true });
    await fs.promises.mkdir(outputDir, { recursive: true });
    const doc = new Doc(argv.name);
    ncp(path.join(argv.src,"static"), outputDir);
  } catch(err){
    console.error(err);
    process.exit();
  }
}
main();


class Doc {

  constructor(name){
    this.name = name,
    this.init()
  }

  async init(){
    this.ressources = await utils.getRessources(path.join(argv.src ,"markdown"));
    this.sidebar = generateSidebar(this.ressources, { name: this.name, version: argv.version });
    this.navbar = generateNavbar(this.ressources);
    this.indexHtml = await fs.promises.readFile(path.join(argv.src, "index.html"),'utf8');
    this.emptyDefaultHtml = this.indexHtml.split("{{{sidebar}}}").join(this.sidebar).split("{{{navbar}}}").join(this.navbar);
    for(let ressource of this.ressources){
      await this.createHtmlPage(path.join(argv.src,"markdown",ressource.name,"main.md"), ressource.name.toLowerCase());
      for(let category of ressource.categories){
        await this.createHtmlPage(path.join(argv.src,"markdown",ressource.name,category.name,"main.md"), path.join(ressource.name.toLowerCase(), category.name.toLowerCase()));
        for(let request of category.requests) {
          await this.createHtmlPage(path.join(argv.src,"markdown",ressource.name,category.name,request), path.join(ressource.name.toLowerCase(), category.name.toLowerCase(), request.toLowerCase().split(".md").join("")));
        }
      }
    }
    await this.createHtmlPage(path.join(argv.src,"markdown","Overview.md"), "Overview");
    await this.createHtmlPage(path.join(argv.src,"markdown","Quickstart.md"), "Quickstart");
    await this.createHtmlPage(path.join(argv.src,"markdown","How-to_guides.md"), "How-to_guides");
    await this.createHtmlPage(path.join(argv.src,"markdown","Home.md"), "");
  }

  async createHtmlPage(mdPath, out){
    let outputDir = path.join(argv.out, argv.version);
    let ressourceMd = await fs.promises.readFile(mdPath,'utf8');
    let ressourcePage = generatePage(converter.makeHtml(ressourceMd));
    let ressourceHtml = this.emptyDefaultHtml.split("{{{page}}}").join(ressourcePage).split("{{{breadcrumbs}}}").join(utils.getBreadcrumbs(out)).split("{{{url}}}").join(utils.getUrl(out)).split("{{{title}}}").join(utils.getTitle(out));
    await fs.promises.mkdir(path.join(outputDir, out), { recursive: true });
    await fs.promises.writeFile(path.join(outputDir,out,'index.html'), ressourceHtml)
  }

}
