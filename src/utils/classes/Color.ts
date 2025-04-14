import { ColorArray, Modes } from "../annotations";
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
        return new Color(Modes.RGB,
          HSLToRGB( this.states.map( state => state.value ) )
            .map((v, i) => new ColorState(v, i))
        );
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
}