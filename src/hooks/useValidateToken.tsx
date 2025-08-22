import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const HOSTNAME = "https://acaoparamita.com.br";

function useValidateToken() {
  const token = window && window.localStorage.getItem("authToken");
  return useMutation({
    mutationFn: async () =>
      await axios(`${HOSTNAME}/wp-json/jwt-auth/v1/token/validate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
  });
}

export default useValidateToken;
