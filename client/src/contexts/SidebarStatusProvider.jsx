import React, { createContext, useContext, useState } from 'react';

const SidebarStatusContext = createContext()

export const useSidebarStatus = () => {
    return useContext(SidebarStatusContext)
}

const SidebarStatusProvider = ({ children }) => {
    const [sidebarActive, setSidebarActive] = useState(false)

    return (
        <SidebarStatusContext.Provider value={[sidebarActive, setSidebarActive]}>
            {children}
        </SidebarStatusContext.Provider>
    );
}

export default SidebarStatusProvider;
