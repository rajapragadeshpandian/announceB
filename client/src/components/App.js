import React from 'react';
import { useSelector } from 'react-redux';
import ChangeLogs from './ChangeLogs';
import Customers from './Customers';
import Header from './Header';
import Page from './Page';
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
          <Route path='/customers/details'
            element={<Customers />} exact />


          <Route path='*' element={<Page />} />

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
