import React from 'react';
import Accordian from './component/Accordion';
import './css/createChange.css';


function CreateChange() {
    return (

        <>
            <div className="changelog_container">

                <div className="createChange_header">
                    <p style={{ color: "grey" }}>Enter a title</p>
                    <div style={{ display: "flex" }}>
                        <button className="createBtn">
                            <span>Save and close</span>
                        </button>
                        <button className="publishBtn">
                            <span>publish</span>
                        </button>
                    </div>
                </div>

                <div className="changelog_main">
                    <div className="createChange_Wrapper">
                        <Accordian
                            title="Content"
                            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                        <Accordian
                            title="where to show ?"
                            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                        <Accordian
                            title="whom to show ?"
                            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateChange;