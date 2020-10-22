import React, { useState, useContext, createContext } from 'react';
// import { useSessionStorage } from '../hooks/useSessionStorage'

const ChatDBContext = createContext()

export const useChatDB = () => {
    return useContext(ChatDBContext)
}

const ChatDBProvider = ({ children }) => {
    const [chatDB, setChatDB] = useState([])

    return (
        <ChatDBContext.Provider value={[chatDB, setChatDB]}>
            {children}
        </ChatDBContext.Provider>
    );
}

export default ChatDBProvider;


// const messagesDB = [
//     {
//         id: 1,
//         senderID: '2',
//         receiverID: '1',
//         msgBody: "ABCD",
//         time: '12:00PM',
//     },
//     {
//         id: 2,
//         senderID: '2',
//         receiverID: '3',
//         msgBody: "EFGH",
//         time: '12:00PM',
//     },
//     {
//         id: 3,
//         senderID: '1',
//         receiverID: '2',
//         msgBody: "IJKL",
//         time: '12:00PM',
//     },
//     {
//         id: 4,
//         senderID: '4',
//         receiverID: '1',
//         msgBody: "MNOP",
//         time: '12:00PM',
//     },
//     {
//         id: 1,
//         senderID: '2',
//         receiverID: '4',
//         msgBody: "QRST",
//         time: '12:00PM',
//     },
//     {
//         id: 5,
//         senderID: '2',
//         receiverID: '3',
//         msgBody: "UVW",
//         time: '12:00PM',
//     },
//     {
//         id: 6,
//         senderID: '1',
//         receiverID: '4',
//         msgBody: "XYZ",
//         time: '12:00PM',
//     },
//     {
//         id: 7,
//         senderID: '5',
//         receiverID: '1',
//         msgBody: "Hell",
//         time: '12:00PM',
//     },
// ]