import React, { createContext, useContext } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage'

const currentUserContext = createContext()

export const useCurrentUser = () => {
    return useContext(currentUserContext)
}

const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useSessionStorage('currentUser', null)

    return (
        <currentUserContext.Provider value={[currentUser, setCurrentUser]}>
            {children}
        </currentUserContext.Provider>
    );
}

export default CurrentUserProvider;
