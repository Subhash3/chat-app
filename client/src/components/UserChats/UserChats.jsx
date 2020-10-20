import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import './UserChats.min.css'

const messagesDB = [{
    id: 1,
    senderID: 2,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 2,
    senderID: 3,
    receiverID: 1,
    msgBody: `Nice looking app. I want to make it much more beautiful.
     So, I keep working on the frontend side until I'm happy with the looks.
     But I still have to connect it to backend. So, I might wanna skip the fronted for today!`,
    time: '12:00PM',
}, {
    id: 3,
    senderID: 1,
    receiverID: 2,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 4,
    senderID: 1,
    receiverID: 3,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 5,
    senderID: 2,
    receiverID: 4,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 6,
    senderID: 5,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 7,
    senderID: 1,
    receiverID: 2,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 8,
    senderID: 2,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 9,
    senderID: 2,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
},
]

const UserChats = () => {
    const [allChats] = useLocalStorage('user-chats', messagesDB)
    const [userChats, setUserChats] = useState([])
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()

    // console.log({ userChats })

    const extractConversations = () => {
        let conversations = allChats.filter(msgObject => {
            return (msgObject.senderID === currentUser.id && msgObject.receiverID === activeConversationID)
                || (msgObject.receiverID === currentUser.id && msgObject.senderID === activeConversationID)
        })

        // console.log(currentUser, activeConversationID)
        // console.log({ conversations })
        setUserChats(conversations)
    }

    useEffect(() => {
        extractConversations()
    }, [activeConversationID])

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
