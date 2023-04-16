import React, { useState } from 'react';

function PostComponent() {
  const [posts, setPosts] = useState([
  { id: 1, title: 'Taylor Swift', content: 'Taylor Alison Swift is an American singer-songwriter. She is known for her narrative songwriting, which often centers around her personal life.' },
  { id: 2, title: 'Beyonce', content: 'Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and actress. She is known for her powerful vocals and high-energy performances.' },
  { id: 3, title: 'Ed Sheeran', content: 'Edward Christopher Sheeran is an English singer-songwriter. He is known for his soulful voice and heartfelt lyrics.' },
  ]);
  
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  const handleNewPostSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      id: posts.length + 1,
      title: newPostTitle,
      content: newPostContent,
    };
    setPosts([...posts, newPost]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleEditPost = (postId) => {
    setEditingPostId(postId);
    setUpdateTitle(posts.find(post => post.id === postId).title);
    setUpdateContent(posts.find(post => post.id === postId).content);
  };

  const handlePostUpdate = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, title: updateTitle, content: updateContent };
      }
      return post;
    });
    setPosts(updatedPosts);
    setEditingPostId(null);
  };

  const handlePostDelete = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts);
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={editingPostId ? () => handlePostUpdate(editingPostId) : handleNewPostSubmit}>
        <input type="text" placeholder="Title" value={editingPostId ? updateTitle : newPostTitle} onChange={(event) => editingPostId ? setUpdateTitle(event.target.value) : setNewPostTitle(event.target.value)} />
        <textarea placeholder="Content" value={editingPostId ? updateContent : newPostContent} onChange={(event) => editingPostId ? setUpdateContent(event.target.value) : setNewPostContent(event.target.value)} />
        <button type="submit">{editingPostId ? 'Update' : 'Create'}</button>
        {editingPostId && <button type="button" onClick={() => setEditingPostId(null)}>Cancel</button>}
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button type="button" onClick={() => handlePostDelete(post.id)}>Delete</button>
            {editingPostId === post.id ? (
              <form>
                <input type="text" placeholder="Title" value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} />
                <textarea placeholder="Content" value={updateContent} onChange={(event) => setUpdateContent(event.target.value)} />
                <button type="button" onClick={() => handlePostUpdate(post.id)}>Update</button>
                <button type="button" onClick={() => setEditingPostId(null)}>Cancel</button>
              </form>
            ) : (
              <button type="button" onClick={() => handleEditPost(post.id)}>Update</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default PostComponent;
