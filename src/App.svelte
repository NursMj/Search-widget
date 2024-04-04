<script>
  import SearchWidget from "./CustomElements/SearchWidget.svelte";

  const myCities = ["Bishkek", "Tokmok", "Osh"]
  const _define = customElements.define;
      customElements.define = function (name, CustomElement, options) {
        const nativeDef = _define.bind(customElements);
        nativeDef(name, CustomElement, options);
    
        // re-render the impacted elements
        setTimeout(() => {
          [...document.querySelectorAll(name)].forEach((el) => {
            const container = document.createElement("div");
            container.innerHTML = el.outerHTML;
            const newNode = container.firstElementChild;
            el.parentNode.replaceChild(newNode, el);
          });
        }, 0);
      };
</script>

<main>
  <h1>search-widget</h1>
  <search-widget cities={myCities}/>
</main>

<style>

</style>
