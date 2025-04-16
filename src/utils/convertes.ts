import { ColorArray } from "./annotations";

export function HSLToRGB(hsl: ColorArray): ColorArray {
    let [h, s, l] = hsl;
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0), f(8), f(4)];
  };

export function RGBtoHSL(rgb: ColorArray): ColorArray {
  let [r, g, b] = rgb;
  
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
      h = 0;
      s = 0;
  } else {
      let d = max - min;
      
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  
  return [h, s, l];
}