import React, { useState, useEffect } from 'react';
// import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import { chatAPI } from '../../Apis/chatApi'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CachedIcon from '@material-ui/icons/Cached'
import CancelIcon from '@material-ui/icons/Cancel'
// import { useUserChats } from '../../contexts/UserChatsProvider'
import { MSG_PENDING, MSG_SENT, MSG_NOT_SENT } from '../NewMsgForm/NewMsgForm'
import { v4 as uuid } from 'uuid'
import './UserChats.min.css'
import { useRef } from 'react';

const UserChats = () => {
    const [chatDB, setChatDB] = useChatDB()
    const [userChats, setUserChats] = useState([])
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()
    const msgIDToStatusMap = {}
    const socket = useSocket()
    const chatsRef = useRef()

    console.log("rendering USER_CHATS")
    // console.log({ userChats })
    // console.log({ chatDB })

    const getChatDB = async () => {
        let userID = currentUser.id
        let response = await chatAPI.get(`/chats/${userID}`)
        // console.log(response.data)
        setChatDB(response.data)
    }

    const scrollToLatestMsg = () => {
        let chatsWindowProto = chatsRef.current.__proto__
        let scrollTopMax
        if (!("scrollTopMax" in chatsWindowProto)) {
            // console.log("Hiiii:", chatsRef.current.scrollHeight, chatsRef.current.clientHeight)
            scrollTopMax = chatsRef.current.scrollHeight - chatsRef.current.clientHeight
        } else {
            scrollTopMax = chatsRef.current.scrollTopMax
        }
        chatsRef.current.scroll(0, scrollTopMax)
    }

    useEffect(() => {
        getChatDB()
    }, [])

    useEffect(() => {
        scrollToLatestMsg()
    }, [userChats])

    // useEffect(() => {
    //     console.log("-----ChatDB changed!-----")
    //     console.log("ChatDB: ", chatDB)
    // }, [chatDB])

    // const changeMessageState = (msgID, msgStatus) => {
    //     console.log("Changing the state of the message with ID: ", msgID)
    //     msgIDToStatusMap[msgID] = msgStatus
    // }

    const extractConversations = () => {
        console.log("Extracting convos")
        // console.log("Chat DB Length: ", chatDB.length)
        let conversations = chatDB.filter(msgObject => {
            // console.log(msgObject.senderID, msgObject.receiverID, currentUser.id, activeConversationID, msgObject.msgBody)
            // if ((msgObject.senderID === currentUser.id && msgObject.receiverID === activeConversationID)
            //     || (msgObject.receiverID === currentUser.id && msgObject.senderID === activeConversationID)) {
            //     console.log("Meets")
            // }
            return (msgObject.senderID === currentUser.id && msgObject.receiverID === activeConversationID)
                || (msgObject.receiverID === currentUser.id && msgObject.senderID === activeConversationID)
        })

        setUserChats(conversations)
    }

    useEffect(() => {
        extractConversations()
    }, [activeConversationID, chatDB, currentUser.id, socket])

    useEffect(() => {

        // Setup SocketIO events
        if (socket) {
            // socket.on('message-sent', (id) => {
            //     console.log("[message-sent]: Message Has been sent")
            //     changeMessageState(id, MSG_SENT)
            //     console.log({ userChats, chatDB })
            // })

            // socket.on('message-not-sent', (reason, id) => {
            //     console.log("[message-not-sent]: Message has been not sent. : " + reason)
            //     changeMessageState(id, MSG_NOT_SENT)
            // })

            // socket.on('pending', (reason, id) => {
            //     console.log("[pending]: Message pending... : " + reason)
            //     changeMessageState(id, MSG_PENDING)
            // })

            socket.on('received-message', msbObjectString => {
                let msgObject = JSON.parse(msbObjectString)
                console.log("[received-message]: Received message:", msgObject)

                // msgObject.id = uuid()
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
    let msgStatus = msgObject.status
    console.log(msgStatus, msgObject.msgBody)

    return (
        <div className={`msg ${isSender ? "sender" : ""} ${msgStatus}`}>
            {/* <div className="from">From: {msgObject.senderID}</div> */}
            <div className="msg-body">{msgObject.msgBody}</div>
            <div className="time">{msgObject.time}</div>
            {isSender && <MsgStatusIcon status={msgStatus} />}
        </div>
    )
}

const MsgStatusIcon = ({ status }) => {
    if (status === MSG_SENT)
        return <CheckCircleIcon />
    else if (status === MSG_NOT_SENT)
        return <CancelIcon />
    else if (status === MSG_PENDING)
        return <CachedIcon />
}

const SelectAChat = () => {
    return (
        <div className="select-chat">
            Please select a conversation
        </div>
    )
}

export default UserChats;
