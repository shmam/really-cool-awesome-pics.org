"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { ImageJson } from "./page";

type ImageListProps = {
  images: ImageJson[];
};

function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export default function ImageList({ images }: ImageListProps) {
  const [shuffledImages, setShuffledImages] = useState<ImageJson[]>([]);

  useEffect(() => {
    setShuffledImages(shuffleArray([...images]));
  }, [images]);

  return (
    <>
      {shuffledImages.map((image) => (
        <div className={styles.imageContent} key={image.id}>
          <picture>
            <source srcSet={image.url} type="image/avif" />
            <img
              src={image.url}
              width={800}
              height={536}
              loading="lazy"
              alt={image.filename}
              decoding="async"
            />
          </picture>
          <div className={styles.imageMetadata}>
            <p>
              <a href={image.url} target="_blank" rel="noopener noreferrer">
                {image.filename} →
              </a>
            </p>
          </div>
        </div>
      ))}
    </>
  );
}