Create basic and fully customisable documentation for your API REFERENCES from markdown source.

### Command line usage

```
npm run @bentaro/apidoc --name="API REFERENCES" --version="2.1" --out="build" --src="./examples/apidoc_v2.1"
```

#### Command line parameters

|   Name   |  Required |      Default      |          Description          |
| -------- | --------- | ----------------- | ----------------------------- |
|  name    |    no     |   Documentation   |   Name of your documentation  |
| version  |    no     |        1.0        | Version of your documentation |
|   out    |    no     |       build       |         Output folder         |
|   src    |    yes    |        n/a        |         Source folder         |

### Javascript usage

Coming soon...

### How it work

Apidoc convert a specific folder tree of .md files into a basic and fully customisable. Apidoc need too some static files (css & png)

Example tree:

```
- demo_doc/
  - markdown/
    - Users/
      - Authentication/
        - createToken.md - Markdown displayed Users/createToken page
        - main.md - Markdown displayed in the Users/Authentication/ page
      - main.md - Markdown displayed in the Users/ page
    - Home.md - Markdown displayed in the Home page
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

**Note**: You can find the complete source directory example [here](https://www.google.com)

**Note**: You can change all UI style as you want, just update .css files

Become:

![](https://github.com/theben67/apidoc/examples/screenshot.png)
