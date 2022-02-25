import React, { Component } from 'react';
import { navItems } from "./data/menuItem";
import "./css/navbar.css";
import "./css/dropdown.css";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

export class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdown: false,
            title: ""
        }
        this.change = this.change.bind(this);
    }
    change(e) {
        console.log("djaksdhasjk");
        console.log(e.target.getAttribute('data'));

        this.setState({
            dropdown: true,
            title: e.target.getAttribute('data')
        })
    }
    render() {
        console.log(navItems);
        return (
            <>
                <nav className="navbar">
                    <ul className="nav-items">
                        {
                            navItems.map((item) => {
                                if (item.title === this.state.title) {
                                    return (
                                        <li
                                            key={item.id}
                                            className={item.cName}
                                            onClick={() => this.setState({ dropdown: !this.state.dropdown, title: "" })}

                                        >
                                            {item.title}
                                            {this.state.dropdown && <Dropdown />}
                                        </li>
                                    )
                                }
                                return (
                                    <li key={item.id} data={item.title} className={item.cName} onClick={(e) => this.change(e)}>
                                        {item.title}
                                    </li>
                                )

                            })
                        }
                    </ul>
                </nav>
            </>
        )
    }
}

export default Navbar
