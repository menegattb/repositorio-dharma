import useValidateToken from "@/hooks/useValidateToken";
import Login from "@/pages/login";
import { ReactNode, useEffect } from "react";

const Protected = (props: { children: ReactNode }) => {
  const {
    isPending,
    isSuccess,
    mutate: validateToken,
    isError,
  } = useValidateToken();

  useEffect(() => {
    validateToken();
  }, []);

  if (isPending || isSuccess) {
    return props.children;
  }
  if (isError) {
    return <Login />;
  }
  return <></>;
};

export default Protected;
