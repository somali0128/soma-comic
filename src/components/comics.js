import React from 'react';
import ComicList from './comicList';

const LatestComic = () => {
  // Get the latest comic from the list
  const latestComic = ComicList[ComicList.length - 1];

  return (
    <section>
      <h2>My Latest Comic</h2>
      <img src={latestComic.src} alt={latestComic.alt} />
    </section>
  );
}

export default LatestComic;
