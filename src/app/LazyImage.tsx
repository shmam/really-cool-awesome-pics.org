"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type LazyImageProps = {
  url: string;
  filename: string;
};

export default function LazyImage({ url, filename }: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.imagePlaceholder} ${visible ? "" : styles.empty}`}
    >
      {visible && (
        <picture>
          <source srcSet={url} type="image/avif" />
          <img
            src={url}
            width={800}
            height={536}
            loading="lazy"
            alt={filename}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
}
