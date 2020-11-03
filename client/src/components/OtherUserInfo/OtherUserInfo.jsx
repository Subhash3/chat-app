import React from 'react';
import { useUsers } from '../../contexts/UsersProvider'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './OtherUserInfo.min.css'

const OtherUserInfo = () => {
    const [users] = useUsers()
    const [activeConversationID] = useActiveConversation()

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
