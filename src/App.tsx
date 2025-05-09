import { useState } from 'react';
import styles from './App.module.css';
import TitleBar from './components/TitleBar/TitleBar';
import ColorfulSlider from './components/ColorfulSlider/ColorfulSlider';
import { IntRange, Modes } from './utils/annotations';
import Color from './utils/classes/Color';
import ColorState from './utils/classes/ColorState';
import Preview from './components/Preview/Preview';

export default function App() {
  const [mode, setMode] = useState(Modes.RGB);
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const [third, setThird] = useState(0);
  var color = new Color(mode, Array(3).fill(0).map((_, i) => new ColorState([first, second, third][i], i as IntRange<0, 3>)) as [ColorState, ColorState, ColorState]);

  return (
    <>
      <TitleBar color={color} setColor={col => {
          setMode(col.mode);
          setFirst(col.states[0].value);
          setSecond(col.states[1].value);
          setThird(col.states[2].value);
        }} change_mode={(new_mode: Modes) => setMode((_: Modes) => new_mode)}/>
      <div className={styles['main']}>
        <Preview color={color}/>
        <div className={styles['container']}>
          <ColorfulSlider change={setFirst} state={color.states[0]}/>
          <ColorfulSlider change={setSecond} state={color.states[1]}/>
          <ColorfulSlider change={setThird} state={color.states[2]}/>
        </div>
      </div>
    </>
  );
};
