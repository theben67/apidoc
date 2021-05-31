module.exports = function (){
  return `
    <div class="pageContainer">
      <div class="pageBreadcrumbs">
        {{{breadcrumbs}}}
      </div>
      <div class="pageMarkdown">
        {{{pageHtml}}}
      </div>
    </div>
    <script>
      let pageContainer = document.getElementsByClassName("pageContainer")[0];
      let sidebarContainer = document.getElementsByClassName("sidebarContainer")[0];
      let navbarContainer = document.getElementsByClassName("navbarContainer")[0];
      pageContainer.style.paddingTop = navbarContainer.offsetHeight + 'px';
      pageContainer.style.paddingLeft = sidebarContainer.offsetWidth + 'px';
      pageContainer.style.minHeight = "calc(100% - " + navbarContainer.offsetHeight + "px)";

      for (var i = 0; i < coll.length; i++) coll[i].addEventListener("click", collClick);

      /** Add click event to each <a> */
      var allA = document.getElementsByTagName("a");
      for(let a of allA) a.addEventListener("click", saveSidebarState);

      /** If breadcrumbs are empty, remove the header */
      var breadcrumbs = document.getElementsByClassName("pageBreadcrumbs")[0];
      var hasBreadcrumbsLinks = false;
      for(let child of breadcrumbs.children){
        if(child.innerHTML.length > 0) hasBreadcrumbsLinks = true;
      }
      if(!hasBreadcrumbsLinks) breadcrumbs.parentNode.removeChild(breadcrumbs);
    </script>
  `;
}
