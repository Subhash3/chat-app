import React from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow/ChatWindow.jsx'
import LoginForm from './components/LoginForm/LoginForm'
import UsersProvider from './contexts/UsersProvider'
import CurrentUserProvider from './contexts/CurrentUserProvider'
import ActiveConversationProvider from './contexts/ActiveConversationProvider'
import ChatDBProvider from './contexts/ChatDBProvider'
import SocketProvider from './contexts/SocketProvider'
// import UserChatsProvider from './contexts/UserChatsProvider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <UsersProvider>
      <ActiveConversationProvider>
        {/* <UserChatsProvider> */}
        <SocketProvider>
          <CurrentUserProvider>
            <ChatDBProvider>
              <div className="App">
                <Router>
                  <Switch>
                    <Route exact path='/' component={ChatWindow}></Route>
                    <Route path='/login' component={LoginForm} ></Route>
                  </Switch>
                </Router>
              </div>
            </ChatDBProvider>
          </CurrentUserProvider>
        </SocketProvider>
        {/* </UserChatsProvider> */}
      </ActiveConversationProvider>
    </UsersProvider>
  );
}

export default App;
