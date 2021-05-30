Create basic and fully customisable documentation for your API REFERENCES from markdown source to static HTML files.

### Command line usage

```
npx @bentaro/apidoc --name="API REFERENCES" --version="2.1" --out="build" --src="./examples/apidoc_v2.1" --separator="-" --homeTitle="My home page"
```

#### Command line parameters

|   Name   |  Required |      Default      |          Description          |
| -------- | --------- | ----------------- | ----------------------------- |
|   name    |    no     |   Documentation   |        Name of your documentation       |
|  version  |    no     |        1.0        |      Version of your documentation      |
|    out    |    no     |       build       |              Output folder              |
|    src    |    yes    |        n/a        |              Source folder              |
| separator |    no     |         >         |      Breadcrumbs & title separator      |
| homeTitle |    no     |        Home       | Title of the home page (src/index.html) |

### Javascript usage

```
const Apidoc = require("@bentaro/apidoc");

let api = new Apidoc(name, version, src, out, separator, homeTitle);
api.generate(); // generate is an async function
```

### How it work

Apidoc convert a specific folder tree of .md files into a basic and fully customisable website. Apidoc need some static files (css & png)

Example tree:

```
- demo_doc/
  - markdown/
    - Users/
      - Authentication/
        - createToken.md - Markdown displayed Users/createToken page
        - main.md - Markdown displayed in the Users/Authentication/ page
      - main.md - Markdown displayed in the Users/ page
    - main.md - Markdown displayed in the Home page
    - How-to_guides.md - Markdown displayed in the How-to guides page
    - Overview.md - Markdown displayed in the Overview page
    - Quickstart.md - Markdown displayed in the Quickstart page
  - static/
    - css/
      - navbar.css - CSS code of the navbar
      - page.css - CSS code of the page content (where ur markdown is displayed)
      - sidebar.css - CSS code of the sidebar
      - style.css - Global CSS code
    - favicon.png
    - logo.png
```

Become:

![](https://raw.githubusercontent.com/theben67/apidoc/master/examples/screenshot.png)

**Note**: You can find the complete source directory example [here](https://github.com/theben67/apidoc/tree/master/examples/apidoc_v2.1)

**Note**: You can change all UI style as you want, just update .css files (color, font-size etc...)

#### To know

- In this example we only have the "Users" resource with the "Authentication" category and the "createToken" request. But you can create multiple resources. And each resource can have multiple categories. And a category can have multiple requests.

- Navbar links are customisable. In our example we have "How-to guides", "Overview" and "Quickstart". But you can remove a .md file to remove his button in the navbar or rename it to change his name. Do what you want, the only rule is in the filename **the character underscore (_) is replaced by a space** in the navbar

- In .md files ```{{{url}}}``` is replaced by the current project root path
