import React from 'react';
import User from '../User/User'
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import './LoggedInUserInfo.min.css'

const LoggedInUserInfo = () => {
    const [currentUser] = useCurrentUser()
    return (
        <div className="loggedin-user-info">
            <User user={currentUser} />
        </div>
    );
}

export default LoggedInUserInfo;
