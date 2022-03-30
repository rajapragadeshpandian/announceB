import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../state/actions';
import { bindActionCreators } from 'redux';
import { useTable } from 'react-table';
import { columns, data } from './data/column';
import './css/changelog.css';
import { Table } from 'antd';
import { Pagination } from 'antd';
import CreateChange from './CreateChange'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';




const ChangeLogs = () => {

    // const columns = useMemo(() => COLUMNS, [])
    //const data = useMemo(() => , [])
    const [selectedRowKeys, setSelectedRows] = useState([]);
    const [searchText, setSearchText] = useState(null);
    const state = useSelector((state) => state.changeLogs);

    const changeLogs = state && state.changes && state.changes.changeList;
    const length = changeLogs && changeLogs.length ? changeLogs.length : 0;
    const count = state && state.changes && state.changes.count;
    let url = '/changelog';
    const dispatch = useDispatch();

    const { fetchChanges } = bindActionCreators(actions, dispatch);

    console.log(state);
    console.log(changeLogs);
    console.log(columns, data);


    const tick = () => {
        console.log("ticking");
    }
    useEffect(() => {

        fetchChanges(url)
        // setInterval(tick, 5000);
    }, [])

    const onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRows([...selectedRowKeys]);
    };

    const onpageChange = (pageNumber) => {
        console.log("page change", pageNumber);
        //url + `?pageNo=${pageNumber}`
        //console.log(url);
        fetchChanges(url + `?pageNo=${pageNumber}`);
    }

    const searchChange = (e) => {
        console.log(e.target.value);
        setSearchText(e.target.value);
        const value = e.target.value;
        fetchChanges(url + `?text=${value}`);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    return (
        <>
            {/* <BrowserRouter>
                <Routes>
                    <Route path='/create/change'
                        element={<CreateChange />} exact />
                </Routes>
            </BrowserRouter> */}
            <div className="sideBar">
                <li> changeLog</li>
                <li> customer</li>
                <li> Home</li>
            </div>

            <div className="changelog_container">
                {/* <span><a href="/auth/logout">Logout</a></span> */}
                {/* {
                (state && state.changes) && (
                    <div>
                        <li>{state.changes.count}</li>
                    </div>

                )
            } */}
                <div className="changelog_header">
                    <p>Changelogs</p>
                    <button className="createBtn">
                        <Link to="/create/change">New Changelog</Link>
                    </button>
                </div>

                <div className="changelog_main">
                    <div className="changelog_body">
                        <div className="change_search">
                            <p>Showing {length} of {count} Changes</p>
                            <input type="text"
                                placeholder="Search Change"
                                onChange={(e) => searchChange(e)}
                                value={searchText}
                                className="search" />
                        </div>

                        <div className="change_table">
                            <Table
                                columns={columns}
                                dataSource={changeLogs}
                                pagination={false}
                                rowSelection={rowSelection}
                            />
                        </div>

                        <div className="change_pagination">
                            <Pagination
                                defaultCurrent={1}
                                total={50}
                                onChange={onpageChange}
                            />
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
};

export default ChangeLogs;