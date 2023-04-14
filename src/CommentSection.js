import React, { useState, useEffect } from 'react';

function CommentSection({ artistId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/comments?artistId=${artistId}`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error('Error fetching comments', error));
  }, [artistId]);

  const handleSubmitComment = (event) => {
    event.preventDefault();
    fetch('http://localhost:3001/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artistId,
        comment,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Comment submitted');
          setComment('');
          fetch(`http://localhost:3001/comments?artistId=${artistId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('Comments:', data);
              setComments(data);
            })
            .catch((error) => console.error('Error fetching comments', error));
        } else {
          console.error('Error submitting comment');
        }
      })
      .catch((error) => {
        console.error('Error submitting comment', error);
      });
  };
  

  const handleEditComment = (commentId, newComment) => {
    fetch(`http://localhost:3001/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: newComment,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Comment updated');
          setEditingCommentId(null);
          fetch(`http://localhost:3001/comments?artistId=${artistId}`)
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => console.error('Error fetching comments', error));
        } else {
          console.error('Error updating comment');
        }
      })
      .catch((error) => {
        console.error('Error updating comment', error);
      });
  };

  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:3001/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Comment deleted');
          fetch(`http://localhost:3001/comments?artistId=${artistId}`)
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => console.error('Error fetching comments', error));
        } else {
          console.error('Error deleting comment');
        }
      })
      .catch((error) => {
        console.error('Error deleting comment', error);
      });
  };

  const handleClick = (event) => {
    // Stop the event propagation to prevent the click on the comment section from triggering the click on the card
    event.stopPropagation();
  };
  return (
    <div onClick={handleClick}>
      <form onSubmit={handleSubmitComment}>
        <label htmlFor="comment">Add a comment:</label>
        <input
          type="text"
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit">Submit</button>
        <p></p>
      </form>
      <div className="comments-section">
        {comments.map((comment) => (
          <div key={comment.id}>
            <p className="comment-text">{comment.comment}</p>
            <div className="comment-options">
              <button className="edit-button" onClick={() => setEditingCommentId(comment.id)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            </div>
            {editingCommentId === comment.id && (
              <form onSubmit={(event) => {
                event.preventDefault();
                handleEditComment(comment.id, comment.comment);
              }}>
                <input
                  type="text"
                  value={comment.comment}
                  onChange={(event) => {
                    const newComment = event.target.value;
                    setComments((prevComments) => {
                      const updatedComments = [...prevComments];
                      const commentIndex = updatedComments.findIndex((c) => c.id === comment.id);
                      updatedComments[commentIndex] = { ...comment, comment: newComment };
                      return updatedComments;
                    });
                  }}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingCommentId(null)}>Cancel</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;




