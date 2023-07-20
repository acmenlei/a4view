export function query(pdfSelector: string): HTMLElement | null {
  const pdf = document.querySelector(pdfSelector);
  if (!pdf) {
    console.error(` ${pdfSelector} is an invalid container `);
    return null;
  }
  return <HTMLElement>pdf;
}

export function createStyle() {
  return document.createElement('style')
}

export function createDIV() {
  return document.createElement('div')
}