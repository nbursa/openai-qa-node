import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputValue }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setInputValue("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>OpenAI Q/A</title>
        <link rel="icon" href="/openai-logo.svg" />
      </Head>

      <main className={styles.main}>
        <img src="/openai.svg" className={styles.icon} />
        <h3>Q&A</h3>
        <h4>
          I am a highly intelligent question answering bot. <br />
          If you ask me a question that is rooted in truth, I will give you the
          answer. <br />
          If you ask me a question that is nonsense, trickery, or has no clear
          answer, I will respond with \"Unknown\"
        </h4>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an question"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
        <div className={result ? styles.result : styles.hidden}>
          <h4>Answer:</h4>
          <div>{result}</div>
        </div>
      </main>
    </div>
  );
}
