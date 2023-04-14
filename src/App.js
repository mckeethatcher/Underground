import React, { useState, useEffect } from 'react';
import './index.css';
import ArtistInfo from './ArtistInfo';
import CommentSection from './CommentSection';
import RelatedArtists from './RelatedArtists';
import PostComponent from './PostComponent';

const SPOTIFY_CLIENT_ID = 'ced1e023722b4ed18fa02bd600da4547';
const SPOTIFY_CLIENT_SECRET = '6e0a60ff6e9343489b9aa3f792f8b61c';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1/';

const genreOptions = ['pop', 'rock', 'hip hop', 'jazz', 'country', 'blues', 'reggae', 'classical', 'electronic', 'metal', 'folk', 'indie', 'r&b', 'soul', 'punk'];

function App() {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('rap');
  const [maxStreams, setMaxStreams] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [mustListenArtists, setMustListenArtists] = useState([]);
  const [posts, setPosts] = useState([]);

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
        // fetch artists from Spotify API
        fetch(SPOTIFY_API_URL + `search?q=${searchTerm}&type=artist`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            const artists = data.artists.items.map(artist => {
              return {
                name: artist.name,
                image: artist.images.length > 0 ? artist.images[0].url : null,
                streams: artist.followers.total.toLocaleString(),
                id: artist.id,
                spotifyUrl: artist.external_urls.spotify
              };
            });
            setArtists(artists);
          });
      });
  }, [searchTerm]);

  useEffect(() => {
    // filter artists by number of streams
    const filteredArtists = artists.filter(artist => artist.streams <= maxStreams);
    setArtists(filteredArtists);
  }, [maxStreams]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleMaxStreams = event => {
    setMaxStreams(parseInt(event.target.value));
  };

  const handleArtistClick = id => {
    const artist = artists.find(artist => artist.id === id);
    setSelectedArtist(artist);
  };
  
  const handleCloseArtist = () => {
    setSelectedArtist(null);
  };
  
  const handleAddToMustListen = id => {
    const artistToAdd = artists.find(artist => artist.id === id);
    setMustListenArtists(prevArtists => [...prevArtists, artistToAdd]);
  };
  
  const handleRemoveFromMustListen = id => {
    const updatedArtists = mustListenArtists.filter(artist => artist.id !== id);
    setMustListenArtists(updatedArtists);
  };
  return (
    <div>
      <h1>Find your new underground artist</h1>
      <form>
        <label htmlFor="genre">Search by genre:</label>
        <input type="text" id="genre" value={searchTerm} onChange={handleSearch} />
      </form>
      <div>
        <label htmlFor="streams">Filter by number of streams:</label>
        <input type="range" id="streams" min="0" max="10000000" step="2000" value={maxStreams} onChange={handleMaxStreams} />
        <p>{maxStreams.toLocaleString()} streams or less</p>
      </div>
      <div className="suggested-genres">
        {genreOptions.map(option => (
          <button key={option} onClick={() => setSearchTerm(option)}>{option}</button>
        ))}
      </div>
      <div className="card-container">
        {artists.map(artist => (
          <div key={artist.id} className="card" onClick={() => handleArtistClick(artist.id)}>
            {artist.image && <img src={artist.image} alt={artist.name} />}
            <h2>{artist.name}</h2>
            <p>{artist.streams} streams</p>
          
            <RelatedArtists />
            <button onClick={() => handleAddToMustListen(artist.id)}>Add to Must Listen</button>
          </div>
        ))}
      </div>
      <h2>Must Listen</h2> 
      <div className="card-container">
        {mustListenArtists.map(artist => (
          <div key={artist.id} className="card" onClick={() => handleArtistClick(artist.id)}>
            {artist.image && <img src={artist.image} alt={artist.name} />}
            <h2>{artist.name}</h2>
            <p>{artist.streams} streams</p>
            <CommentSection artistId={artist.id} />
            <RelatedArtists />
            <button onClick={() => handleRemoveFromMustListen(artist.id)}>Remove from Must Listen</button>
          </div>
        ))}
      </div>
      {selectedArtist && (
        <>
          <ArtistInfo artist={selectedArtist} onClose={handleCloseArtist} />
        </>
      )}
      <PostComponent posts={posts} setPosts={setPosts} />
    </div>
  );
  

  }
  export default App;
