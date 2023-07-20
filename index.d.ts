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
