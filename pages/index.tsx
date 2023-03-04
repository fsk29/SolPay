import type { NextPage } from "next";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import AddressForm from "../components/AddressForm";
import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import * as fs from "fs";

const Home: NextPage = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  const addressSubmittedHandler = (address: string) => {
    async function main() {
      const secret = JSON.parse(
        fs.readFileSync("ephkey.json").toString()
      ) as number[];
      const secretKey = Uint8Array.from(secret);
      const ownerKeypair = Keypair.fromSecretKey(secretKey);
      const recipient = new PublicKey(address);
      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: ownerKeypair.publicKey,
        toPubkey: recipient,
        lamports: LAMPORTS_PER_SOL * 0.1,
      });

      transaction.add(sendSolInstruction);
      const connection = new Connection(clusterApiUrl("devnet"));

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [ownerKeypair]
      );
      try {
        setAddress(address);
        const key = new PublicKey(address);
        const connection = new Connection(clusterApiUrl("devnet"));
        connection.getBalance(key).then((balance) => {
          setBalance(balance / LAMPORTS_PER_SOL);
        });
      } catch (error) {
        setAddress("");
        setBalance(0);
        alert(error);
      }
    }

    main();
  };

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <p>You can send solana to everyone you want and see their balance</p>
        <AddressForm handler={addressSubmittedHandler} />
        <p>{`Address: ${address}`}</p>
        <p>{`Balance: ${balance} SOL`}</p>
      </header>
    </div>
  );
};

export default Home;
