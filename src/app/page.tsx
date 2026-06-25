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
      <p>a photo blog by sam crochet, who wants to share some 35mm photos</p>
      <details>
        <summary>more</summary>
        <ul>
          <li>image order is shuffed on each page load (for fun)</li>
          <li>photos were taken with either my contax rx (50mm lens) or my konika big mini</li>
          <li>this site is hosted completely (for free) on cloudflare</li>
        </ul>
      </details>
      <p>email your favs at <a href="mailto:samuel.d.crochet@gmail.com">samuel.d.crochet@gmail.com</a></p>
      <ImageList images={images} />
      <footer>
        <a href="https://samcrochet.dev">samcrochet.dev</a>
      </footer>
    </main>
  );
}
