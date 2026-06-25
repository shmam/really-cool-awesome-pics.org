"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { ImageJson } from "./page";
import Sidebar from "./sidebar";
import LazyImage from "./LazyImage";

type ImageListProps = {
  images: ImageJson[];
};

function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export default function ImageList({ images }: ImageListProps) {
  const [shuffledImages, setShuffledImages] = useState<ImageJson[]>([]);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setShuffledImages(shuffleArray([...images]));
    setCurrent(1); // Reset to 1 on new images
  }, [images]);

  useEffect(() => {
    function onScroll() {
      const nodes = Array.from(document.querySelectorAll('div[data-index]'));
      const firstVisible = nodes.find((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      if (firstVisible) {
        setCurrent(Number(firstVisible.getAttribute('data-index')) + 1);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [shuffledImages]);

  return (
    <>
      <Sidebar total={shuffledImages.length} current={current} />
      <div>
        {shuffledImages.map((image, idx) => (
          <div className={styles.imageContent} key={image.id} data-index={idx}>
            <LazyImage url={image.url} filename={image.filename} />
            <div className={styles.imageMetadata}>
              <p>
                <a href={image.url} target="_blank" rel="noopener noreferrer">
                  {image.filename} →
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}