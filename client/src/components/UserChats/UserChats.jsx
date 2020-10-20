import React, { useState, useEffect } from 'react';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import './UserChats.min.css'

const UserChats = () => {
    const [chatDB, setChatDB] = useChatDB()
    const [userChats, setUserChats] = useState([])
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()
    const socket = useSocket()

    // console.log({ userChats })
    useEffect(() => {
        const extractConversations = () => {
            let conversations = chatDB.filter(msgObject => {
                return (msgObject.senderID === currentUser.id && msgObject.receiverID === activeConversationID)
                    || (msgObject.receiverID === currentUser.id && msgObject.senderID === activeConversationID)
            })

            // console.log(currentUser, activeConversationID)
            // console.log({ conversations })
            setUserChats(conversations)
        }

        extractConversations()
    }, [activeConversationID, chatDB, currentUser.id])

    useEffect(() => {

        // Setup SocketIO events
        if (socket) {
            socket.on('message-sent', () => {
                console.log("Message Has been sent")
            })

            socket.on('message-not-sent', reason => {
                console.log("Message has been not sent. : " + reason)
            })

            socket.on('received-message', msbObjectString => {
                let msgObject = JSON.parse(msbObjectString)
                // console.log("Received message:", msgObject)

                msgObject.id = chatDB.length + 1
                setChatDB([...chatDB, msgObject])
            })
        }

    }, [socket])

    return (
        <div className="chats">
            {activeConversationID ? (userChats.map(chatObject => {
                return <Message key={chatObject.id} msgObject={chatObject} />
            }))
                : <SelectAChat />}
        </div>
    );
}

const Message = ({ msgObject }) => {
    const [currentUser] = useCurrentUser()
    let isSender = (msgObject.senderID === currentUser.id)

    return (
        <div className={`msg ${isSender ? "sender" : ""}`}>
            {/* <div className="from">From: {msgObject.senderID}</div> */}
            <div className="msg-body">{msgObject.msgBody}</div>
            <div className="time">{msgObject.time}</div>
        </div>
    )
}

const SelectAChat = () => {
    return (
        <div className="select-chat">
            Please select a conversation
        </div>
    )
}

export default UserChats;
