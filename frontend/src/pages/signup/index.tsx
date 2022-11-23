import {useState, FormEvent, useContext} from 'react';
import Head from "next/head";
import Image from "next/image";
import logoImg from "../../../public/logo.svg";
import styles from "../../../styles/Home.module.scss";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Link from "next/link";
import { AuthContext } from '../../contexts/AuthContext';
import {toast} from 'react-toastify';


export default function Signup() {

  const {signUp} = useContext(AuthContext)

  const [name, setName]=useState('');
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [loading, setLoading]=useState(false);


  async function handleSignUp(e: FormEvent){
    e.preventDefault();

    if(name == '' || email == '' || password == ''){
      toast.warn("Preencha todos os campos!");
      return;
    }
    setLoading(true);

    let data = {name, email, password}
    
    await signUp(data);

    setLoading(false);
 

  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.image} src={logoImg} alt="Logo pizzaria" />

        <div className={styles.login}>
            <h1>Crie sua conta</h1>
          <form onSubmit={handleSignUp}>
            <Input placeholder="Digite seu nome" type="text" value={name} onChange={(e)=>setName(e.target.value)} />
            <Input placeholder="Digite seu email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}  />
            <Input placeholder="Sua senha" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  />
            <Button type="submit" loading={loading}>
              Cadastrar
            </Button>
          </form>
          <Link  className={styles.text} href="/">
          Já possui uma conta? Faça o login
          </Link>
        </div>
      </div>
    </>
  );
}
