import { useEffect, useState } from "react";
import { getParams } from "../functions/getParams";

export const useParams = () => {
  const [params, setParams] = useState(getParams());

  useEffect(() => {
    const handlePopState = () => setParams(getParams());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return params;
}