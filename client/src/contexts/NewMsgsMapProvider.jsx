import React, { useState, useContext, createContext } from 'react';

const NewMsgsMapContext = createContext()

export const useNewMessagesMap = () => {
    return useContext(NewMsgsMapContext)
}

const NewMsgsMapProvider = ({ children }) => {
    const [newMsgsMap, setNewMsgMap] = useState({})

    return (
        <NewMsgsMapContext.Provider value={[newMsgsMap, setNewMsgMap]}>
            {children}
        </NewMsgsMapContext.Provider>
    );
}

export default NewMsgsMapProvider;
