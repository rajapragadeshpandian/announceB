import React from 'react';
import Hook from './Hook';
import HookEffect from './HookEffect';
import ComponentC from './ComponentC';
import HookCounter from './HookCounter';
import Users from './Users';
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
