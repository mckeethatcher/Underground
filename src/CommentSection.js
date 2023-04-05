import React, { useState } from 'react';

function CommentSection({ artistName }) {
const [comment, setComment] = useState('');
const [commentsList, setCommentsList] = useState([]);

const handleCommentChange = event => {
setComment(event.target.value);
};

const handleCommentSubmit = event => {
event.preventDefault();
setCommentsList([...commentsList, comment]);
setComment('');
};

return (
<div className="comment-section">
<h3>Comments for {artistName}:</h3>
{commentsList.length > 0 ? (
<ul>
{commentsList.map((comment, index) => (
<li key={index}>{comment}</li>
))}
</ul>
) : (
<p>No comments yet.</p>
)}
<form onSubmit={handleCommentSubmit}>
<label htmlFor="comment">Leave a comment:</label>
<textarea id="comment" value={comment} onChange={handleCommentChange} />
<button type="submit">Submit</button>
</form>
</div>
);
}

export default CommentSection;