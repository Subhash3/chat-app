import React, { useEffect } from 'react';
import { useUsers } from '../../contexts/UsersProvider'
import User from '../User/User.jsx'
import { useActiveConversation } from '../../contexts/ActiveConversationProvider'
import { useCurrentUser } from '../../contexts/CurrentUserProvider'
import './UsersList.min.css'

const UsersList = () => {
    const [users, setUsers] = useUsers()
    const [currentUser] = useCurrentUser()
    const [activeConversationID, setActiveConversationID] = useActiveConversation()

    // console.log({ users })

    const removeThisUserFromUsersList = (thisUser) => {
        let newUsersList = users.filter(user => user.id !== thisUser.id)
        setUsers(newUsersList)
    }

    useEffect(() => {
        removeThisUserFromUsersList(currentUser)
    }, [currentUser])

    const handleClick = (e) => {
        // console.log("Convo has been clicked", e.target)
        let userID = e.target.dataset.userId
        userID = parseInt(userID)
        // console.log({ userID })
        setActiveConversationID(userID)
    }

    return (
        <div className="users-list">
            {users.map(user => {
                return <User user={user} key={user.id} handleClick={handleClick} active={user.id === activeConversationID} />
            })}
        </div>
    );
}

export default UsersList;
