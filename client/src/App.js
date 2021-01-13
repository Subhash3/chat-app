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
import ActiveMessageOptionsProvider from './contexts/ActiveMessageOptionsProvider'
import NewMsgsMapProvider from './contexts/NewMsgsMapProvider'
// import SidebarRefProvider from './contexts/SidebarRefProvider'
// import UserChatsProvider from './contexts/UserChatsProvider'
import SelectedMessagesProvider from './contexts/SelectedMessagesProvider'
import SelectionToolBarStatusProvider from './contexts/SelectionToolBarStatusProvider'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <ViewProvider>
      <NewMsgsMapProvider>
        <ActiveMessageOptionsProvider>
          <SelectionToolBarStatusProvider>
            <UsersProvider>
              <ActiveConversationProvider>
                <SelectedMessagesProvider>
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
                </SelectedMessagesProvider>
              </ActiveConversationProvider>
            </UsersProvider>
          </SelectionToolBarStatusProvider>
        </ActiveMessageOptionsProvider>
      </NewMsgsMapProvider>
    </ViewProvider>
  );
}

export default App;
