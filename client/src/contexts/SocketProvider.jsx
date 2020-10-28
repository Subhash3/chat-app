import React, { useContext, createContext, useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
    return useContext(SocketContext)
}

// const SOCKET_IO_SERVER = "http://localhost:3000"
const SOCKET_IO_SERVER = "https://yml-chat-app.herokuapp.com/"

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(undefined)

    useEffect(() => {
        setSocket(socketIOClient(SOCKET_IO_SERVER, {
            path: '/chat-app-socket.io'
        }))
    }, [])


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
