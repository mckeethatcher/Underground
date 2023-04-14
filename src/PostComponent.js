import React, { useState } from 'react';

function PostComponent() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  const handleNewPostSubmit = event => {
    event.preventDefault();
    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      content: newPostContent
    };
    setPosts([...posts, newPost]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handlePostEdit = post => {
    setEditingPostId(post.id);
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
  };

  const handlePostUpdate = event => {
    event.preventDefault();
    const updatedPosts = posts.map(post => {
      if (post.id === editingPostId) {
        return {
          ...post,
          title: newPostTitle,
          content: newPostContent
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    setEditingPostId(null);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handlePostDelete = postId => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
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
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button type="button" onClick={() => handlePostEdit(post)}>Edit</button>
            <button type="button" onClick={() => handlePostDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostComponent;
