import React, { useRef, useState} from "react";
import RegistrationProps from "./Interfaces/RegistrationProps";
import { Button } from "react-bootstrap";
import "./TopLevelStyles.css";
import PasswordStrengthBar from "react-password-strength-bar";
import RegistrationParams from "./Interfaces/RegistrationParams";
import Client from "./bsspeke/BSSpekeWrapper.js";
import { DOMAIN, REGISTRATION_URL} from './RegistrationConstants.ts'

interface Props {
    page: RegistrationProps;
    pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
    setPasswordParams: RegistrationParams["m.enroll.bsspeke-ecc.oprf"];
    setRegistering: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetPassphrase = ({page, pageUpdate, setPasswordParams, setRegistering} : Props) => {

    const [passwordInput, setPasswordInput] = useState<string>("");
    const confirmPasswordInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter a password");
    let redText = feedback === "Enter a password" ? "black" : "red" ; 

    const handleClick = () => {  
        
        console.log(confirmPasswordInput.current);
        if (passwordInput !== "") {
            const confirmPasswordValue = confirmPasswordInput.current?.value;
            console.log(confirmPasswordValue);
            if (passwordInput !== confirmPasswordValue) {
                console.log("Passwords don't match");
                setFeedback("Passwords don't match");
                return;
            }

            const user_id = page["username"] + "@" + DOMAIN;
            const client = new Client(user_id, DOMAIN, passwordInput);
            const blind = client.generateBlind();
            const blind_base64 = btoa(String.fromCharCode.apply(null, Array.from(blind))); 

            // Bsspeke .oprf request
            let authBody = {
                "auth": {
                    "type": "m.enroll.bsspeke-ecc.oprf",
                    "session": page.session_id,
                    "curve": setPasswordParams.curve,
                    "blind": blind_base64,
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

                if (json.error) {
                    console.log("Error: " + json.error);
                    setFeedback("Error: " + json.error);
                } else {
                    let blind_salt = new Uint8Array(32);
                    console.log(json);
                    const decodedSalt = atob(json.params["m.enroll.bsspeke-ecc.save"].blind_salt);
                    for (let i = 0; i < decodedSalt.length; i++) {
                        blind_salt[i] = decodedSalt.charCodeAt(i);
                    }
                    console.log("blind_salt: ", blind_salt);
                    page["password"] = true;
                    pageUpdate({...page, "password": true, "loading": false});
                    const { PArray, VArray } = client.generatePAndV(blind_salt, setPasswordParams["phf_params"]);

                    // Bsspeke .save request
                    let authBody2 = {
                        "auth": {
                            "type": "m.enroll.bsspeke-ecc.save",
                            "session": page.session_id,
                            "P": btoa(String.fromCharCode.apply(null, Array.from(PArray))),
                            "V": btoa(String.fromCharCode.apply(null, Array.from(VArray))),
                            "phf_params": setPasswordParams.phf_params,
                        }
                    }
                    pageUpdate({...page, "loading": true});
                    fetch(REGISTRATION_URL, {
                        method: "POST",
                        body: JSON.stringify(authBody2),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                    }})
                    .then((response) => response.json())
                    .then(json => {

                        if (json.error) {
                            console.log("Error: " + json.error);
                            setFeedback("Error: " + json.error);
                        } else {
                            console.log(json);
                            page["password"] = true;
                            pageUpdate({...page, "password": true, "loading": false});
                            setRegistering(false);
                        }
                    })
                    .catch((error) => {
                        console.log("Error: ", error);
                        setFeedback("Error: " + error);
                        pageUpdate({...page, "loading": false});
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                setFeedback("Error: " + error);
                pageUpdate({...page, "loading": false});
            });

        } else {
            console.log("Password is null");
            setFeedback("Password is empty");
        }
    }

    return (
        <>
            {page["correctCode"] && !page["password"] && !page["loading"] && (
                <>
                    <h1 className="registrationTitle">Set Passphrase</h1>
                    <input className="invisibleInput" style={{position: "relative",marginTop: "10%", height: "42%"}} type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Password" />
                    <PasswordStrengthBar password={passwordInput} />
                    <input className="invisibleInput" style={{position: 'relative', height: "42%"}} type="password" ref={confirmPasswordInput} placeholder="Confirm Password" />
                    <text className="feedbackText" style={{color: redText}}>{feedback}</text>
                    <Button className="defaultSubmitBtn" onClick={handleClick}>Submit</Button>
                </>
            )}
            
        </>
    );
}

export default SetPassphrase;