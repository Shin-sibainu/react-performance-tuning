import { useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import "./App.css";
import { useToggle } from "./hooks/useToggle";
import useSWR from "swr";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//https://qiita.com/soarflat/items/b9d3d17b8ab1f5dbfed2#%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0%E3%82%B3%E3%82%B9%E3%83%88%E3%81%8C%E9%AB%98%E3%81%84%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%82%92%E3%83%A1%E3%83%A2%E5%8C%96%E3%81%99%E3%82%8B
//https://ja.react.dev/reference/react/memo

//1.React.memo
// function App() {
//   console.log("rendered Parent");
//   const [count1, setCount1] = useState<number>(0);
//   const [count2, setCount2] = useState<number>(0);

//   return (
//     <>
//       <button onClick={() => setCount1(count1 + 1)}>Parent Count</button>
//       <button onClick={() => setCount2(count2 + 1)}>Child Count</button>
//       <p>App: {count1}</p>
//       {/* count2のpropsが変化したときだけ、子をレンダリングする。 */}
//       <Child count={count2} />
//     </>
//   );
// }

// export default App;

// //React.memo化することで、propsが変化したときだけ以下をレンダリングする。
// //親がレンダリングしても無意味に子もレンダリングすることがなくなる。
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const Child = React.memo(({ count }: any) => {
//   let i = 0;
//   while(i < 1000000) i++; //こんな時は子のレンダリングは避けたい。だからReact.memo化する
//   console.log("rendered Child");
//   return <p>Child: {count}</p>;
// });

//2.useCallback
// React.memoと併用すると、コンポーネントの不要な再レンダリングをスキップできる。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const Child = React.memo(({ handleClick }: any) => {
//   console.log("rendered Child");
//   return <button onClick={handleClick}>Child</button>;
// });

// export default function App() {
//   console.log("rendered Parent");
//   const [count, setCount] = useState(0);
//   // 関数はコンポーネントが再レンダリングされる度に再生成されるため、
//   // 関数の内容が同じでも、新しい handleClick と前回の handleClick は
//   // 異なるオブジェクトなので、等価ではない。
//   // そのため、コンポーネントが再レンダリングされる。
//   // const handleClick = () => {
//   //   console.log("click");
//   // };

//   // 関数をメモ化すれば、新しい handleClick と前回の handleClick は
//   // 等価になる。そのため、Child コンポーネントは再レンダリングされない。
//   const handleClick = useCallback(() => {
//     console.log("click");
//   }, []);

//   //Hooksの方でuseCallbackを利用しているので
//   //toggle関数は毎回生成されることはない
//   //よって値が変化するときだけ関数が新しく生成⇨レンダリングされる。
//   const [on, toggle] = useToggle(false);
//   console.log(on);

//   return (
//     <>
//       <p>Counter: {count}</p>
//       <button onClick={() => setCount(count + 1)}>
//         Parent Increment count
//       </button>
//       <Child handleClick={handleClick} onClick={toggle} />
//     </>
//   );
// }

//3.useMemo
// export default function App() {
//   const [count1, setCount1] = useState(0);
//   const [count2, setCount2] = useState(0);

//   // 引数の数値を２倍にして返す。
//   // 不要なループを実行しているため計算にかなりの時間がかかる。
//   const double = (count: number) => {
//     let i = 0;
//     while (i < 10000000) i++;
//     return count * 2;
//   };

//   // count2 を２倍にした値
//   // double(count2) はコンポーネントが再レンダリングされる度に実行されるため、
//   // count1 を更新してコンポーネントが再レンダリングされた時にも実行されてしまう。
//   // そのため、count1 を更新してコンポーネントを再レンダリングする時も時間がかかる。
//   // count1 を更新しても doubledCount の値は変わらないため、count1 を更新した時に
//   // double(count2) を実行する意味がない。したがって、不要な再計算が発生している状態である。
//   // count1 が更新されてコンポーネントが再レンダリングされた時は double(count2) が実行されないようにしたい。
//   // const doubledCount = double(count2);

//   //こうすると、依存関係で指定したものが変化したときだけ再計算される
//   const doubledCount = useMemo(() => double(count2), [count2]);

//   return (
//     <>
//       <h2>Increment count1</h2>
//       <p>Counter: {count1}</p>
//       <button onClick={() => setCount1(count1 + 1)}>Increment count1</button>

//       <h2>Increment count2</h2>
//       <p>
//         Counter: {count2}, {doubledCount}
//       </p>
//       <button onClick={() => setCount2(count2 + 1)}>Increment count2</button>
//     </>
//   );
// }

//4.useSWR
// type User = {
//   id: string;
//   name: string;
//   email: string;
// };

// async function fetcher(key: string) {
//   return await fetch(key).then((res) => res.json());
// }

// function App() {
//   // const [userData, setUserData] = useState<User | null>(null);
//   // const [loading, setLoading] = useState(false);

//   const { data, isLoading, error } = useSWR(
//     "https://jsonplaceholder.typicode.com/users/1",
//     fetcher
//   );

//   // CSR...useEffect for fetching
//   // useEffect(() => {
//   //   const getUserData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
//   //       const data = await res.json();
//   //       setUserData(data);
//   //       console.log(data);
//   //     } catch (err) {
//   //       console.error(err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   getUserData();
//   // }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!data) {
//     return <div>No user data found.</div>;
//   }

//   return (
//     <div>
//       <p>User Name: {data?.name}</p>
//     </div>
//   );
// }

// export default App;

//5.React Query(Tanstack Query)
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { data, error, isPending, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/tannerlinsley/react-query").then(
        (res) => res.json()
      ),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? "Updating..." : ""}</div>
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}

export default App;
