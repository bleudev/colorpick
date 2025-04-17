import React, { FunctionComponent } from "react";
import styles from "./Preview.module.css";
import Color from "../../utils/classes/Color";
import copy_and_alert from "../../utils/clipboard";
import { Modes } from "../../utils/annotations";

type PreviewProps = {
    color: Color;
}

const Preview: FunctionComponent<PreviewProps> = ({color}) => {
  return (
    <div className={styles['preview']} style={{backgroundColor: `rgb(${color.toArray()?.join(',')})`}}>
      <div className={styles['copy']}
           style={{
            "--text-color": color.prtext_color.toString(),
            "--border-color": color.to(Modes.RGB)?.div(2).toString(),
            "--copybtn-color": color.to(Modes.RGB)?.div(2.5).toFunction(0.3),
           } as React.CSSProperties}>
        <button className={styles['rgb']}
                onClick={() => {copy_and_alert(color.toRGB()?.toString() as string);}}>
          {color.toHexRGB()}
        </button>

        <button className={styles['rgb_func']}
                onClick={() => {copy_and_alert(color.toRGB()?.toFunction() as string);}}>
          {color.toRGB()?.toFunction()}
        </button>

        <button onClick={() => {copy_and_alert(color.toHSL()?.toString() as string);}}>
          {color.toHSL()?.toString()}
        </button>
      </div>
    </div>
  );
};

export default Preview;