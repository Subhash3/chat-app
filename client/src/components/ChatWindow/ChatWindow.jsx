import React, { useEffect } from 'react';
import UsersList from '../UsersList/UsersList'
import LoggedInUserInfo from '../LoggedInUserInfo/LoggedInUserInfo'
import UserChats from '../UserChats/UserChats'
import NewMsgForm from '../NewMsgForm/NewMsgForm'
import OtherUserInfo from '../OtherUserInfo/OtherUserInfo';
import { useSocket } from '../../contexts/SocketProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useSidebarRef } from '../../contexts/SidebarRefProvider'
import { Redirect } from 'react-router-dom'
import './ChatWindow.min.css'

const ChatWindow = () => {
    const [currentUser] = useCurrentUser()
    const socket = useSocket()
    const [activeConversationID] = useActiveConversation()

    // console.log("rendering CHAT_WINDOW")

    useEffect(() => {
        if (socket)
            socket.emit("logged-in", currentUser.id)
    }, [socket, currentUser]);

    return !currentUser ? <Redirect to='/login' /> : (
        <div className="chat-window">
            <div ref={useSidebarRef} className={`window-sidebar`}>
                <LoggedInUserInfo />
                <div className="search-bar"></div>
                <UsersList />
            </div>
            <div className="chat-box">
                {activeConversationID && <OtherUserInfo />}
                <UserChats />
                <NewMsgForm />
            </div>
            <div className="toolbar"></div>
        </div>
    );
}

export default ChatWindow;
