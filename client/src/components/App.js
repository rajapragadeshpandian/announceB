import React from 'react';
import Hook from './Test/Hook';
import HookEffect from './Test/HookEffect';
import ComponentC from './Test/ComponentC';
import HookCounter from './Test/HookCounter';
import Users from './Test/Users';
import {useSelector} from 'react-redux';
import ChangeLogs from './ChangeLogs';

export const UserContext = React.createContext();

function App() {
  const text = "React Hooks";

  return (
    <div className="App">
        <h1>AppCoach</h1>
        {/* <Hook text={text}/> */}
        <HookEffect />
        <ChangeLogs/>
        {/* <HookCounter /> */}
        {/* <Users/> */}
        {/* <UserContext.Provider value="rajapragadesh">
        <ComponentC />
        </UserContext.Provider> */}
    </div>
  );
}

export default App;
