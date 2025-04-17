import { CSSProperties, FunctionComponent } from "react";
import styles from "./TitleBar.module.css";
import { ColorArray, Modes } from "../../utils/annotations";
import Color from "../../utils/classes/Color";

type TitleBarProps = {
  color: Color;
  setColor: (col: Color) => void;
  change_mode: (new_mode: Modes) => void;
}

const TitleBar: FunctionComponent<TitleBarProps> = ({color, setColor, change_mode}) => {
  function change(new_mode: Modes): void {
    change_mode(new_mode);
    setColor(color.to(new_mode) as Color);
  }

  let grad_entries: Color[] = Color.with_values(Modes.HSL, [1, 1, 0.5]).states[0].colorgrad;
  grad_entries.push(...grad_entries); grad_entries.push(...grad_entries);

  return (
    <div className={styles['title-bar']} style={{
      "--h_grad": `linear-gradient(135deg, ${grad_entries.map(v => v.toString()).join(',')})`,
    } as CSSProperties}>
      <span className={styles['logo']}>
        <span className={styles['txt_r']}>Color</span>
        <span className={styles['txt_g']}>Pick</span>
      </span>
      <button className={styles['rgb']} onClick={() => change(Modes.RGB)}>
        <span className={styles['txt_r']}>R</span>
        <span className={styles['txt_g']}>G</span>
        <span className={styles['txt_b']}>B</span>
      </button>
      <button className={styles['hsl']} onClick={() => change(Modes.HSL)}>
        <span className={styles['txt_h']}>H</span>
        <span className={styles['txt_s']}>S</span>
        <span className={styles['txt_l']}>L</span>
      </button>
    </div>
  );
};

export default TitleBar;