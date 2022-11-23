import { useState, FormEvent } from "react";
import styles from "./styles.module.scss";
import Head from "next/head";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import {toast} from 'react-toastify';
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Category() {
  const [name, setName] = useState("");

  async function handleRegister(e: FormEvent){
    e.preventDefault();
    if(name===''){
        return;
    }

    const apiClient = setupAPIClient();

    await apiClient.post('/category', {
        name: name
    })

    toast.success("Categoria cadastrada com sucesso!");
    setName('');
  }

  return (
    <>
      <Head>
        <title>Nova cateogria - Anthony Pizzaria</title>
      </Head>
      <Header />

      <main className={styles.container}>
        <h1>Cadastrar categorias</h1>
        <form className={styles.form} onSubmit={handleRegister}>
          <input
            className={styles.input}
            placeholder="Digite o nome da categoria:"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.button} type="submit">
            Cadastrar categoria
          </button>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) =>{
    return{
      props:{}
    }
  })