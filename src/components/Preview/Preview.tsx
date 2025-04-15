import React, { FunctionComponent } from "react";
import styles from "./Preview.module.css";
import Color from "../../utils/classes/Color";
import copy_and_alert from "../../utils/clipboard";

type PreviewProps = {
    color: Color;
}

const Preview: FunctionComponent<PreviewProps> = ({color}) => {
  return (
    <div className={styles['preview']} style={{backgroundColor: `rgb(${color.toArray()?.join(',')})`}}>
      <div className={styles['copy']}
           style={{
            "--text-color": color.mul(1.5).toString(),
            "--border-color": color.div(2).toString(),
            "--copybtn-color": color.div(3).toString(),
           } as React.CSSProperties}>
        <button className={styles['rgb']}
                onClick={() => {copy_and_alert(color.toRGB()?.toString() as string);}}>
          {color.toRGB()?.toString()}
        </button>

        <button className={styles['rgb_func']}
                onClick={() => {copy_and_alert(color.toRGB()?.toFunction() as string);}}>
          {color.toRGB()?.toFunction()}
        </button>
      </div>
    </div>
  );
};

export default Preview;