import React from 'react';
import './User.min.css'

const User = ({ user, handleClick, active, online }) => {
    // console.log(user, active)

    let className = `user ${active ? "active" : ""} ${online ? "online" : ""}`

    return (
        <div className={className} onClick={handleClick} data-user-id={user.id}>
            <div className="image" data-user-id={user.id}></div>
            <div className="name" data-user-id={user.id}>{user.name}</div>
        </div>
    )
}

export default User;
