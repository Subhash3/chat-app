import React from 'react';
import { useUsers } from '../../contexts/UsersProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { toggleSidebar } from '../UserChats/UserChats'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useView } from '../../contexts/ViewProvider'
import { MOBILE_VIEW } from '../../contexts/ViewProvider'
import './OtherUserInfo.min.css'

const OtherUserInfo = () => {
    const [users] = useUsers()
    const [activeConversationID] = useActiveConversation()
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
                <MoreVertIcon />
            </div>
        </div>
    );
}

export default OtherUserInfo;
