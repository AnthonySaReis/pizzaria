import { signOut } from "../contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        //qualquer erro 401, deslogar user
        if (typeof window !== undefined) {
          //função para deslogar
          signOut();
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
    
      return Promise.reject(error);

    });

    return api;
}
