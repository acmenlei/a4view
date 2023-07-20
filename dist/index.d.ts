export interface IA4PagerOptions {
  target: string | HTMLElement;
  background?: string;
  pageGap?: number;
}

export default class A4Pager {
  public targetContainer: HTMLElement;
  public previewContainer: HTMLElement;
  public background: string;
  public pageGap: number;

  constructor(options: IA4PagerOptions);

  render(preview: string): void;

  setBackground(color: string): void;

  setA4Gap(gap: number): void;

  root(): HTMLElement;
}
