import { IntRange, Modes } from "../annotations";
import Color from "./Color";

export default class ColorState {
  public parent: Color | null;
  constructor(
    private __value: number,
    public state_index: IntRange<0, 3>
  ) {
    this.__value = Math.min(1, Math.max(__value, 0)); // from 0 to 1
    this.state_index = state_index;
    this.parent = null;
  }

  public assign(parent: Color): void {
    this.parent = parent;
  }

  get value(): number {
    return this.__value;
  }

  set value(new_value: number) {
    this.__value = Math.min(1, Math.max(new_value, 0)); // from 0 to 1
  }

  // Converters

  /**
   * ### toInt(max: number = 255)
   * 
   * ---
   * 
   * Convert color state to rounded integer (eq. `Math.round(ColorState.value * max)`)
   */
  public toInt(max: number = 255): number { return Math.round(this.value * max); }

  /**
   * ### toHexRGB()
   * 
   * ---
   * 
   * Convert color state to rgb and then to hex string
   */
  public toHexRGB(): string | null {
    return this.parent?.toRGB()?.states[this.state_index].toInt().toString(16).padStart(2, "0") || null;
  }

  // Generators
  private gencol(gen: (value: number, index: number) => number): Color {
    return this.parent?.generate((state) => new ColorState(gen(state.value, state.state_index), state.state_index)) as Color;
  }

  get color1(): Color {
    return this.gencol((value, index) => index === this.state_index ? 0 : value);
  }
  get color2(): Color {
    return this.gencol((value, index) => index === this.state_index ? 1 : value);
  }
  get textcolor(): Color {
    return this.gencol((value, index) => index === this.state_index ? value : 0);
  }

  // Operators
  private get_new_state(callback: (old_value: number) => number): ColorState {
    return new ColorState(callback(this.value), this.state_index);
  }

  public add(value: number): ColorState {
    return this.get_new_state(old => old + value);
  }
  public sub(value: number): ColorState {
    return this.add(-value);
  }
  public mul(value: number): ColorState {
    return this.get_new_state(old => old * value);
  }
  public div(value: number): ColorState {
    return this.mul(1 / value);
  }
}