import { useState, useCallback } from "react";

export const useToggle = (initialSatate: boolean) => {
  const [state, setState] = useState(initialSatate);

  //   const toggle = () => {
  //     setState((state) => !state);
  //   };

  const toggle = useCallback(() => {
    setState((state) => !state);
  }, []);

  return [state, toggle];
};
