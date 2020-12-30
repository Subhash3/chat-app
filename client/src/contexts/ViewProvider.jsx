import React, { createContext, useContext, useState } from 'react';

const viewContext = createContext()

export const useView = () => {
    return useContext(viewContext)
}

export const WEB_VIEW = "web-view"
export const MOBILE_VIEW = "mobile-view"

const ViewProvider = ({ children }) => {
    let currentView
    if (window.innerWidth < 750) {
        currentView = MOBILE_VIEW
    } else {
        currentView = WEB_VIEW
    }

    const [view, setView] = useState(currentView)

    window.addEventListener('resize', () => {
        if (window.innerWidth < 750) {
            setView(MOBILE_VIEW)
        } else {
            setView(WEB_VIEW)
        }
    })

    return (
        <viewContext.Provider value={[view, setView]}>
            {children}
        </viewContext.Provider>
    );
}

export default ViewProvider;