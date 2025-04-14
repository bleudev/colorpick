type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type ColorArray = [number, number, number];

export enum Modes {
  RGB = 'rgb',
  HSL = 'hsl',
  HSV = 'hsv',
  CMYK = 'cmyk',
}