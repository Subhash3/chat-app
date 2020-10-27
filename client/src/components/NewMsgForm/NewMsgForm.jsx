import React, { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import { v4 as uuid } from 'uuid'
import './NewMsgForm.min.css'

const NewMsgForm = () => {
    const [newMsg, setNewMsg] = useState("")
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

    const sendMessage = (msgBody) => {
        let msgObject = {
            id: uuid(),
            senderID: currentUser.id,
            receiverID: activeConversationID,
            msgBody,
            time: new Date().toLocaleString().split(' ')[1],
        }

        socket.emit('send-message', JSON.stringify(msgObject))

        setChatDB([...chatDB, msgObject])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
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
            <button type="submit" className="send-msg">Send</button>
        </form>
    );
}

export default NewMsgForm;
