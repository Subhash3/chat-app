import React from 'react';
import './User.min.css'

const User = ({ user, handleClick, active, online, newMsgCount }) => {
    // console.log(user, active)

    let className = `user ${active ? "active" : ""} ${online ? "online" : ""}`
    let username = user.name ? user.name : user.id
    return (
        <div className={className} onClick={handleClick} data-user-id={user.id}>
            <div className="image" data-user-id={user.id}></div>
            <div className="name" data-user-id={user.id}>{username}</div>
            {(newMsgCount && newMsgCount !== 0) && <div className="new-msg-count" data-user-id={user.id}>{newMsgCount}</div>}
        </div>
    )
}

export default User;
