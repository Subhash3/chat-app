import React, { useState, useContext, createContext } from 'react';

const UserChatsContext = createContext()

export const useUserChats = () => {
    return useContext(UserChatsContext)
}

const UserChatsProvider = ({ children }) => {
    const [userChats, setUserChats] = useState([])

    return (
        <UserChatsContext.Provider value={[userChats, setUserChats]}>
            {children}
        </UserChatsContext.Provider>
    );
}

export default UserChatsProvider;
