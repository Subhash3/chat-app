import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSocket } from '../../contexts/SocketProvider'
import { chatAPI } from '../../Apis/chatApi'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CachedIcon from '@material-ui/icons/Cached'
import CancelIcon from '@material-ui/icons/Cancel'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useActiveMessageOptionsID } from '../../contexts/ActiveMessageOptionsProvider.jsx'
import SelectionToolBar from '../SelectionToolBar/SelectionToolBar'
import { useSelectedMessages } from '../../contexts/SelectedMessagesProvider'
import ContactsIcon from '@material-ui/icons/Contacts';// import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { MSG_PENDING, MSG_SENT, MSG_NOT_SENT } from '../NewMsgForm/NewMsgForm'
import { useSelectionToolBarStatus } from '../../contexts/SelectionToolBarStatusProvider'

import './UserChats.min.css'

// Probably not an efficient way to do this!
export const toggleSidebar = (e) => {
    let sidebar = document.querySelector('.window-sidebar')
    // let toggleButton = document.querySelector('.toggle-sidebar')

    sidebar.classList.toggle('active')
    // toggleButton.classList.toggle('move-left')
}

const UserChats = () => {
    const [chatDB, setChatDB] = useChatDB()
    const [userChats, setUserChats] = useState([])
    const [currentUser] = useCurrentUser()
    const [activeConversationID] = useActiveConversation()
    const [msgIDWithActiveOptions, setMsgIDWithActiveOptions] = useActiveMessageOptionsID()
    const [isToolbarActive, _setToolbarActive] = useSelectionToolBarStatus()

    const socket = useSocket()
    const chatsRef = useRef()
    let prevDate = undefined
    // const toggleSidebarRef = useRef()

    console.log("rendering USER_CHATS")
    // console.log({ userChats })
    // console.log({ chatDB })

    const getChatDB = async () => {
        console.log("***Fetching chat database***")
        let userID = currentUser.id
        let response = await chatAPI.get(`/chats/${userID}`)
        // console.log("***Got char DB***")
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
        // toggleSidebarRef.current.addEventListener('click', toggleSidebar)
    }, [])

    useEffect(() => {
        scrollToLatestMsg()
    }, [userChats])

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


    console.log({ msgIDWithActiveOptions })
    const toggleMenu = (msgID) => {
        console.log("\tInside toggleMenu")
        console.log("Message Id: ", msgID)
        console.log("Actoive message options: ", msgIDWithActiveOptions)
        if (msgID === msgIDWithActiveOptions) {
            setMsgIDWithActiveOptions(null)
        } else {
            setMsgIDWithActiveOptions(msgID)
        }

        return
    }

    return (
        <div ref={chatsRef} className="chats">
            {isToolbarActive && <SelectionToolBar />}
            {activeConversationID ? (userChats.map(chatObject => {
                let returnElement = (prevDate === undefined || prevDate !== chatObject.date)
                    ? (
                        <>
                            <DateLabel key={chatObject.id + "date-label"} date={chatObject.date} />
                            <Message key={chatObject.id} msgObject={chatObject} toggleMenu={() => toggleMenu(chatObject.id)} />
                        </>
                    )
                    : (<Message key={chatObject.id} msgObject={chatObject} toggleMenu={() => toggleMenu(chatObject.id)} />)
                prevDate = chatObject.date
                return returnElement
            }))
                : <SelectAChat />}
        </div>
    );
}

const Message = ({ msgObject, toggleMenu }) => {
    const [currentUser] = useCurrentUser()
    const [isToolbarActive, setToolbarActive] = useSelectionToolBarStatus()
    const [msgIDWithActiveOptions, _setMsgIDWithActiveOptions] = useActiveMessageOptionsID()
    const [selectedMessages, setSelectedMessages] = useSelectedMessages()

    let isSender = (msgObject.senderID === currentUser.id)
    let msgStatus = msgObject.status

    console.log("rendering Message component")

    // console.log("selectedMessages: ", selectedMessages)

    const selectMessage = (msgID) => {
        if (selectedMessages.has(msgID)) {
            selectedMessages.delete(msgID)
            setSelectedMessages(selectedMessages)
        }
        else {
            setSelectedMessages(new Set([...selectedMessages, msgID]))
        }
    }

    return (
        <div className={`message-element ${isSender ? "sender" : ""}`}>
            {isToolbarActive &&
                <div className="select-box">
                    <input type="checkbox" onClick={() => selectMessage(msgObject.id)} />
                </div>
            }
            <div className={`msg ${isSender ? "sender" : ""} ${msgStatus}`}>
                {/* <div className="from">From: {msgObject.senderID}</div> */}
                <div className="msg-body">{msgObject.msgBody}</div>
                <div className="time">{msgObject.time}</div>
                {isSender && <MsgStatusIcon status={msgStatus} />}
                <span className="msg-options-icon"><ExpandMoreIcon onClick={toggleMenu} /></span>
                <MessageOptions msgObject={msgObject} msgIDWithActiveOptions={msgIDWithActiveOptions} msgID={msgObject.id} />
            </div>
        </div>
    )
}

const MessageOptions = ({ msgObject, msgIDWithActiveOptions, msgID }) => {
    const [isToolbarActive, setToolbarActive] = useSelectionToolBarStatus()
    const [selectedMessages, setSelectedMessages] = useSelectedMessages()

    console.log("Rendering message options")
    console.log({ msgIDWithActiveOptions, msgID })

    const forwardMessage = () => {
        console.log("Forwarding message with ID:", msgID)
        setToolbarActive(false)
        setSelectedMessages(new Set())
    }

    const copyMessage = () => {
        // console.log("Copying message with ID:", msgID)
        let clipboardPromise = navigator.clipboard.writeText(msgObject.msgBody)
        clipboardPromise
            .then(() => {
                console.log("Copied message with ID:", msgID)
            })
            .catch(() => {
                console.log("Error copying message with ID:", msgID)
            })
    }

    const activateToolBar = () => {
        console.log("Activating toolbar!")
        setToolbarActive(!isToolbarActive)
    }


    return (
        <div className={`msg-options ${(msgIDWithActiveOptions === msgID) ? "active" : ""}`}>
            <div className="option forward" onClick={forwardMessage}>Forward</div>
            <div className="option copy" onClick={copyMessage}>Copy</div>
            <div className="option more" onClick={activateToolBar}>More</div>
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

// const datesDifference = (date1, date2) => {
//     return Math.abs((date1 - date2) / (1000 * 60 * 60 * 24))
// }

const DateLabel = ({ date }) => {
    // let dateString = null
    return (
        <p className="date-label">{date}</p>
    )
}

export default UserChats;
