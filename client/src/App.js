import React from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow/ChatWindow.jsx'
import LoginForm from './components/LoginForm/LoginForm'
import UsersProvider from './contexts/UsersProvider'
import CurrentUserProvider from './contexts/CurrentUserProvider'
import ActiveConversationProvider from './contexts/ActiveConversationProvider'
import ChatDBProvider from './contexts/ChatDBProvider'
import SocketProvider from './contexts/SocketProvider'
import ViewProvider from './contexts/ViewProvider'
// import SidebarRefProvider from './contexts/SidebarRefProvider'
// import UserChatsProvider from './contexts/UserChatsProvider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <ViewProvider>
      <UsersProvider>
        <ActiveConversationProvider>
          {/* <UserChatsProvider> */}
          <ChatDBProvider>
            <SocketProvider>
              <CurrentUserProvider>
                <div className="App">
                  <Router>
                    <Switch>
                      <Route exact path='/' component={ChatWindow}></Route>
                      <Route path='/login' component={LoginForm} ></Route>
                    </Switch>
                  </Router>
                </div>
              </CurrentUserProvider>
            </SocketProvider>
          </ChatDBProvider>
          {/* </UserChatsProvider> */}
        </ActiveConversationProvider>
      </UsersProvider>
    </ViewProvider>
  );
}

export default App;
