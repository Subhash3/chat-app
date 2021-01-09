import React, { useState, useContext, createContext } from 'react'

const SelectedMessagesContext = createContext()

export const useSelectedMessages = () => {
    return useContext(SelectedMessagesContext)
}

const SelectedMessagesProvider = ({ children }) => {
    const [selectedMessages, setSelectedMessages] = useState(new Set())

    return (
        <SelectedMessagesContext.Provider value={[selectedMessages, setSelectedMessages]}>
            {children}
        </SelectedMessagesContext.Provider>
    );
}

export default SelectedMessagesProvider;