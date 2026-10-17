import PageWrapper from "../../components/PageWrapper/PageWrapper";
import styles from "./page.module.scss";
import Image from "next/image";
import { pieceImgData } from "@/data/pieceImgData";

export default function Pieces() {
  return (
    <PageWrapper>
      {/* <h2>Pieces</h2> */}
      <Gallery />
    </PageWrapper>
  );
}

function Gallery() {
  return (
    <div className={styles.gallery}>
      {pieceImgData.map((piece, index) => (
        <GalleryItem key={`${piece.url}-${index}`} src={piece.url} name={piece.title} />
      ))}
    </div>
  );
}

function GalleryItem({ src, name }) {
  return (
    <div className={styles.galleryItem}>
      <Image src={src} alt={name} className={styles.image} fill sizes="33vw" />
    </div>
  );
}
