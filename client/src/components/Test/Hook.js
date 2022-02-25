import React, { useState, useEffect } from 'react';
import * as actions from '../../state/actions';

const Hook = (props) => {

    const [count, setCount] = useState(0);
    const [name, setName] = useState({ firstName: '', lastName: '' });
    const [items, setItems] = useState([]);

    const incrementFive = () => {
        for (let i = 0; i < 5; i++) {
            setCount(prevCount => prevCount + 1)
        }
    }

    const addItem = () => {
        setItems([...items, {
            id: items.length,
            value: Math.random()
        }])
        console.log("array");
    }
    // const addItem = () => {
    //     setItems([...items, Math.random()]);
    //     console.log("array");
    // }

    return (
        <div>
            <h2>{props.text}</h2>
            <div className="one">
                <button onClick={() => setCount(prevCount => prevCount + 1)}>
                    increment
        </button>
                <button onClick={() => setCount(prevCount => prevCount - 1)}>
                    decrement
        </button>
                <button onClick={incrementFive}>Add5</button>
                <p>{count}</p>
            </div>
            <div className="two">
                <form>
                    <input type="text"
                        value={name.firstName}
                        onChange={(e) => setName({ ...name, firstName: e.target.value })}
                    />
                    <input type="text"
                        value={name.lastName}
                        onChange={(e) => setName({ ...name, lastName: e.target.value })}
                    />
                    <p>firstName : {name.firstName}</p>
                    <p>lastName : {name.lastName}</p>

                </form>
            </div>
            <div>
                <button onClick={addItem}>AddItems</button>
                <ul>
                    {items.map(item => (
                        <li key={item.id}>{item.value}</li>
                    ))}
                </ul>

            </div>
        </div>
    )

}

export default Hook;