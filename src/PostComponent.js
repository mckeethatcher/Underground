import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostComponent() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://undergroundartists.herokuapp.com/api/all-posts');
        setPosts(response.data.posts || []); // Initialize as empty array if response.data is undefined
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPostSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('https://undergroundartists.herokuapp.com/api/new-post', {
        title: newPostTitle,
        content: newPostContent
      });
      const newPost = {
        title: newPostTitle,
        content: newPostContent
      };
      setPosts([...posts, newPost]);
      setNewPostTitle('');
      setNewPostContent('');
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditPost = (postId) => {
    setEditingPostId(postId)
    console.log(editingPostId)
  }

  const handlePostUpdate = async (postId) => {


    try {
      const response = await axios.put(`https://undergroundartists.herokuapp.com/api/update-post/${postId}`, {
        title: updateTitle,
        content: updateContent
      });

      const data = response.data;
      const updatedPosts = posts.map(post => {
        if (post._id === data._id) {
          return data;
        }
        return post;
      });

      setPosts(updatedPosts);
      setEditingPostId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`https://undergroundartists.herokuapp.com/api/delete-post/${postId}`);

      const updatedPosts = posts.filter(post => post._id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={editingPostId ? handlePostUpdate : handleNewPostSubmit}>
        <input type="text" placeholder="Title" value={newPostTitle} onChange={event => setNewPostTitle(event.target.value)} />
        <textarea placeholder="Content" value={newPostContent} onChange={event => setNewPostContent(event.target.value)} />
        <button type="submit">{editingPostId ? 'Update' : 'Create'}</button>
        {editingPostId && <button type="button" onClick={() => setEditingPostId(null)}>Cancel</button>}
      </form>
      <ul>
      {posts?.map((post, index) => (
          <li key={index}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button type="button" onClick={() => handlePostDelete(post._id)}>Delete</button>
            <form> 
              <input type="text" placeholder="Title" value={updateTitle} onChange={event => setUpdateTitle(event.target.value)} />
              <textarea placeholder="Content" value={updateContent} onChange={event => setUpdateContent(event.target.value)} />
      
              <button type="submit" onClick={() => handlePostUpdate(post._id)}>Update</button>
            
            </form>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostComponent;
