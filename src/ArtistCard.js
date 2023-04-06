import React, { useState } from 'react';
import CommentSection from './CommentSection';

function ArtistCard({ artist }) {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  }

  return (
    <div className="artist-card">
      <div className="artist-card-header">
        <img src={artist.image} alt={artist.name} />
        <h3>{artist.name}</h3>
      </div>
      <div className="artist-card-content">
        <p>{artist.description}</p>
        <button onClick={toggleComments}>{showComments ? 'Hide' : 'Show'} Comments</button>
        {showComments && <CommentSection artistId={artist.id} />}
        
      </div>
    </div>
  );
}

export default ArtistCard;
