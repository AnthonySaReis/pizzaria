import {useContext} from 'react';
import styles from "./styles.module.scss";
import logo from "../../../public/logo.svg";
import Link from "next/link";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import { AuthContext } from "../../contexts/AuthContext";

export function Header() {
 
    const {signOut, user} = useContext(AuthContext);
 
    return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <Image src={logo} width={200} height={120} alt="Logo pizzaria" />
        </Link>
        <nav className={styles.menuNav}>
          <Link legacyBehavior href="/category">
            <a>Categorias</a>
          </Link>
          <Link legacyBehavior href="/product">
            <a>Produtos</a>
          </Link>
          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24}/>
          </button>
        </nav>
      </div>
    </header>
  );
}
