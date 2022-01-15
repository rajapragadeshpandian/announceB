import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Row, Col } from 'antd';
import { Layout } from 'antd';
import { Menu, Dropdown, Button, Space, Radio, Input } from 'antd';
import { Card } from 'antd';




// onClick={() => setType('posts')}
const Customers = () => {
    const style = {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        flexWrap: "wrap"
        //backgroundColor: '#FF6D00'
    };

    const textstyle = {
        marginRight: 3,
        marginBottom: 5,
        height: 32,
        borderradius: 4
    }
    const [initialFilter, toggleFilter] = useState(true);
    const [newFilter, setFilter] = useState(false);
    const [newFilterValue, setFilterValue] = useState([]);
    const [conditionsValue, setConditionsValue] = useState([]);
    const [value, setRadioValue] = useState("is");
    const [showOperatos, toggleOperators] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [AddButton, showAddButton] = useState(false);
    const [showConditions, setConditions] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    console.log(newFilterValue);
    function handleMenuClick(e) {

        const value = e.domEvent.target.innerHTML;//c
        toggleFilter(false);
        setFilter(true);
        //setFilterValue([...newFilterValue, { name: value, operator: "is", value: "" }]);
        toggleOperators(true);
        if (clickCount > 0) {
            // setConditionsValue([{ separator: "and" }]);
            // setFilterValue([{ name: value, operator: "is", value: "" }]);
            newFilterValue.push({ separator: "and" });
            setFilterValue([...newFilterValue, { name: value, operator: "is", value: "" }]);
        } else {
            setFilterValue([...newFilterValue, { name: value, operator: "is", value: "" }]);
        }
        setClickCount(clickCount + 1);
    }
    function handleconditionMenuClick(e) {
        let value = e.domEvent.target.innerHTML;
        console.log(value);
        // toggleFilter(false);
        // setFilter(true);
        // setFilterValue([...newFilterValue, { name: value, operator: "is", value: "" }]);
        // toggleOperators(true);
    }
    const onChange = e => {
        console.log('radio checked', e.target.value);
        setRadioValue(e.target.value);
        setInputValue('');
    };

    const inputChange = e => {
        setInputValue(e.target.value);

    }

    const formQuery = e => {
        console.log(value, inputValue);
        console.log(newFilterValue);
        const addValue = newFilterValue.splice(-1).map((item) => {
            item.operator = value;
            item.value = inputValue;
            return item;
        })
        newFilterValue.push(addValue[0]);
        console.log(newFilterValue);
        // setFilterValue(newFilterValue);
        toggleOperators(false);
        setRadioValue("is");
        setInputValue('');
        showAddButton(true);
    }
    const menuarr = ["name", "email", "plan"];
    const conditionsArr = ["and", "or"];
    {/* {data.map(item => (
                <li key={item.id}>{item.name}</li>
            ))} */}
    let menu = (
        <Menu onClick={handleMenuClick}>
            {
                menuarr.map(item => (
                    <Menu.Item key={item}>
                        {item}
                    </Menu.Item>
                ))}
        </Menu>
    );
    let conditionsMenu = (
        <Menu onClick={handleconditionMenuClick}>
            {
                conditionsArr.map(item => (
                    <Menu.Item key={item}>
                        {item}
                    </Menu.Item>
                ))}
        </Menu>
    );

    const radio = (
        <Radio.Group onChange={onChange} value={value} style={{ marginBottom: 20 }}>
            <Space direction="vertical">
                <Radio value="is" style={{ display: "flex" }}>
                    <div style={{ display: "flex" }}>is</div>
                    {value === "is" ? <label><Input value={inputValue} onChange={(e) => { inputChange(e) }} style={{ width: 192, height: 22 }} /></label> : null}
                </Radio>
                <Radio value="is not" style={{ display: "flex" }}>
                    <div style={{ display: "flex" }}>is not</div>
                    {value === "is not" ? <label><Input value={inputValue} onChange={(e) => { inputChange(e) }} style={{ width: 192, height: 22 }} /></label> : null}
                </Radio>
                <Radio value="starts with" style={{ display: "flex" }}>
                    <div style={{ display: "flex" }}>starts with</div>
                    {value === "starts with" ? <label><Input value={inputValue} onChange={(e) => { inputChange(e) }} style={{ width: 192, height: 22 }} /></label> : null}
                </Radio>
                <Radio value="contains" style={{ display: "flex" }}>
                    <div style={{ display: "flex" }}>contains</div>
                    {value === "contains" ? <label><Input value={inputValue} onChange={(e) => { inputChange(e) }} style={{ width: 192, height: 22 }} /></label> : null}
                </Radio>
            </Space>
        </Radio.Group>
    );


    return (

        <>
            <div className="custContainer">
                <h1>Customers</h1>

                <div className="filters">

                    {initialFilter && (
                        <div align="center" className="filterConditions">
                            <span style={textstyle}>
                                All Customers
                    </span>
                        </div>
                    )}
                    {/* <div>
  {data.map((record) => (
    record.list.length > 0
      ? (<YourRenderComponent record={record} key={record.id} />)
      : null
  ))}
</div> */}

                    {newFilter && (
                        <div align="center" style={style} className="filterWrap">
                            {
                                newFilterValue.length > 0 && newFilterValue.map(item => (
                                    item.separator ?
                                        (<div className="filterConditions" style={{ marginBottom: 20 }}>
                                            <span style={textstyle}>
                                                {item.separator}
                                            </span>
                                        </div>)
                                        :
                                        <div className="filterConditions" style={{ marginBottom: 20 }}>
                                            <span style={textstyle}>
                                                {item.name}
                                            </span>
                                            <span style={textstyle}>
                                                {item.operator}
                                            </span>
                                            <span style={textstyle}>
                                                {item.value}
                                            </span>
                                        </div>

                                ))
                            }
                            {
                                conditionsValue.length > 0 && conditionsValue.map(item => (
                                    <div className="filterConditions" style={{ marginBottom: 20 }}>
                                        <span style={textstyle}>
                                            {item.separator}
                                        </span>
                                    </div>

                                ))
                            }
                            {showConditions && (
                                <Space direction="vertical" className="filterConditions separator" style={{ marginBottom: 20 }}>
                                    <Space wrap >
                                        <Dropdown overlay={conditionsMenu} trigger={['click']}
                                            placement="bottomLeft">
                                            <span style={textstyle}>and</span>
                                        </Dropdown>
                                    </Space>
                                </Space>
                            )}
                            {AddButton && (
                                <Space direction="vertical">
                                    <Space wrap>
                                        <Dropdown overlay={menu} trigger={['click']}
                                            placement="bottomLeft">
                                            <Button type="primary">+</Button>
                                        </Dropdown>
                                    </Space>
                                </Space>
                            )}

                            {showOperatos && (
                                <div className="operators">
                                    <div>
                                        {radio}
                                        <Button onClick={formQuery} type="primary">Done</Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                    {/* {showOperatos && (
                        <div className="operators">
                            <div>
                                {radio}
                                <Button onClick={formQuery} type="primary">Done</Button>
                            </div>
                        </div>
                    )} */}

                </div>

                <div>
                    <Space direction="vertical">
                        <Space wrap>
                            <Dropdown overlay={menu} trigger={['click']}
                                placement="bottomLeft">
                                <Button type="primary">Add Filter Group</Button>
                            </Dropdown>
                        </Space>
                    </Space>
                </div>

                {/* {showOperatos && (
                    <div className="operators">
                        <div>
                            {radio}
                            <Button onClick={formQuery} type="primary">Done</Button>
                        </div>
                    </div>
                )} */}


            </div>
        </>
    )
};

export default Customers;