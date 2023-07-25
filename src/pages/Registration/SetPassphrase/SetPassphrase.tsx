import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "../commonStyles.module.css";
import passStyles from "./SetPassphrase.module.css";
import PasswordStrengthBar from "react-password-strength-bar";
import Client from "../bsspeke/BSSpekeWrapper.js";
import { DOMAIN } from '../RegistrationConstants.ts';
import { oprfRequest } from "../bsspeke/apiClient.ts";
import useAuthStore from "../../../state-management/auth/store.ts";

// Set passphrase page
const SetPassphrase = () => {
    const { authStages, registrationParams, setLoading, setPassword, setRegistrationResponse} = useAuthStore();

    const [passwordInput, setPasswordInput] = useState<string>("");
    const confirmPasswordInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter a password");
    let redText = feedback === "Enter a password" ? "black" : "red";

    const handleClick = () => {

        if (passwordInput !== "") {
            const confirmPasswordValue = confirmPasswordInput.current?.value;
            console.log(confirmPasswordValue);
            if (passwordInput !== confirmPasswordValue) {
                console.log("Passwords don't match");
                setFeedback("Passwords don't match");
                return;
            }

            const user_id = "@" + authStages.username + ":" + DOMAIN;
            const client = new Client(user_id, DOMAIN, passwordInput);
            
            oprfRequest(client,registrationParams["m.enroll.bsspeke-ecc.oprf"], authStages, setLoading, setPassword, setFeedback, setRegistrationResponse);
            setLoading(true);
        } else {
            console.log("Password is null");
            setFeedback("Password is empty");
        }
    }

    return (
        <>
            {authStages.correctCode && !authStages.password && !authStages.loading && (
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
