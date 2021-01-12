import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import { useChatDB } from '../../contexts/ChatDBProvider'
import { useSelectionToolBarStatus } from '../../contexts/SelectionToolBarStatusProvider'
import { useSelectedMessages } from '../../contexts/SelectedMessagesProvider'
import { chatAPI } from '../../Apis/chatApi'
import { useSocket } from '../../contexts/SocketProvider'
import './SelectionToolBar.min.css'

const SelectionToolBar = () => {
    const [_isToolbarActive, setToolbarActive] = useSelectionToolBarStatus()
    const [selectedMessages, setSelectedMessages] = useSelectedMessages()
    const [chatDB, setChatDB] = useChatDB()
    const [currentUser] = useCurrentUser()
    const socket = useSocket()

    const clearSelection = () => {
        setSelectedMessages(new Set())
    }

    const closeToolBar = () => {
        setToolbarActive(false)
        clearSelection()
    }

    const getChatDB = async () => {
        console.log("***Fetching chat database***")
        let userID = currentUser.id
        let response = await chatAPI.get(`/chats/${userID}`)
        console.log("***Got chat DB***")
        console.log(response.data)
        setChatDB(response.data)
    }

    const deleteMessage = async () => {
        console.log("Deleting messages with IDs:", selectedMessages)
        // let response = await chatAPI.get(`/delete/${JSON.stringify([...selectedMessages])}`)
        // console.log("****************************************")
        // console.log(`SelectedMessages[0]: ${[...selectedMessages][0]}`)
        let msgObject = chatDB.filter(msg => msg.id === [...selectedMessages][0])
        console.log(msgObject)
        let response = await chatAPI.post('/delete', {
            // stringfiedIDs: JSON.stringify([...selectedMessages]),
            messageIDs: [...selectedMessages],
            senderID: msgObject.senderID,
            receiverID: msgObject.receiverID

        })
        console.log(response.data)
        closeToolBar()
        if (response.data.status === 1) {
            let msgObject = chatDB.filter(msg => msg.id === [...selectedMessages][0])[0]
            let receiverID = msgObject.receiverID
            let senderID = msgObject.senderID

            // console.log("****************************************")
            // console.log(msgObject)
            // Object.keys(msgObject).forEach(key => console.log(key, msgObject[key]))
            // console.log({ receiverID })
            console.log("Deleted messages!")
            console.log(`Emitting "deleted-msgs-ack to ${receiverID} and ${senderID}`)
            socket.emit("deleted-msgs-ack", receiverID)
            socket.emit("deleted-msgs-ack", senderID)

            // getChatDB()
        } else {
            alert("Failed to delete messages!")
        }
    }

    return (
        <div className="selection-toolbar">
            <div className="delete"
                onClick={deleteMessage}
            >
                <DeleteIcon />
            </div>
            <div className="forward">
                <ReplyIcon />
            </div>
            <div className="cancel"
                onClick={closeToolBar}
            >Cancel</div>
        </div>
    );
}

export default SelectionToolBar;
