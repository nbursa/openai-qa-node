import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Layout from "../components/layout";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("qa");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const options = [
    { name: "Q/A", value: "qa" },
    { name: "Code completion", value: "codeCompletion" },
    { name: "AI image generation", value: "imageGeneration" },
  ];

  const showTitle = () => {
    const selectedOption = options.find(
      (option) => option.value === selectValue
    );
    return selectedOption.name;
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: selectValue, value: inputValue }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      if (selectValue === "imageGeneration") {
        setImageUrl(data.imageUrl);
      }
      setResult(data.result);
      setIsLoading(false);
      setInputValue("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setIsLoading(false);
      alert(error.message);
    }
  }

  return (
    <Layout className={styles.page}>
      <Head>
        <title>OpenAI</title>
        <link rel="icon" href="/openai-logo.svg" />
      </Head>

      <main className={styles.main}>
        <img src="/openai.svg" className={styles.icon} />
        <h2>Chat GPT-3</h2>
        <form onSubmit={onSubmit}>
          <select
            type="select"
            name="select"
            value={selectValue}
            onChange={(e) => {
              setSelectValue(e.target.value);
            }}
          >
            {options.map(({ name, value }) => {
              return <option value={value}>{name}</option>;
            })}
          </select>
          <h3>{showTitle()}</h3>
          <input
            type="text"
            name="animal"
            placeholder="Enter an question"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
        <div className={result && !isLoading ? styles.result : styles.hidden}>
          <div>{result}</div>
        </div>
        <div className={imageUrl && !isLoading ? styles.image : styles.hidden}>
          <img src={imageUrl} />
        </div>
        <div className={isLoading ? styles.loader : styles.hidden}>
          <div className={styles.circle}>?</div>
        </div>
      </main>
    </Layout>
  );
}
