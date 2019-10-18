import React from 'react';


function FacebookPost({ author, date }) {
  return (
    <div className="post-header">
      <img src={author.avatar} className="avatar" />
      <div className="details">
        <span>{author.name}</span>
        <span>{date}</span>
      </div>
    </div>
  )
}

function FacebookComment({ comments }) {
  return (
    <div className="post-comments">
      <div className="divider" />
      {comments.map(comments => (
        <div key={comments.id}
          className="comment">
          <img src={comments.author.avatar} className="avatar" />
          <p>
            <span>{comments.author.name}</span>
            {comments.content}
          </p>
        </div>
      ))}
    </div>
  )
}
export default function FacebookItem({ author, date, content, comments }) {
  return (
    <div className="post">
      <FacebookPost author={author} date={date} />
      <p className="post-content">{content}</p>
      <FacebookComment comments={comments} />
    </div>
  )


}
