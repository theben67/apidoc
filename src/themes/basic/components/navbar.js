module.exports = function (datas){
  return `
    <div class="navbarContainer">
        ${datas.root_files.map(x => `
            <a href="{{{url}}}${x.toLowerCase()}"> ${x.split("_").join(" ")} </a>
          `).join("")}
        <a href="{{{url}}}index.html"><img src="{{{url}}}logo.png" /></a>
    </div>
  `;
}
