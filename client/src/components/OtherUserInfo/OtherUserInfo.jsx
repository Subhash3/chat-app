import React, { useState } from 'react';
import { useUsers } from '../../contexts/UsersProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { toggleSidebar } from '../UserChats/UserChats'
import { chatAPI } from '../../Apis/chatApi'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSocket } from '../../contexts/SocketProvider'
import { useView } from '../../contexts/ViewProvider'
import { MOBILE_VIEW } from '../../contexts/ViewProvider'
import './OtherUserInfo.min.css'

const OtherUserInfo = () => {
    const [users] = useUsers()
    const [activeConversationID] = useActiveConversation()
    const [isSettingsMenuActive, setSettingsActive] = useState(false)
    const [view, _setView] = useView()

    const getOtherUserName = () => {
        for (let user of users) {
            // console.log("HIHIH: ", user.name)
            if (user.id === activeConversationID) {
                return user.name
            }
        }

        return activeConversationID
    }

    const toggleSettingsMenu = () => {
        setSettingsActive(!isSettingsMenuActive)
    }

    return (
        <div className="other-user-info">
            {(view === MOBILE_VIEW) && (<div
                className="back-button"
                onClick={toggleSidebar}
            >
                <ArrowBackIcon />
            </div>)
            }
            <div className="image"></div>
            <div className="name">
                {getOtherUserName()}
                {/* <div className="status">{}</div> */}
            </div>
            <div className="settings">
                <MoreVertIcon onClick={toggleSettingsMenu} />
                <SettingsMenu isActive={isSettingsMenuActive} />
            </div>
        </div>
    );
}

const SettingsMenu = ({ isActive }) => {
    const [activeConversationID] = useActiveConversation()
    const [currentUser] = useCurrentUser()
    const socket = useSocket()

    const deleteConversation = async () => {
        let id1 = currentUser.id
        let id2 = activeConversationID


        console.log({ activeConversationID, myID: currentUser.id })
        console.log({ id1, id2 })
        let response = await chatAPI.post('/delete-convo', {
            IDs: { id1, id2 }
        })
        if (response.data.status === 1) {
            console.log("Deleted conversation!")
            console.log(`Emitting "deleted-msgs-ack to ${id2} and ${id1}`)
            socket.emit("deleted-msgs-ack", id2)
            socket.emit("deleted-msgs-ack", id1)
        } else {
            alert("Failed to delete conversation!")
        }
    }

    return (
        <div className={`settings-menu ${isActive ? "active" : ""}`}>
            <div className="block">Block User</div>
            <div className="delete-convo"
                onClick={deleteConversation}
            >Delete Conversation</div>
            <div className="some-shit">Some Shit</div>
        </div>
    )
}

export default OtherUserInfo;
