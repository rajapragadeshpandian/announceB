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
        flexWrap: "wrap",
        marginBottom: 80
        //backgroundColor: '#FF6D00'
    };

    const initialSytle = {
        display: 'flex',
        width: 100,
        backgroundColor: 'grey',
        justifyContent: "center",
        padding: 5
    }

    const textstyle = {
        marginRight: 3,
        marginBottom: 5,
        height: 32,
        borderradius: 4
    }
    const separatorStyle = {
        height: 32,
        width: 32,
        borderradius: 4
    }
    const [initialFilter, toggleFilter] = useState(true);
    const [newFilter, setFilter] = useState(false);
    const [newFilterValue, setFilterValue] = useState([]);
    const [separatorKey, setSeparatorKey] = useState('');
    const [value, setRadioValue] = useState("is");
    const [showOperatos, toggleOperators] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [AddButton, showAddButton] = useState(false);
    const [showConditions, setConditions] = useState(false);
    const [conditionIndex, setIndex] = useState(0);
    const [OuterConditionIndex, setOuterIndex] = useState(0);
    const [clickCount, setClickCount] = useState(0);

    console.log(newFilterValue);
    console.log(separatorKey);
    console.log(conditionIndex);
    console.log(OuterConditionIndex);

    function handleMenuClick(e) {

        const value = e.domEvent.target.innerHTML;//c
        toggleFilter(false);
        //setFilter(true);
        //setFilterValue([...newFilterValue, { name: value, operator: "is", value: "" }]);
        toggleOperators(true);
        if (clickCount > 0) {
            if (separatorKey == "separator") {
                let obj = {};
                console.log(separatorKey);
                obj[separatorKey] = "and";
                //let index = newFilterValue.length - 1;
                console.log(newFilterValue);
                newFilterValue[OuterConditionIndex].push(obj);
                console.log(newFilterValue);
                newFilterValue[OuterConditionIndex].push({ name: value, operator: "is", value: "" });
                setFilterValue([...newFilterValue]);
            } else {
                let obj = {};
                console.log(separatorKey);
                obj[separatorKey] = "and";
                newFilterValue.push([obj]);
                setFilterValue([...newFilterValue, [{ name: value, operator: "is", value: "" }]]);
                console.log(newFilterValue.length);
                setOuterIndex(newFilterValue.length);
            }

            //setFilterValue([...newFilterValue, { name: value, operator: "is", value: "" }]);
        } else {
            setFilterValue([...newFilterValue, [{ name: value, operator: "is", value: "" }]]);
        }
        setClickCount(clickCount + 1);
    }
    function handleconditionMenuClick(e) {
        let value = e.domEvent.target.innerHTML;
        console.log(value);
        console.log(conditionIndex);
        console.log(OuterConditionIndex);

        newFilterValue.map((item, index) => {

            if (index == OuterConditionIndex) {
                item.map((item, index) => {
                    const key = Object.keys(item);
                    if (index == conditionIndex) {
                        item[key[0]] = value;
                    }
                    return item;
                })
            }

            return item;
        });
        console.log(newFilterValue);
        setFilterValue([...newFilterValue]);
        //console.log(document.getElementsByClassName('filterWrap'));
        //const child = Array.prototype.slice.call(document.getElementsByClassName('filterWrap')[0].children);
        // toggleFilter(false);
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
    const separatorClick = e => {

        console.log(e.target.getAttribute('name'));
        console.log(e.target.parentNode.parentNode);
        let index;
        let parentNode = e.target.parentNode.parentNode;
        const outerIndex = parentNode.getAttribute('data');
        if (e.target.getAttribute('name') == "separator") {
            index = e.target.getAttribute('data');
        } else {
            index = 0;
        }

        setOuterIndex(outerIndex);
        setIndex(index);
    }
    const addBtnClick = e => {

        console.log(e.target.parentNode.getAttribute('data'));
        let addBtnIndex = e.target.parentNode.getAttribute('data')
        setOuterIndex(addBtnIndex);
        setSeparatorKey("separator");
    }
    const filterBtnClick = e => {
        console.log(clickCount);
        if (clickCount > 0) {
            setSeparatorKey("joiner");
        } else {
            setSeparatorKey('');
        }

    }

    const formQuery = e => {
        console.log(value, inputValue);
        console.log(newFilterValue);

        const addValue = newFilterValue.map((item, index) => {
            console.log(index);
            console.log(newFilterValue.length);
            console.log(item);
            if (newFilterValue.length - 1 == index) {
                const newItem = item.splice(-1).map((item) => {
                    item.operator = value;
                    item.value = inputValue;
                    return item;
                });
                item.push(newItem[0]);
            }
            return item;
        })
        console.log(addValue);
        //newFilterValue.push(addValue[0]);
        setFilterValue([...addValue]);
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
                        <span style={initialSytle}>
                            All Customers
                        </span>
                    )}

                    {!initialFilter && newFilterValue.length > 0 && newFilterValue.map((item, index, arr) => (

                        < div align="center" style={style} className="filterWrap" data={index}>
                            {
                                item.length > 0 && item.map((item, index, arr) => (
                                    (item.separator) ?
                                        (
                                            <div className={`filterConditions `}>
                                                <Dropdown overlay={conditionsMenu} trigger={['click']}
                                                    placement="bottomLeft">
                                                    <span data={index} name="separator" onClick={separatorClick} style={separatorStyle}>{item.separator}</span>
                                                </Dropdown>
                                            </div>

                                        )
                                        :
                                        (item.joiner) ?
                                            (
                                                <div className={`filterConditions `}>
                                                    <Dropdown overlay={conditionsMenu} trigger={['click']}
                                                        placement="bottomLeft">
                                                        <span data={index} name="joiner" onClick={separatorClick} style={separatorStyle}>{item.joiner}</span>
                                                    </Dropdown>
                                                </div>

                                            )
                                            :
                                            <div className="filterConditions">
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

                            {(AddButton && !item[0].joiner) && (
                                // <Space direction="vertical">
                                //     <Space wrap>
                                <Dropdown overlay={menu} trigger={['click']}
                                    placement="bottomLeft">
                                    <Button type="primary" data={index} onClick={addBtnClick}>+</Button>
                                </Dropdown>
                                //     </Space>
                                // </Space>
                            )}

                            {(showOperatos && !item[0].joiner && (OuterConditionIndex == index)) && (
                                <div className="operators">
                                    <div>
                                        {radio}
                                        <Button onClick={formQuery} type="primary">Done</Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))
                    }
                    {/* filterWrap */}


                </div>
                {/* filters */}

                <div>
                    {/* <Space direction="vertical">
                        <Space wrap> */}
                    <Dropdown overlay={menu} trigger={['click']}
                        placement="bottomLeft">
                        <Button type="primary" onClick={filterBtnClick}>Add Filter Group</Button>
                    </Dropdown>
                    {/* </Space>
                    </Space> */}
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
            {/* custcontainers */}
        </>
    )
};

export default Customers;