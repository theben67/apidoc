module.exports = function (ressources){
  return `
    <div class="navbarContainer">
        <a href="{{{url}}}Overview/index.html"> Overview </a>
        <a href="{{{url}}}Quickstart/index.html"> Quickstart </a>
        <a href="{{{url}}}How-to_guides/index.html"> How-to guides </a>
        <a href="{{{url}}}/index.html"><img src="{{{url}}}logo.png" /></a>
    </div>
  `;
}
