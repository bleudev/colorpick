import { FunctionComponent, useRef } from "react";
import styles from "./ColorfulSlider.module.css";
import ColorState from "../../utils/classes/ColorState";

type ColorfulSliderProps = {
  change: (x: number) => void;
  state: ColorState;
};

const ColorfulSlider: FunctionComponent<ColorfulSliderProps> = ({ change, state }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const sliderBg = sliderRef.current;
    if (!sliderBg) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = sliderBg.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newValue = Math.min(Math.max(offsetX / rect.width, 0), 1); // Clamp between 0 and 1
      change(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles['slider_container']}>
      <div
        ref={sliderRef}
        className={styles["slider_bg"]}
        style={{
          background: `linear-gradient(to right, rgb(${state.color1.toArray()?.join(",")}), rgb(${state.color2.toArray()?.join(",")})`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className={styles["slider"]}
          style={{ "--slider-position": state.value } as React.CSSProperties}
        />
      </div>
    </div>
    
  );
};

export default ColorfulSlider;