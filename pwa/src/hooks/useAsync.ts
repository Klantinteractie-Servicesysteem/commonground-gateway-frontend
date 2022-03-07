import { AxiosResponse } from "axios";
import * as React from "react";

interface UseAsyncProps {
  asyncFunction: () => Promise<AxiosResponse<any, any>>;
  onSuccess: (res) => any;
  onError: (err) => any;
  dependencies?: any;
}

export const useAsync = ({ asyncFunction, onSuccess, onError, dependencies }: UseAsyncProps) => {
  React.useEffect(() => {
    let mounted = true;

    asyncFunction()
      .then((res) => {
        mounted && onSuccess(res);
      })
      .catch((err) => {
        mounted && onError(err);
      });

    return () => {
      mounted = false;
    };
  }, [dependencies]);
};
