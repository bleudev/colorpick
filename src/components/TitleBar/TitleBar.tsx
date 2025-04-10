import { ReactElement } from "react";
import styles from "./TitleBar.module.css";
export default function TitleBar(): ReactElement {
  return (
    <div className={styles['title-bar']}>
        <a href='/'>
          <span className={styles['logo']}>
            <span className={styles['logo1']}>Color</span>
            <span className={styles['logo2']}>Pick</span>
          </span>
        </a>
        <p>RGB</p>
    </div>
  );
}