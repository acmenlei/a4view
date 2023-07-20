import { createDIV, createStyle, query } from "./shared/shared";

const A4_HEIGHT = 1123,
  WHITE_SPACE = "WHITE_SPACE";

// 获取元素高度
function calculateElementHeight(element: HTMLElement) {
  // 获取样式对象
  const styles = getComputedStyle(element);
  // 获取元素的内容高度
  // const contentHeight = element.getBoundingClientRect().height
  const contentHeight = element.clientHeight;
  // 获取元素的外边距高度
  const marginHeight =
    +styles.getPropertyValue("margin-top").slice(0, -2) +
    +styles.getPropertyValue("margin-bottom").slice(0, -2);
  // 计算元素的总高度
  const totalHeight = contentHeight + marginHeight;
  return totalHeight;
}

// 获取元素距离目标元素顶部偏移位
function getElementTop(element: HTMLElement, target: HTMLElement) {
  let actualTop = element.offsetTop;
  let current = element.offsetParent as HTMLElement;
  while (current !== target) {
    actualTop += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  }
  return actualTop;
}

// 分割视图
export function splitPage(renderA4: HTMLElement) {
  ensureEmptyPreWhiteSpace(renderA4);
  handlerWhiteBoundary(renderA4);
  let page = 0,
    realHeight = 0;
  type Page = HTMLElement;
  const target = renderA4.clientHeight,
    A4Page: Page[] = [];
  while (target - realHeight > 0) {
    const wrapper = createDIV(),
      resumeNode = renderA4.cloneNode(true) as HTMLElement;
    wrapper.classList.add("page-wrapper");
    // 创建里面的内容 最小化高度
    const realRenderHeight = Math.min(target - realHeight, A4_HEIGHT);
    const wrapperItem = createDIV();
    wrapperItem.classList.add("page-wrapper-item");
    wrapperItem.style.height = realRenderHeight + "px";

    resumeNode.style.position = "absolute";
    resumeNode.style.top = -page * A4_HEIGHT + "px";
    resumeNode.style.left = 0 + "px";

    wrapperItem.appendChild(resumeNode);
    wrapper.appendChild(wrapperItem);

    realHeight += A4_HEIGHT;
    page++;
    A4Page.push(wrapper);
  }
  return A4Page;
}

// 确保处理之前将之前的空元素删除 否则在多页情况下多次调用会多次生成空白占位符
function ensureEmptyPreWhiteSpace(renderA4: HTMLElement) {
  const children = Array.from(renderA4.children) as HTMLElement[];
  for (const child of children) {
    if (child.getAttribute(WHITE_SPACE)) renderA4.removeChild(child);
    else {
      ensureEmptyPreWhiteSpace(child);
    }
  }
}

function createBoundaryWhiteSpace(h: number) {
  const whiteSpace = createDIV();
  whiteSpace.setAttribute(WHITE_SPACE, "true");
  // 创建边界空白占位符 加上顶部边距
  whiteSpace.style.height = h + "px";
  return whiteSpace;
}

// 处理边界内容截断
export function handlerWhiteBoundary(renderA4: HTMLElement) {
  const pt = +getComputedStyle(renderA4)
    .getPropertyValue("padding-top")
    .slice(0, -2);
  const pb = +getComputedStyle(renderA4)
    .getPropertyValue("padding-bottom")
    .slice(0, -2);
  console.log(pt, pb);
  const children = Array.from(renderA4.children) as HTMLElement[];
  const pageSize = { value: 1 };
  for (const child of children) {
    // 子元素的外边距也需要参与计算
    const height = calculateElementHeight(child);
    const actualTop = getElementTop(child, renderA4);
    // 如果总长度已经超出了一页A4纸的高度（除去底部边距的高度） 那么需要找到边界元素
    if (actualTop + height > A4_HEIGHT * pageSize.value - pb) {
      // 有子节点 继续查找 最小化空白元素的高度
      if (child.children.length) {
        // 新的一页 重新计算新页高度
        findBoundaryElement(child, renderA4, pt, pb, pageSize);
      } else {
        renderA4.insertBefore(
          createBoundaryWhiteSpace(A4_HEIGHT * pageSize.value - actualTop + pt),
          child
        );
        ++pageSize.value;
      }
    }
  }
  return renderA4;
}

// 排除多列布局不存在边界的情况
function findBoundaryElement(
  node: HTMLElement,
  target: HTMLElement,
  paddingTop: number,
  paddingBottom: number,
  pageSize: { value: number }
) {
  const children = Array.from(node.children) as HTMLElement[];
  for (const child of children) {
    const totalHeight = calculateElementHeight(child);
    const actualTop = getElementTop(child, target);
    if (actualTop + totalHeight > A4_HEIGHT * pageSize.value - paddingBottom) {
      // 直接排除一行段落文字 因为在markdown中一段文本没必要再进行深入，它们内嵌不了什么其他元素
      if (
        child.children.length &&
        !["p", "li"].includes(child.tagName.toLocaleLowerCase())
      ) {
        findBoundaryElement(child, target, paddingTop, paddingBottom, pageSize);
      } else {
        // 找到了边界 给边界元素前插入空白元素 将内容挤压至下一页
        node.insertBefore(
          createBoundaryWhiteSpace(
            A4_HEIGHT * pageSize.value - actualTop + paddingTop
          ),
          child
        );
        pageSize.value++;
      }
    }
  }
}

function initCSS(backgroundColor: string, pageGap: number) {
  const isExist = document.head.querySelector("style[A4View]");
  if (isExist) return;
  const style = createStyle();
  style.setAttribute("A4View", "true");
  style.textContent = `:root {
    --A4_width: 794px;
    --A4_height: 1123px;
  }
  .page-wrapper {
    height: var(--A4_height);
    width: var(--A4_width);
    margin-bottom: ${pageGap}px;
    background: ${backgroundColor};
    position: relative;
  }

  .page-wrapper-item {
    width: var(--A4_width);
    overflow: hidden;
    position: relative;
    background: ${backgroundColor};
  }`;
  document.head.appendChild(style);
}

interface IA4ViewOptions {
  target: string | HTMLElement;
  background?: string;
  pageGap?: number;
}

export default class A4View {
  public targetContainer: HTMLElement;
  public previewContainer: HTMLElement;
  public background: string;
  public pageGap: number;

  constructor(options: IA4ViewOptions) {
    if (typeof options.target === "string") {
      const container = query(options.target);
      if (!container) return;
      this.targetContainer = container;
    } else {
      this.targetContainer = options.target;
    }
    this.setBackground(options.background || "white");
    this.setA4Gap(options.pageGap || 10);
    this.targetContainer.style.position = 'relative'
    // 初始化CSS样式
    initCSS(this.background, this.pageGap);
  }

  render(preview: string) {
    const previewContainer = query(preview);
    if (!previewContainer) return;
    // 默认清空内容
    previewContainer.innerHTML = "";
    this.previewContainer = previewContainer;
    const pages = splitPage(this.targetContainer);
    for (const page of pages) {
      previewContainer.appendChild(page);
    }
  }

  setBackground(color: string) {
    this.background = color;
  }

  setA4Gap(gap: number) {
    this.pageGap = gap;
  }

  root() {
    return this.targetContainer;
  }
}
