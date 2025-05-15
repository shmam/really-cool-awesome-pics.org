import styles from "./page.module.css";
import { promises as fs } from "fs";
import ImageList from "./ImageList";

export type ImageJson = {
  id: string;
  url: string;
  filename: string;
  uploaded: string;
};

export default async function Home() {
  const file = await fs.readFile(process.cwd() + "/public/output.json", "utf8");
  const images: ImageJson[] = JSON.parse(file);

  return (
    <main className={styles.main}>
      <h1>really-cool-awesome-pics.org</h1>
      <p>a photo blog by sam crochet, wants to share some 35mm photos</p>
      <details>
        <summary>more</summary>
        <ul>
          <li>image order is shuffed on each page load, isn&apos;t that fun?!</li>
          <li>all photos (mostly) were taken with my konica big mini a4, and I hope it lives forever</li>
          <li>this site is hosted completely for free on cloudflare</li>
        </ul>
      </details>


      <ImageList images={images} />

      <footer>
        <a href="https://samcrochet.dev">samcrochet.dev</a>
      </footer>
    </main>
  );
}
