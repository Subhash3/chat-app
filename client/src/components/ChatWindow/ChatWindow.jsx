import React, { useEffect } from 'react';
import UsersList from '../UsersList/UsersList'
import LoggedInUserInfo from '../LoggedInUserInfo/LoggedInUserInfo'
import UserChats from '../UserChats/UserChats'
import NewMsgForm from '../NewMsgForm/NewMsgForm'
import { useSocket } from '../../contexts/SocketProvider'
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { Redirect } from 'react-router-dom'
import './ChatWindow.min.css'

const ChatWindow = () => {
    const [currentUser] = useCurrentUser()
    const socket = useSocket()

    useEffect(() => {
        if (socket)
            socket.emit("logged-in", currentUser.id)
    }, [socket]);

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
                <NewMsgForm />
            </div>
            <div className="toolbar"></div>
        </div>
    );
}

export default ChatWindow;
