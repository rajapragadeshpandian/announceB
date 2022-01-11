import React from 'react';
import Hook from './Test/Hook';
import HookEffect from './Test/HookEffect';
import ComponentC from './Test/ComponentC';
import HookCounter from './Test/HookCounter';
import Users from './Test/Users';
import { useSelector } from 'react-redux';
import ChangeLogs from './ChangeLogs';
import Header from './Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const UserContext = React.createContext();

function App() {
  const text = "React Hooks";

  return (
    <div className="App">
      <BrowserRouter>
        {/* <HookEffect /> */}
        <Routes>
          <Route path='/'
            element={<Header />} exact />
          <Route path='/dashboard'
            element={<ChangeLogs />} exact />
        </Routes>
      </BrowserRouter>

      {/* <HookCounter /> */}
      {/* <Users/> */}
      {/* <UserContext.Provider value="rajapragadesh">
        <ComponentC />
        </UserContext.Provider> */}
      {/* <Hook text={text}/> */}
    </div>
  );
}

export default App;
