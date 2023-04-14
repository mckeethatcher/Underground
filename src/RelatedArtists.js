import React, { useState, useEffect } from 'react';
import TopSongs from './TopSongs';

const SPOTIFY_CLIENT_ID = 'ced1e023722b4ed18fa02bd600da4547';
const SPOTIFY_CLIENT_SECRET = '6e0a60ff6e9343489b9aa3f792f8b61c';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

function RelatedArtists({ artistId }) {
  // set state variables
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [maxStreams, setMaxStreams] = useState(0);

  useEffect(() => {
    // authenticate with Spotify API
    fetch(SPOTIFY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)}`
      },
      body: 'grant_type=client_credentials'
    })
      .then(response => response.json())
      .then(data => {
        // fetch related artists from Spotify API
        fetch(SPOTIFY_API_URL + `artists/${artistId}/related-artists`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            const artists = data.artists.map(artist => {
              return {
                id: artist.id,
                name: artist.name,
                image: artist.images.length > 0 ? artist.images[0].url : null,
                streams: artist.followers.total,
                spotifyUrl: artist.external_urls.spotify
              };
            });
            setRelatedArtists(artists);
            const maxStreams = Math.max(...artists.map(artist => artist.streams));
            setMaxStreams(maxStreams);
          });
      });
  }, [artistId]);

  // handle click on related artist
  const handleClick = (artistId) => {
    console.log(`Showing related artists for artistId: ${artistId}`);
    // TODO: Fetch and display related artists and top three songs for the clicked artist
  };

  return (
    <>
      {relatedArtists.length > 0 && (
        <>
          <p>Related artists:</p>
          <div className="card-container" style={{ height: '200px', overflowX: 'scroll' }}>
            {relatedArtists.map(artist => (
              <div key={artist.name} className="card" onClick={() => handleClick(artist.id)}>
                {artist.image && <img src={artist.image} alt={artist.name} />}
                <h2>{artist.name}</h2>
                <p>{artist.streams.toLocaleString()} streams</p>
                <p><a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">Listen on Spotify</a></p>
              </div>
            ))}
          </div>
          <p>Max streams among related artists: {maxStreams.toLocaleString()}</p>
        </>
      )}
    </>
  );
}

export default RelatedArtists;
