import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../state/actions';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'antd';
import { Layout } from 'antd';
import { Menu, Dropdown, Button, Space, Radio, Input } from 'antd';
import { Card } from 'antd';
import '../index';


// onClick={() => setType('posts')}
const Customers = () => {

    const style = {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        flexWrap: "wrap",
        marginBottom: 25
    };

    const initialSytle = {
        display: 'flex',
        width: 100,
        backgroundColor: 'grey',
        justifyContent: "center",
        padding: 5
    }

    const textstyle = {
        marginRight: 3
    }

    const state = useSelector((state) => state);
    console.log(state.customers.customers);
    const allProps = state.customers.customers.props || [];
    const custProps = state.customers.customers.custProps || [];
    const customerCount = state.customers.customers.count || 0;
    console.log(allProps);

    const dispatch = useDispatch();

    const { fetchCustomer } = bindActionCreators(actions, dispatch);

    useEffect(() => {
        console.log("use effect on customer called");
        //fetchCustomer({ email: { eq: "ram@gmail.com" } });
        fetchCustomer({});
    }, [])

    const [initialFilter, toggleFilter] = useState(true);
    const [newFilterValue, setFilterValue] = useState([]);
    const [separatorKey, setSeparatorKey] = useState('');
    const [value, setRadioValue] = useState("is");
    const [showOperatos, toggleOperators] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [AddButton, showAddButton] = useState(false);
    const [conditionIndex, setIndex] = useState(0);
    const [OuterConditionIndex, setOuterIndex] = useState(0);
    const [clickCount, setClickCount] = useState(0);

    // console.log(newFilterValue);
    // console.log(separatorKey);
    // console.log(conditionIndex);
    // console.log(OuterConditionIndex);

    function handleMenuClick(e) {

        const value = e.domEvent.target.innerHTML;//c
        toggleFilter(false);
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
        let condition;

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
        //newFilterValue.push(addValue[0]);
        setFilterValue([...addValue]);
        toggleOperators(false);
        setRadioValue("is");
        setInputValue('');
        showAddButton(true);

        //below code to convert obj in correct format


        if (addValue.length == 1) {
            console.log(addValue);
            const filters = addValue[0];
            if (filters.length == 1) {
                const result = filters.map((item) => {
                    const obj = {};
                    let innerObj = {};
                    let operator;
                    if (item.operator == "is") {
                        operator = "eq"
                    } else {
                        operator = item.operator;
                    }
                    innerObj[operator] = item.value;
                    const name = custProps.indexOf(item.name) === -1 ? item.name : "customizedProps." + item.name;
                    console.log(name);
                    obj[name] = innerObj;
                    return obj;
                });
                //{"email" : { "eq" : "ram@gmail.com"}}*/
                console.log(result[0]);
                condition = result[0];
                fetchCustomer(condition);
            } else {
                console.log("separator exist");
            }

        } else {
            console.log("joiner is there!!!");
        }


    }
    const conditionsArr = ["and", "or"];
    let menu = (
        <Menu onClick={handleMenuClick}>
            {
                allProps.map(item => (
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
                <div className="filters">

                    {initialFilter && (
                        <div className="filterConditions allCustomers">
                            <span className="filterValue">
                                <span>
                                    All Customers
                                </span>
                            </span>
                        </div>
                    )}

                    {!initialFilter && newFilterValue.length > 0 && newFilterValue.map((item, index, arr) => (

                        < div align="center" style={style} className="filterWrap" data={index}>
                            {
                                item.length > 0 && item.map((item, index, arr) => (
                                    (item.separator) ?
                                        (

                                            <Dropdown overlay={conditionsMenu} trigger={['click']}
                                                placement="bottomLeft">
                                                <div className={`filterConditions `}>
                                                    <span data={index} name="separator" className="separator" onClick={separatorClick}
                                                    >{item.separator}</span>
                                                </div>
                                            </Dropdown>

                                        )
                                        :
                                        (item.joiner) ?
                                            (

                                                <Dropdown overlay={conditionsMenu} trigger={['click']}
                                                    placement="bottomLeft">
                                                    <div className={`filterConditions `}>
                                                        <span data={index} name="joiner" className="separator" onClick={separatorClick}>{item.joiner}</span>
                                                    </div>
                                                </Dropdown>
                                            )
                                            :
                                            <div className="filterConditions">
                                                <span className="filterValue">
                                                    <span style={textstyle}>
                                                        {item.name}
                                                    </span>
                                                    <span style={textstyle}>
                                                        {item.operator}
                                                    </span>
                                                    <span style={textstyle}>
                                                        {item.value}
                                                    </span>
                                                </span>
                                            </div>

                                ))
                            }

                            {(AddButton && !item[0].joiner) && (
                                <Dropdown overlay={menu} trigger={['click']}
                                    placement="bottomLeft">
                                    <Button type="primary" data={index} onClick={addBtnClick}>+</Button>
                                </Dropdown>
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

                <div style={{ marginBottom: 15 }}>
                    <Dropdown overlay={menu} trigger={['click']}
                        placement="bottomLeft">
                        <Button style={{ borderRadius: 4 }} type="primary" onClick={filterBtnClick}>+ Add Filter Group</Button>
                    </Dropdown>
                </div>

                <div className="showCount">
                    Survey will be shown to {customerCount} customer
                </div>

            </div>
            {/* custcontainers */}
        </>
    )
};

export default Customers;