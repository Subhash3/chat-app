import React, { useState, useContext, createContext } from 'react';

const ChatDBContext = createContext()

export const useChatDB = () => {
    return useContext(ChatDBContext)
}

const ChatDBProvider = ({ children }) => {
    const [chatDB, setChatDB] = useState(messagesDB)

    return (
        <ChatDBContext.Provider value={[chatDB, setChatDB]}>
            {children}
        </ChatDBContext.Provider>
    );
}

export default ChatDBProvider;


const messagesDB = [{
    id: 1,
    senderID: 2,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 2,
    senderID: 3,
    receiverID: 1,
    msgBody: `Nice looking app. I want to make it much more beautiful.
     So, I keep working on the frontend side until I'm happy with the looks.
     But I still have to connect it to backend. So, I might wanna skip the fronted for today!`,
    time: '12:00PM',
}, {
    id: 3,
    senderID: 1,
    receiverID: 2,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 4,
    senderID: 1,
    receiverID: 3,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 5,
    senderID: 2,
    receiverID: 4,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 6,
    senderID: 5,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 7,
    senderID: 1,
    receiverID: 2,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 8,
    senderID: 2,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
}, {
    id: 9,
    senderID: 2,
    receiverID: 1,
    msgBody: "Hello bri...!",
    time: '12:00PM',
},
]