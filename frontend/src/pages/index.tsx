import { useContext, FormEvent, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from "../../public/logo.svg";
import styles from "../../styles/Home.module.scss";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Link from "next/link";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if(email == '' || password == ''){
      toast.warning("Preencha os dados!");
      return;
    }
    setLoading(true);

    let data = { email, password };
    
    await signIn(data);
  
    setLoading(false);
    
  }

  return (
    <>
      <Head>
        <title>AnthonyPizza - Faça seu Login </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.image} src={logoImg} alt="Logo pizzaria" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input 
            placeholder="Digite seu email" 
            type="text"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <Input 
            placeholder="Sua senha" 
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              Acessar
            </Button>
          </form>
          <Link className={styles.text} href="/signup">
            Não possui uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </>
  );
}

//serverside ( para que logados não acessem a página )

export const getServerSideProps = canSSRGuest(async(ctx)=>{
  return{
    props: {}
  }
})