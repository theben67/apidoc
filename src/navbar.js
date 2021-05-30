module.exports = function (ressources, root_files){
  return `
    <div class="navbarContainer">
        ${root_files.map(x => `
            <a href="{{{url}}}${x.toLowerCase()}/index.html"> ${x.split("_").join(" ")} </a>
          `).join("")}
        <a href="{{{url}}}index.html"><img src="{{{url}}}logo.png" /></a>
    </div>
  `;
}
