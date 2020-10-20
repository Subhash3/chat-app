import React from 'react';
import UsersList from '../UsersList/UsersList'
import LoggedInUserInfo from '../LoggedInUserInfo/LoggedInUserInfo'
import UserChats from '../UserChats/UserChats'
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { Redirect } from 'react-router-dom'
import './ChatWindow.min.css'

const ChatWindow = () => {
    const [currentUser] = useCurrentUser()

    return !currentUser ? <Redirect to='/login' /> : (
        <div className="chat-window">
            <div className="window-sidebar">
                <LoggedInUserInfo />
                <div className="search-bar"></div>
                <UsersList />
            </div>
            <div className="chat-box">
                <div className="other-user-info"></div>
                <UserChats />
                <div className="new-msg-form">
                    <input type="text" className="new-msg" />
                    <button className="send-msg"></button>
                </div>
            </div>
            <div className="toolbar"></div>
        </div>
    );
}

export default ChatWindow;
