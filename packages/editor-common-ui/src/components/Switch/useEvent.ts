import {useCallback, useRef} from "react";

type AnyFunction = (...args: any[]) => any;

function useEvent<T extends AnyFunction>(callback: T): T {
  const fnRef = useRef<any>();
  fnRef.current = callback;

  return useCallback<T>(
    ((...args: any) => fnRef.current?.(...args)) as any,
    [],
  );
}

export default useEvent;
