import { FunctionComponent, ReactElement } from "react";
import styles from "./TitleBar.module.css";

type TitleBarProps = {
  change_mode: (new_mode: string) => void;
}

const TitleBar: FunctionComponent<TitleBarProps> = ({change_mode}) => {
  return (
    <div className={styles['title-bar']}>
      <span className={styles['logo']}>
        <span className={styles['txt_r']}>Color</span>
        <span className={styles['txt_g']}>Pick</span>
      </span>
      <button className={styles['rgb']} onClick={() => change_mode('rgb')}>
        <span className={styles['txt_r']}>R</span>
        <span className={styles['txt_g']}>G</span>
        <span className={styles['txt_b']}>B</span>
      </button>
    </div>
  );
};

export default TitleBar;