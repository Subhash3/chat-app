import React, { useState, useContext, createContext } from 'react';

const ActiveConversationContext = createContext()

export const useActiveConversation = () => {
    return useContext(ActiveConversationContext)
}

const ActiveConversationProvider = ({ children }) => {
    const [activeConversationID, setActiveConversationID] = useState(null)

    return (
        <ActiveConversationContext.Provider value={[activeConversationID, setActiveConversationID]}>
            {children}
        </ActiveConversationContext.Provider>
    );
}

export default ActiveConversationProvider;
