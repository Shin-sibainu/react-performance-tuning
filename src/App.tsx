import { useState } from "react";
import React from "react";
import "./App.css";
//https://qiita.com/soarflat/items/b9d3d17b8ab1f5dbfed2#%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%B3%E3%82%B9%E3%83%88%E3%81%8C%E9%AB%98%E3%81%84%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%82%92%E3%83%A1%E3%83%A2%E5%8C%96%E3%81%99%E3%82%8B

//React.memoの時に解説;
function App() {
  console.log("rendered Parent");
  const [count1, setCount1] = useState<number>(0);
  const [count2, setCount2] = useState<number>(0);

  return (
    <>
      <button onClick={() => setCount1(count1 + 1)}>Parent Count</button>
      <button onClick={() => setCount2(count2 + 1)}>Child Count</button>
      <p>App: {count1}</p>
      {/* count2のpropsが変化したときだけ、子をレンダリングする。 */}
      <Child count={count2} />
    </>
  );
}

export default App;

//React.memo化することで、propsが変化したときだけ以下をレンダリングする。
//親がレンダリングしても無意味に子もレンダリングすることがなくなる。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Child = React.memo(({ count }: any) => {
  let i = 0;
  while (i < 1000000) i++; //こんな時は子のレンダリングは避けたい。だからReact.memo化する
  console.log("rendered Child");
  return <p>Child: {count}</p>;
});






//useCallbackの時に解説
//React.memoと併用すると、コンポーネントの不要な再レンダリングをスキップできる。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const Child = React.memo(({ handleClick }: any) => {
//   console.log("render Child");
//   return <button onClick={handleClick}>Child</button>;
// });

// export default function App() {
//   console.log("render App");
//   const [count, setCount] = useState(0);
//   // 関数をメモ化すれば、新しい handleClick と前回の handleClick は
//   // 等価になる。そのため、Child コンポーネントは再レンダリングされない。
//   const handleClick = () => {
//     console.log("click");
//   };

//   return (
//     <>
//       <p>Counter: {count}</p>
//       <button onClick={() => setCount(count + 1)}>
//         Parent Increment count
//       </button>
//       <Child handleClick={handleClick} />
//     </>
//   );
// }
