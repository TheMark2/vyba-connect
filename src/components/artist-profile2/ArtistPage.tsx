import React from 'react';
import { useParams } from 'react-router-dom';

const ArtistPage = () => {
  const { id } = useParams();

  return (
    <div>ArtistPage</div>
  );
};

export default ArtistPage;
