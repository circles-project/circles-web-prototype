import React, { useRef, useState } from "react";
import RegistrationProps from "../Interfaces/RegistrationProps.tsx";
import { Button } from "react-bootstrap";
import styles from "../commonStyles.module.css";
import passStyles from "./SetPassphrase.module.css";
import PasswordStrengthBar from "react-password-strength-bar";
import RegistrationParams from "../Interfaces/RegistrationParams.ts";
import Client from "../bsspeke/BSSpekeWrapper.js";
import { DOMAIN } from '../RegistrationConstants.ts'
import RegistrationResponse from "../Interfaces/RegistrationResponse.js";
import { oprfRequest } from "../bsspeke/apiClient.ts";

interface Props {
    page: RegistrationProps;
    pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
    setPasswordParams: RegistrationParams["m.enroll.bsspeke-ecc.oprf"];
    setRegistrationResponse: React.Dispatch<React.SetStateAction<RegistrationResponse | null>>;
}

const SetPassphrase = ({ page, pageUpdate, setPasswordParams, setRegistrationResponse }: Props) => {

    const [passwordInput, setPasswordInput] = useState<string>("");
    const confirmPasswordInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter a password");
    let redText = feedback === "Enter a password" ? "black" : "red";

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

            const user_id = "@" + page["username"] + ":" + DOMAIN;
            const client = new Client(user_id, DOMAIN, passwordInput);
            
            // Bsspeke .oprf request also calls .save
            oprfRequest(client, setPasswordParams, page, pageUpdate, setFeedback, setRegistrationResponse);

            pageUpdate({ ...page, "loading": true });
            

        } else {
            console.log("Password is null");
            setFeedback("Password is empty");
        }
    }

    return (
        <>
            {page["correctCode"] && !page["password"] && !page["loading"] && (
                <>
                    <h1 className={styles.registrationTitle}>Set Passphrase</h1>
                    <input className={styles.invisibleInput} style={{ top: "20%" }} type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Password" />
                    <PasswordStrengthBar className={passStyles.passwordBar} style={{ position: "absolute" }} password={passwordInput} />
                    <input className={styles.invisibleInput} style={{ top: "35%" }} type="password" ref={confirmPasswordInput} placeholder="Confirm Password" />
                    <text className={styles.feedbackText} style={{ top: "150%", textAlign: "center", color: redText }} >{feedback}</text>
                    <Button className={styles.defaultSubmitBtn} onClick={handleClick}>Submit</Button>
                </>
            )}

        </>
    );
}

export default SetPassphrase;
