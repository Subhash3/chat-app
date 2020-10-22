import React, { useState, useEffect } from 'react';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import { chatAPI } from '../../Apis/chatApi'
// import { useUserChats } from '../../contexts/UserChatsProvider'
import { v4 as uuid } from 'uuid'
import './UserChats.min.css'
import { useRef } from 'react';

const UserChats = () => {
    const [chatDB, setChatDB] = useChatDB()
    const [userChats, setUserChats] = useState()
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()
    const socket = useSocket()
    const chatsRef = useRef()

    console.log("rendering USER_CHATS")
    // console.log({ userChats })
    // console.log({ chatDB })

    const getChatDB = async () => {
        let response = await chatAPI.get('/chats')
        console.log(response.data)
        setChatDB(response.data)
    }

    useEffect(() => {
        getChatDB()
    }, [])

    useEffect(() => {
        chatsRef.current.scroll(0, chatsRef.current.scrollTopMax)
    }, [userChats])

    useEffect(() => {
        const extractConversations = () => {
            console.log("Extracting convos")
            let conversations = chatDB.filter(msgObject => {
                // console.log(msgObject.senderID, msgObject.receiverID, currentUser.id, activeConversationID, msgObject.msgBody)
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
                console.log("[message-sent]: Message Has been sent")
            })

            socket.on('message-not-sent', reason => {
                console.log("[message-not-sent]: Message has been not sent. : " + reason)
            })

            socket.on('received-message', msbObjectString => {
                let msgObject = JSON.parse(msbObjectString)
                console.log("[received-message]: Received message:", msgObject)

                msgObject.id = uuid()
                // setChatDB([...chatDB, msgObject])
                getChatDB()
            })

            socket.on('flush-messages', allMessagesStringified => {
                console.log("[flush-messages]: Got flushed messages")
                let allMessages = JSON.parse(allMessagesStringified)
                addFlushedMessages(allMessages)
            })
        }

    }, [socket])

    const addFlushedMessages = (allMessages) => {
        if (!allMessages)
            return

        let allMesssageObjects = []

        allMessages.forEach(message => {
            allMesssageObjects.push(JSON.parse(message))
        })

        setChatDB([...chatDB, ...allMesssageObjects])
    }

    return (
        <div ref={chatsRef} className="chats">
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
