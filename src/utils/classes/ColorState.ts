import { IntRange, Modes } from "../annotations";
import Color from "./Color";

export default class ColorState {
  public parent: Color | null;
  constructor(
    public value: number,
    public state_index: IntRange<0, 3>
  ) {
    this.value = value;
    this.state_index = state_index;
    this.parent = null;
  }

  public assign(parent: Color): void {
    this.parent = parent;
  }

  private gencol(gen: (value: number, index: number) => number): Color {
    return new Color(
      this.parent.mode,
      this.parent?.states.map(
        (state) => new ColorState(gen(state.value, state.state_index), state.state_index)
      )
    );
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
}