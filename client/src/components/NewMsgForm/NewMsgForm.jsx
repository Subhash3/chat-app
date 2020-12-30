import React, { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import { chatAPI } from '../../Apis/chatApi'
import Picker from 'emoji-picker-react';
import SendIcon from '@material-ui/icons/Send';
import { v4 as uuid } from 'uuid'
import './NewMsgForm.min.css'

export const MSG_PENDING = "pending"
export const MSG_SENT = "msg-sent"
export const MSG_NOT_SENT = "msg-not-sent"

const NewMsgForm = () => {
    const [newMsg, setNewMsg] = useState("")
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [chatDB, setChatDB] = useChatDB()
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()
    const socket = useSocket()
    const inputRef = useRef()

    // console.log("rendering NEW_MSG_FORM")

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }

        return () => {

        }
    }, [activeConversationID, inputRef])

    const onEmojiClick = (event, emojiObject) => {
        setNewMsg(newMsg + emojiObject.emoji);
        if (inputRef.current) {
            inputRef.current.focus()
        }
    };

    const changeMessageState = (msgID, msgStatus) => {
        console.log("Changing the state of the message with ID: ", msgID)
        setChatDB((prevChatDB) => {
            return prevChatDB.map(chatObj => {
                if (chatObj.id === msgID) {
                    return { ...chatObj, status: msgStatus }
                }
                return chatObj
            })
        })
    }

    const sendMessage = (msgBody) => {
        setOpenEmojiPicker(false)
        let msgObject = {
            id: uuid(),
            senderID: currentUser.id,
            receiverID: activeConversationID,
            msgBody,
            status: MSG_PENDING,
            time: new Date().toLocaleString().split(' ')[1],
            date: new Date().toLocaleDateString("en-us"),
        }

        console.log("Sending message: ", msgObject)

        socket.emit('send-message', JSON.stringify(msgObject))
        setChatDB([...chatDB, msgObject])

        socket.on('message-sent', (id) => {
            console.log("[message-sent]: Message Has been sent")
            // console.log(chatDB)
            changeMessageState(id, MSG_SENT)
        })

        socket.on('message-not-sent', (reason, id) => {
            console.log("[message-not-sent]: Message has been not sent. : " + reason)
            changeMessageState(id, MSG_NOT_SENT)
        })

        socket.on('pending', (reason, id) => {
            console.log("[pending]: Message pending... : " + reason)
            changeMessageState(id, MSG_PENDING)
        })

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

    const addFlushedMessages = (allMessages) => {
        if (!allMessages)
            return

        let allMesssageObjects = []

        allMessages.forEach(message => {
            allMesssageObjects.push(JSON.parse(message))
        })

        setChatDB([...chatDB, ...allMesssageObjects])
    }

    const getChatDB = async () => {
        console.log("***Fetching chat database***")
        let userID = currentUser.id
        let response = await chatAPI.get(`/chats/${userID}`)
        console.log("***Got char DB***")
        console.log(response.data)
        setChatDB(response.data)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newMsg) return
        sendMessage(newMsg)
        setNewMsg("")
    }

    const handleChange = (e) => {
        setNewMsg(e.target.value)
    }

    return !activeConversationID ? null : (
        <form
            className="new-msg-form"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                className="new-msg"
                value={newMsg}
                onChange={handleChange}
                ref={inputRef}
            />
            <div
                className="emotes"
                onClick={(e) => { setOpenEmojiPicker(!openEmojiPicker) }}
            >
                😊
            </div>
            {
                openEmojiPicker &&
                <Picker preload={false} onEmojiClick={onEmojiClick} />
            }

            <button type="submit" className="send-msg"><SendIcon /></button>
        </form>
    );
}

export default NewMsgForm;
