import React, { useState, useEffect } from 'react';
import TopSongs from './TopSongs';

const SPOTIFY_CLIENT_ID = 'ced1e023722b4ed18fa02bd600da4547';
const SPOTIFY_CLIENT_SECRET = '6e0a60ff6e9343489b9aa3f792f8b61c';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

function ArtistInfo({ artist, onClose }) {
  const [maxStreams, setMaxStreams] = useState(0);
  const [genres, setGenres] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const MIN_FOLLOWERS_THRESHOLD = 500;

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
        // fetch artist genres from Spotify API
        fetch(SPOTIFY_API_URL + `artists/${artist.id}`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            setGenres(data.genres);
          });

        // fetch related artists from Spotify API
        fetch(SPOTIFY_API_URL + `artists/${artist.id}/related-artists`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            const artists = data.artists.map(artist => {
              return {
                name: artist.name,
                image: artist.images.length > 0 ? artist.images[0].url : null,
                streams: artist.followers.total,
                spotifyUrl: artist.external_urls.spotify,
                id: artist.id
              };
            });
            setRelatedArtists(artists);
            const maxStreams = Math.max(...artists.map(artist => artist.streams));
            setMaxStreams(maxStreams);
          });
      });
  }, [artist.id]);

  // function to handle clicking on related artist card
  const handleArtistClick = (artistId, artistName) => {
    fetch(SPOTIFY_API_URL + `artists/${artistId}/top-tracks?market=US`, {
      headers: {
        'Authorization': `Bearer ${SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const topTracks = data.tracks.slice(0, 3).map(track => {
          return {
            name: track.name,
            popularity: track.popularity
          }
        });
        setSelectedArtist({ id: artistId, name: artistName, topTracks });
      });
  }

  
  return (
    <div className="artist-info">
      <div className="artist-info-header">
        <h2>{artist.name}</h2>
        <div className="top-songs-section">
          <TopSongs artistId={artist.id} />
        </div>
        <button onClick={onClose}>Close</button>
      </div>
      {artist.image && <img src={artist.image} alt={artist.name} />}
      <p>{artist.streams} streams</p>
      <p><a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer">Listen on Spotify</a></p>
      {artist.streams < MIN_FOLLOWERS_THRESHOLD && (
        <p>This artist doesn't have enough of a following to accurately know who they are similar to.</p>
      )}
      <hr />
      <div>
        <p>Genres: {genres.join(', ')}</p>
        {relatedArtists.length > 0 && (
          <>
            <p>Related artists:</p>
            <div className="card-container">
              {relatedArtists.map(artist => (
                <div key={artist.id} className="card" onClick={() => handleArtistClick(artist.id, artist.name)}>
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
      </div>
      {selectedArtist && (
        <div className="popup">
          <div className="popup-content">
            <h3>{selectedArtist.name}</h3>
            <ul>
              {selectedArtist.topTracks.map((track, index) => (
                <li key={index}>
                  {track.name} ({track.popularity})
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedArtist(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
  
  

  
      
  }
  
  export default ArtistInfo;
  