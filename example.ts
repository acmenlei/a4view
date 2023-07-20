import A4View from "./index";

new A4View({
  target: document.querySelector(".container") as HTMLElement,
  pageGap: 20,
  background: '#666'
}).render(".preview");
