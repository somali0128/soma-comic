import React from 'react';
import ComicList from './comicList';

const formatTitle = (filename) => {
  const withoutExtension = filename.split('.')[0];
  const withSpaces = withoutExtension.replace(/_/g, ' ');
  return withSpaces;
};

const LatestComic = () => {
  // Get the latest comic from the list
  const latestComic = ComicList[ComicList.length - 1];

    // Get the formatted title from the file name
    const title = formatTitle(latestComic.alt);

  return (
    <section>
      <h2>{title}</h2>
      <img src={latestComic.src} alt={latestComic.alt} />
    </section>
  );
}

export default LatestComic;
