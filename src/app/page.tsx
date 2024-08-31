import Image from "next/image";
import styles from "./page.module.css";
import { promises as fs } from 'fs';

export type ImageJson = {
  id: string;
  url: string;
  filename: string;
  uploaded: string;
  blurUrl: string;
}

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/public/output.json', 'utf8');
  const data = JSON.parse(file);
  const images: ImageJson[] = data.images ?? [];

  return (
    <main className={styles.main}>
      <h1>really-cool-awesome-pics.org</h1>
      <p>a photo blog by sam crochet, who sometimes shoots some 35mm photos</p>

      {images.map((image, index) => (
        <div className={styles.imageContent} key={image.id}>
          <Image 
            priority={index < 3}
            key={image.id}
            src={image.url}
            alt={image.filename}
            width={800}
            height={536}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            quality={100}
            blurDataURL={image.blurUrl}
            loading={index < 3 ? "eager" : "lazy"}
            placeholder="blur"
          />
          <div className={styles.imageMetadata}>
            <p>{image.filename}</p>
            <p>{(new Date(image.uploaded)).getFullYear()}</p>
          </div>
        </div>
      ))}

      <footer><a href="https://samcrochet.dev">samcrochet.dev</a></footer>
    </main>
  );
}
