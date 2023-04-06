import React, { useState, useEffect } from 'react';
import RelatedArtists from './RelatedArtists';

const SPOTIFY_CLIENT_ID = 'ced1e023722b4ed18fa02bd600da4547';
const SPOTIFY_CLIENT_SECRET = '6e0a60ff6e9343489b9aa3f792f8b61c';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

function TopSongs({ artistId }) {
  const [songs, setSongs] = useState([]);

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
        // fetch artist's top tracks from Spotify API
        fetch(SPOTIFY_API_URL + `artists/${artistId}/top-tracks?country=US`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            const songs = data.tracks.slice(0, 3).map(song => {
              return {
                name: song.name,
                previewUrl: song.preview_url,
                spotifyUrl: song.external_urls.spotify
              };
            });
            setSongs(songs);
          });
      });
  }, [artistId]);

  return (
    <div className="top-songs">
      <h3 className="top-songs__title">Top 3 Songs:</h3>
      <ul className="top-songs__list">
        {songs.map(song => (
          <li key={song.name} className="top-songs__item">
            {song.previewUrl ? (
              <a href={song.previewUrl} target="_blank" rel="noopener noreferrer" className="top-songs__link">{song.name}</a>
            ) : (
              <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer" className="top-songs__link">{song.name}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopSongs;
