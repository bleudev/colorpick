import { ColorArray, IntRange, Modes } from "../annotations";
import { HSLToRGB, RGBtoHSL } from "../convertes";
import ColorState from "./ColorState";

export default class Color {
  constructor(public mode: Modes, public states: [ColorState, ColorState, ColorState]) {
    this.mode = mode;

    // Assign states to color
    states.forEach((state => state.assign(this)));
    this.states = states;
  }

  private convert(convertator: (values: ColorArray) => ColorArray, new_mode: Modes = this.mode): Color {
    return this.with(convertator(this.states.map(state => state.value) as ColorArray)
               .map((v, i) => new ColorState(v, i as IntRange<0, 3>)) as [ColorState, ColorState, ColorState],
               new_mode);
  }

  /**
   * ### to(mode: Modes)
   * 
   * ---
   * 
   * Convert color to `mode`
   * 
   * Supported modes:
   * - RGB
   * - HSL
   */
  public to(mode: Modes): Color | null {
    const supported_modes = [Modes.RGB, Modes.HSL];
    const converters: {[key: string]: (x: ColorArray) => ColorArray} = {
      'rgb-hsl': RGBtoHSL,
      'hsl-rgb': HSLToRGB
    }

    // Get from and to indexes
    let from = supported_modes.findIndex(v => v === this.mode);
    if (from === -1) {console.error(`Color.to(): Unsupported from mode: ${this.mode}`); return null;}

    let to = supported_modes.findIndex(v => v === mode);
    if (to === -1) {console.error(`Color.to(): Unsupported to mode: ${mode}`); return null;} 

    if (from === to) return this; // Convert to current mode

    // Gen list of convertations
    let convertations = [];
    if (from < to) convertations = supported_modes.slice(from + 1, to + 1);
    else convertations = supported_modes.slice(from - 1, to - 1);

    let res = this as Color;
    console.debug(`TASK START: Convert ${res.mode} to ${mode}. Current: ${res.toFunction()}`);
    convertations.forEach(conv => {
      console.debug(`TASK start: Convert ${res.mode} to ${conv}`);
      res = res.convert(converters[`${res.mode}-${conv}`], conv);
      console.debug(`TASK end: Converted to ${conv} = ${res.toFunction()}`);
    });
    console.debug(`TASK END: Converted to ${mode} = ${res.toFunction()}`);
    return res;
  }

  /**
   * @deprecated Use to(Modes.RGB) instead
   * 
   * ### toRGB()
   * 
   * ---
   * 
   * Convert color to RGB
   * 
   * Supported modes:
   * - RGB
   * - HSL
   */
  public toRGB(): Color | null {
    // switch (this.mode) {
    //   case Modes.RGB:
    //     return this;
    //   case Modes.HSL:
    //     return this.convert(HSLToRGB, Modes.RGB);
    //   default:
    //     return null; // Unsupported type
    // };
    return this.to(Modes.RGB);
  }

  /**
   * @deprecated Use to(Modes.HSL) instead
   * 
   * ### toHSL()
   * 
   * ---
   * 
   * Convert color to HSL
   * 
   * Supported modes:
   * - RGB
   * - HSL
   */
  public toHSL(): Color | null {
    // switch (this.mode) {
    //   case Modes.RGB:
    //     return this.convert(RGBtoHSL, Modes.HSL)
    //   case Modes.HSL:
    //     return this;
    //   default:
    //     return null; // Unsupported type
    // }
    return this.to(Modes.HSL);
  } 
  
  /**
   * ### toArray()
   * 
   * ---
   * 
   * Convert color to array with all convertations like toRGB() and multiplying to 255
   * 
   * Supported modes:
   * - RGB
   * - HSL
   */
  public toArray(): ColorArray | null {
    return this.toRGB()?.states.map((state) => Math.round(state.value * 255)) as ColorArray;
  }

  private from_0_to_1(x: number): number { return Math.max(0, Math.min(1, x)); }
  private getFunctionFromValues(mode: string | Modes = this.mode, values: any[]): string {
    return `${mode}(${values.join(', ')})`;
  }

  /**
   * ### toFunction()
   * 
   * ---
   * 
   * Convert color to function string (ex. `rgb(255, 255, 255)`) (with `opacity`)
   */
  public toFunction(opacity: number = 1): string {
    opacity = this.from_0_to_1(opacity);
    let numbers;
    switch (this.mode) {
      case Modes.HSL:
        numbers = [Math.round(this.states[0].value * 360), ...this.states.map(state => `${Math.round(state.value * 100)}%`).slice(1)];
        break;
      default:
        numbers = this.states.map(state => state.toInt());
        break;
    }
    
    let mode = this.mode.toString();
    if (opacity < 1) { mode += "a"; numbers.push(opacity); }
    return this.getFunctionFromValues(mode, numbers);
  }

  /**
   * ### toHexRGB(opacity: number = 1)
   * 
   * ---
   * 
   * Convert color to hex RGB (with `opacity`)
   */
  public toHexRGB(opacity: number = 1): string | null {
    if (this.mode != Modes.RGB) return this.toRGB()?.toHexRGB() || null;
    opacity = this.from_0_to_1(opacity);
    let res = `#${this.states.map(state => state.toHexRGB()).join('')}`;
    if (opacity < 1) res += Math.round(opacity * 255).toString(16).padStart(2, "0");
    return res;
  }

  /**
   * ### toString(opacity: number = 1)
   * 
   * ---
   * 
   * Convert color to string (with `opacity`)
   */
  public toString(opacity: number = 1): string | null {
    switch (this.mode) {
      case Modes.RGB:
        return this.toHexRGB(opacity);
      default:
        return this.toFunction(opacity);
    }
  }

  public generate(generator: (old_state: ColorState) => ColorState): Color {
    return new Color(this.mode, this.states.map(generator) as [ColorState, ColorState, ColorState]);
  }
  public with(states: [ColorState, ColorState, ColorState], new_mode: Modes = this.mode): Color {
    return new Color(new_mode, states);
  }

  // Operators

  /**
   * ### add(value: number)
   * 
   * ---
   * 
   * Add `value` to all states's values
   */

  public add(value: number): Color {
    return this.generate(state => state.add(value));
  }
  public sub(value: number): Color {
    return this.generate(state => state.sub(value));
  }
  public mul(value: number): Color {
    return this.generate(state => state.mul(value))
  }
  public div(value: number): Color {
    return this.generate(state => state.div(value))
  }

  // Getters
  get prtext_color(): Color {
    let col = this.mul(1.5)
    return Math.max(...col.states.map(s => s.value)) <= 0.5 ? this.convert(v => v.map(ov => 1 - ov) as ColorArray) : this;
  }
}