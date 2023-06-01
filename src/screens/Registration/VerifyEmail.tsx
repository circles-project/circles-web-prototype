import { useState } from 'react';
import { useRef } from 'react';
import './TopLevelStyles.css';
import { Button } from 'react-bootstrap';
import RegistrationProps from './Interfaces/RegistrationProps';
import './RegistrationConstants.ts'
import { REGISTRATION_URL } from './RegistrationConstants.ts';

interface Props {
    page: RegistrationProps;
    pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
}

const CheckEmailCode = ({page, pageUpdate} : Props) => {

    const emailInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter an email");
    let redText = feedback === "Enter an email" ? "black" : "red" ;

    const handleClick = () => {
        
        if (emailInput.current !== null) {
            let authBody = {
                "auth": {
                    "type": "m.enroll.email.request_token",
                    "session": page.session_id,
                    "email": String(emailInput.current.value)
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
                    console.log(json);
                    page["email"] = true;
                    pageUpdate({...page, "email": true});
                } 
            })
            .catch((error) => {
                console.log("Error: " + error);
                setFeedback("Error: " + error);
            })
            .finally(() => {
                pageUpdate({...page, "loading": false});
            });
        } else {
            console.log("Email is null");
        }
        
    }

    return (
        <>
            {page["username"] && !page["email"] && !page["loading"] && (
                <>
                    <h1 className="registrationTitle">Verify Email</h1>
                    <input className="invisibleInput" ref={emailInput} type="text" placeholder="Email" style={{position: "relative", paddingTop: "10%"}}/>
                    <text className="feedbackText" style={{color: redText}}>{feedback}</text>
                    <Button className="defaultSubmitBtn" onClick={handleClick}>Submit</Button>
                </>
            )}
        </>
    );
}

export default CheckEmailCode;