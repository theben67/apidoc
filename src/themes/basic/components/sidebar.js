module.exports = function (datas){
  return `
    <div class="sidebarContainer">
      <div class="sidebarTitleContainer">
        <span class="sidebarTitle">${datas.name}</span> <span class="sidebarVersion">v${datas.version}</span>
      </div>
      <div class="sidebarInputContainer">
        <input class="sidebarInput" id="SidebarSearch" oninput="search()" placeholder="Filter..." />
      </div>
      <hr/>
      <div class="sidebarUlsContainer">
        <ul class="sidebarRessourceUl">
          ${datas.ressources.map(x => {
            return `
              <li data-name="${x.name}" class="sidebarRessource">
                <div class="sidebarLi"> <div class="collapsible" data-from="${x.name}" data-type="ressource"></div> <a href="{{{url}}}${x.name.toLowerCase()+"/index.html"}"> ${x.name} </a> </div>
                <ul class="sidebarCategoryUl content">
                  ${x.categories.map(y => {
                    return `
                      <li data-name="${y.name}" class="sidebarCategory">
                        <div class="sidebarLi"> <div class="collapsible" data-from="${y.name}" data-type="category"></div> <a href="{{{url}}}${x.name.toLowerCase()+"/"+y.name.toLowerCase()+"/index.html"}">${y.name}</a> </div>
                        <ul class="sidebarRouteUl content">
                          ${y.requests.map(z =>
                            `
                              <li data-name="${z.split('.md').join('')}" class="sidebarRoute">
                                <div class="sidebarLi"> <a href="{{{url}}}${x.name.toLowerCase()+"/"+y.name.toLowerCase()+"/"+z.split(".md").join("").toLowerCase()+"/index.html"}">${z.split('.md').join('')}</a> </div>
                              </li>
                            `).join("")}
                        </ul>
                      </li>
                    `;
                  }).join("")}
                </ul>
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    </div>
    <script>
      function search(){
        let str = document.getElementById("SidebarSearch").value.toLowerCase();
        let elems = document.getElementsByClassName("collapsible");
        for(let i = 0; i < elems.length; i++) elems[i].classList.remove("active");
        let ressources = document.getElementsByClassName("sidebarRessource");
        for(let i = 0; i < ressources.length; i++) {
          let foundMatchRe = false;
          let categories = ressources[i].getElementsByClassName("sidebarCategory")
          for(let y = 0; y < categories.length; y++){
            let foundMatchCa = false;
            let routes = categories[y].getElementsByClassName("sidebarRoute");
            for(let z = 0; z < routes.length; z++){
              if(str == ""){
                findAncestor(routes[z], 'sidebarRouteUl').style.display = 'none';
                routes[z].style.display = 'block';
              } else if(routes[z].dataset.name.toLowerCase().indexOf(str) >= 0) {
                foundMatchRe = true;
                foundMatchCa = true;
                findAncestor(routes[z], 'sidebarRouteUl').style.display = 'block';
                routes[z].style.display = 'block';
              } else routes[z].style.display = 'none';
            }
            if(str == ""){
              findAncestor(categories[y], 'sidebarCategoryUl').style.display = 'none';
              categories[y].style.display = 'block';
            } else if(foundMatchCa || categories[y].dataset.name.toLowerCase().indexOf(str) >= 0) {
              foundMatchRe = true;
              categories[y].style.display = 'block';
              findAncestor(categories[y], 'sidebarCategoryUl').style.display = 'block';
            }
            else categories[y].style.display = 'none';
          }
          if(str == ""){
            ressources[i].style.display = 'block';
            findAncestor(ressources[i], 'sidebarRessourceUl').style.display = 'block';
          } else if(foundMatchRe || ressources[i].dataset.name.toLowerCase().indexOf(str) >= 0) {
            ressources[i].style.display = 'block';
            findAncestor(ressources[i], 'sidebarRessourceUl').style.display = 'block';
          } else ressources[i].style.display = 'none';
        }
      }
      function saveSidebarState(e){
        this.setAttribute("href", this.getAttribute("href") + "?f=click")
        let collapsibleActive = document.querySelectorAll(".sidebarLi .collapsible.active");
        let opened = [];
        for(let i = 0; i < collapsibleActive.length; i++) opened.push(collapsibleActive[i].dataset)
        localStorage.setItem("sidebarState", JSON.stringify({ search: document.getElementById("SidebarSearch").value, opened }));
      }
      function collClick() {
        this.classList.toggle("active");
        var content = getNextSibling(this, '.content');
        if (content.style.display === "block") content.style.display = "none";
        else content.style.display = "block";
      }
      function initSidebar(){

        /** Get url param "f" & remove it from the url && if he doesn't exist do nothing */
        let paramsF = getUrlParameter("f");
        window.history.pushState('',document.title,removeParam("f",document.location.href));
        if(!paramsF || paramsF != 'click') return null;

        /** If localStorage "sidebarState" doesn't exist do nothing */
        let sidebarState = localStorage.getItem("sidebarState");
        if(!sidebarState) return null;
        else sidebarState = JSON.parse(sidebarState);

        if(sidebarState.search.length > 0){
          document.getElementById("SidebarSearch").value = sidebarState.search;
          search();
          return null;
        }

        if(sidebarState.opened.length > 0){
          let collapsibleActive = document.querySelectorAll(".sidebarLi .collapsible");
          for(let i = 0; i < collapsibleActive.length; i++){
            if(sidebarState.opened.findIndex(x => x.from == collapsibleActive[i].dataset.from && x.type == collapsibleActive[i].dataset.type) >= 0){
              collClick.bind(collapsibleActive[i])()
            }
          }
        }
      }
      initSidebar();

      /** Add click event to each collapsible items */
      var coll = document.getElementsByClassName("collapsible");
      for (var i = 0; i < coll.length; i++) coll[i].addEventListener("click", collClick);

      /** Add click event to each <a> */
      var allA = document.getElementsByTagName("a");
      for(let a of allA) a.addEventListener("click", saveSidebarState);

    </script>
  `;
}
