import A4View from "a4view";

new A4View({
  target: document.querySelector(".container") as HTMLElement,
  pageGap: 20,
  background: '#666'
}).render(".preview");
