import React, { useState, useContext, createContext } from 'react';

const SelectionToolBarStatusContext = createContext()

export const useSelectionToolBarStatus = () => {
    return useContext(SelectionToolBarStatusContext)
}

const SelectionToolBarStatusProvider = ({ children }) => {
    const [isToolbarActive, setToolbarActive] = useState(false)

    return (
        <SelectionToolBarStatusContext.Provider value={[isToolbarActive, setToolbarActive]}>
            {children}
        </SelectionToolBarStatusContext.Provider>
    );
}

export default SelectionToolBarStatusProvider;
