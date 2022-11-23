import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";

//criando tipagens obrigatórias
type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

//LOGOUT
export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/");
  } catch {
    toast.error("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();

  const isAuthenticated = !!user; //converter variável pra boolean

  //ciclo de vida para permanecer login
  useEffect(() => {
    const { "@netxauth.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { id, name, email } = response.data;
          setUser({
            id,
            name,
            email,
          });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  //LOGIN
  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", {
        email: email,
        password: password,
      });

      const { id, name, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //Expirar em 1 mês
        path: "/",
      });

      setUser({
        id,
        name,
        email,
      });
      //Passar token pra todas as pages
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success(`Bem vindo!`);
      //Redirecionar o usuário para o dashboard
      Router.push("/dashboard");
    } catch (err) {
      toast.error("Erro ao acessar!");
      console.log("Error ao acessar: ", err);
    }
  }

  //REGISTER
  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const response = await api.post("users", {
        name: name,
        email: email,
        password: password,
      });
      toast.success("Conta criada com sucesso!");
      Router.push("/");
    } catch (err) {
      toast.error("Erro ao criar conta!");
      console.log("Erro ao cadastrar:" + err);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
