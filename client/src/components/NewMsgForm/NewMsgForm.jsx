import React, { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import Picker from 'emoji-picker-react';
import SendIcon from '@material-ui/icons/Send';
import { v4 as uuid } from 'uuid'
import './NewMsgForm.min.css'

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

    const sendMessage = (msgBody) => {
        setOpenEmojiPicker(false)
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
