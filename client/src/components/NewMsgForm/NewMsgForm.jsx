import React, { useState } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import './NewMsgForm.min.css'

const NewMsgForm = () => {
    const [newMsg, setNewMsg] = useState("")
    const [chatDB, setChatDB] = useChatDB()
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()
    const socket = useSocket()

    const sendMessage = (msgBody) => {
        let msgObject = {
            id: chatDB.length + 1,
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
            />
            <button type="submit" className="send-msg">Send</button>
        </form>
    );
}

export default NewMsgForm;
