import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const HOSTNAME = "https://acaoparamita.com.br";

function useLoginUser() {
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await axios(`${HOSTNAME}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        params: credentials,
        headers: { "Content-Type": "application/json" },
      });
      return response;
    },
    onSuccess: (response) =>
      window.localStorage.setItem("acao_paramita", response.data.token),
  });
}

export default useLoginUser;
