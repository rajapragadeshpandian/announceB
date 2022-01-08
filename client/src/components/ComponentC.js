import React, {useContext} from 'react';
import { UserContext } from './App';

const ComponentC = () => {
const user = useContext(UserContext);
console.log(user);
    return (
        <h3>{user}</h3>
    )
};

export default ComponentC;