# a4view

If you need a preview of the A4 paging effect, then this plugin is worth a try.

## How use

```js
import A4View from "a4view";

new A4View({
  target: ".container",
}).render(".preview");
```

# Props

```ts
export interface IA4ViewOptions {
  target: string | HTMLElement;
  background?: string;
  pageGap?: number;
}

export default class A4View {
  public targetContainer: HTMLElement;
  public previewContainer: HTMLElement;
  public background: string;
  public pageGap: number;

  constructor(options: IA4ViewOptions);

  render(preview: string): void;

  setBackground(color: string): void;

  setA4Gap(gap: number): void;

  root(): HTMLElement;
}
```

## License

MIT © [coderlei](./license)
