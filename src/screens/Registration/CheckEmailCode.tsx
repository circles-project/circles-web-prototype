import React, { useRef } from "react";
import './TopLevelStyles.css';
import { Button } from "react-bootstrap";
import RegistrationProps from "./Interfaces/RegistrationProps";
import { useState } from "react";
import { REGISTRATION_URL } from "./RegistrationConstants";

interface Props {
    page: RegistrationProps;
    pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
}

const CheckCode = ({page, pageUpdate} : Props) => {

    const codeInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter the code");
    let redText = feedback === "Enter the code" ? "black" : "red" ;

    const handleClick = () => {

        if (codeInput.current !== null) {
            let authBody = {
                "auth": {
                    "session": page.session_id,
                    "type": "m.enroll.email.submit_token",
                    "token": codeInput.current.value
                }
            }
            pageUpdate({...page, "loading": true});
            fetch(REGISTRATION_URL, {
                method: "POST",
                body: JSON.stringify(authBody),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
            }})
            .then((response) => response.json())
            .then(json => {
                console.log(json);
                if (json.error) {
                    console.log("Error: " + json.error);
                    setFeedback("Error: " + json.error);
                } else {
                    page["correctCode"] = true;
                    pageUpdate({...page, "correctCode": true});
                }
            })
            .catch((error) => {
                console.log("Error: " + error);
                setFeedback("Error: " + error);
            })
            .finally(() => {
                pageUpdate({...page, "loading": false});
                console.log("Code request sent");
            });
        } else {
            console.log("Code is null");
            setFeedback("Please enter a code");
        }
    }
    return (
        <>
            {page["email"] && !page["correctCode"] && !page["loading"] && (
                <>
                    <h2 className="registrationTitle">Enter the 6 digit code you received in your email</h2>
                    <input className="invisibleInput" ref={codeInput} type="number" placeholder="6 digit code" style={{position: "relative", paddingTop: "10%"}}/>
                    <text className="feedbackText" style={{color: redText}}>{feedback}</text>
                    <Button className="defaultSubmitBtn" onClick={handleClick}>Submit</Button>
                </>
            )}
        </>    
    );
}

export default CheckCode;