declare module "gsap/SplitText" {
  export class SplitText {
    constructor(target: string | Element, vars?: { type?: string });
    chars: Element[];
    words: Element[];
    lines: Element[];
  }
}
