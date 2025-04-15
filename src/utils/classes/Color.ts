import { ColorArray, IntRange, Modes } from "../annotations";
import { HSLToRGB } from "../convertes";
import ColorState from "./ColorState";

export default class Color {
  constructor(public mode: Modes, public states: [ColorState, ColorState, ColorState]) {
    this.mode = mode;

    // Assign states to color
    states.forEach((state => state.assign(this)));
    this.states = states;
  }

  /**
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
    switch (this.mode) {
      case Modes.RGB:
        return this;
      case Modes.HSL:
        return this.with(HSLToRGB( this.states.map( state => state.value ) as ColorArray )
                   .map((v, i) => new ColorState(v, i as IntRange<0, 3>)) as [ColorState, ColorState, ColorState]);
      default:
        return null; // Unsupported type
    };
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

  /**
   * ### toFunction()
   * 
   * ---
   * 
   * Convert color to function string (ex. `rgb(255, 255, 255)`)
   */
  public toFunction() {
    return `${this.mode}(${this.states.map(state => state.toInt()).join(', ')})`
  }

  /**
   * ### toString()
   * 
   * ---
   * 
   * Convert color to string
   */
  public toString(): string | null {
    switch (this.mode) {
      case Modes.RGB:
        return `#${this.states.map(state => state.toHexRGB()).join('')}`
      default:
        return this.toFunction();
    }
  }

  public generate(generator: (old_state: ColorState) => ColorState): Color {
    return new Color(this.mode, this.states.map(generator) as [ColorState, ColorState, ColorState]);
  }
  public with(states: [ColorState, ColorState, ColorState]): Color {
    return new Color(this.mode, states);
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
}