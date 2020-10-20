import React from 'react';
import './User.min.css'

const User = ({ user, handleClick, active }) => {
    // console.log(user, active)

    return (
        <div className={`user ${active ? "active" : ""}`} onClick={handleClick} data-user-id={user.id}>
            <div className="image" data-user-id={user.id}></div>
            <div className="name" data-user-id={user.id}>{user.name}</div>
        </div>
    )
}

export default User;
