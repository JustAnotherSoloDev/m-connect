import { useLayoutEffect, useRef, useState } from "react";
import styles from "../Session/Session.module.scss";

export const Join = () => {
  const [count, setCount] = useState([true, true]);
  const [counter, setCounter] = useState(0);
  const add = () => setCount((val) => [...val, true]);
  const remove = () =>
    setCount((val) => {
      val.pop();
      return [...val];
    });
  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (container.current) {
      const { columns, rows } = getGridSize(count.length);
      container.current.style.setProperty("--items", columns.toString());
      container.current.style.setProperty("--rows", rows.toString());
    }
  }, [count]);

  return (
    <div className={styles["container"]} ref={container}>
      {count.map((x, index) => (
        <div key={index} className={styles["participant"]}>
          <video></video>
          <div>
            <button onClick={add}>add</button>
            <button onClick={remove}>remove</button>
            <button onClick={() => setCounter((x) => x + 1)}>
              count={counter}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

function getGridSize(count: number) {
  //since we want to divide the count into a square matrix
  // we need to find n * n = count
  //finding sqrt is an o(1) operation.
  const factor = Math.sqrt(count);
  let rows = Math.floor(factor);
  let columns = Math.ceil(factor);
  const gridFactor = rows * columns;
  //check if the elements can be added to grid if not increase the row by 1
  if (gridFactor < count) {
    //since with sqrt we are relative very close to a square marix add a new row means we definatly have
    // a grid that can contain alll the elements.
    rows += 1;
  }
  return { columns, rows };
}
