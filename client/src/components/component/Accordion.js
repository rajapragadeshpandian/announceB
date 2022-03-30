import { useRef, useState } from "react";
import "../css/accordion.css";
import { Chevron } from "../svg/icons";

export default function Accordian(props) {
    const [display, setDisplay] = useState("");
    const [setActive, setActiveState] = useState("");
    const inputRef = useRef(null);

    function toggleAccordian() {
        console.log("accordian");
        setActiveState(setActive === "" ? "active" : "");
        console.log(setActive);
        // setDisplay(
        //     setActive === ""
        //         ? inputRef.current.classList.add("show")
        //         : inputRef.current.classList.remove("show")
        // );

        setDisplay(
            setActive === ""
                ? "show"
                : ""
        );

        console.log(display);
    }

    return (
        <div className="accordion_section">



            <div className={`accordion ${setActive}`} onClick={toggleAccordian}>
                <span className="accordion_title">{props.title}</span>
                <span style={{ position: "relative", bottom: "3px" }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xlink="http://www.w3.org/1999/xlink"
                        version="1.1" id="Capa_1" x="0px" y="0px"
                        viewBox="0 0 490 490"
                        space="preserve"
                        width="20"
                        height="20">
                        <polygon points="96.536,490 403.019,244.996 96.536,0 86.981,11.962 378.496,244.996 86.981,478.038 " />

                    </svg>
                </span>


            </div>

            <div ref={inputRef} className={`accordion_content ${display}`}>
                <div
                    className="accordion_text"
                    dangerouslySetInnerHTML={{ __html: props.content }}
                ></div>
            </div>
        </div >
    );
}
