import React, { useState, useContext, createContext } from 'react';

const ActiveMessageOptionsContext = createContext()

export const useActiveMessageOptionsID = () => {
    return useContext(ActiveMessageOptionsContext)
}

const ActiveMessageOptionsProvider = ({ children }) => {
    const [msgIDWithActiveOptions, setMsgIDWithActiveOptions] = useState(null)

    return (
        <ActiveMessageOptionsContext.Provider value={[msgIDWithActiveOptions, setMsgIDWithActiveOptions]}>
            {children}
        </ActiveMessageOptionsContext.Provider>
    );
}

export default ActiveMessageOptionsProvider;
