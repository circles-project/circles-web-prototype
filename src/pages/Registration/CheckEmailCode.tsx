import { useRef } from "react";
import styles from './commonStyles.module.css';
import { Button } from "react-bootstrap";
import { useState } from "react";
import { REGISTRATION_URL } from "./RegistrationConstants";
import useAuthStore from "../../state-management/auth/store";

// Email code verification page
const CheckCode = () => {
    const { authStages, setLoading, setCorrectCode } = useAuthStore();
    const codeInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter the code");
    let redText = feedback === "Enter the code" ? "black" : "red";

    // Submit code logic (sends email verificatio code to server)
    const handleClick = () => {

        if (codeInput.current !== null) {
            let authBody = {
                "auth": {
                    "session": authStages.sessionId,
                    "type": "m.enroll.email.submit_token",
                    "token": codeInput.current.value
                }
            }
            setLoading(true);
            fetch(REGISTRATION_URL, {
                method: "POST",
                body: JSON.stringify(authBody),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .then((response) => response.json())
                .then(json => {
                    console.log(json);
                    if (json.error) {
                        console.log("Error: " + json.error);
                        setFeedback("Error: " + json.error);
                    } else {
                        setCorrectCode(true);
                    }
                })
                .catch((error) => {
                    console.log("Error: " + error);
                    setFeedback("Error: " + error);
                })
                .finally(() => {
                    setLoading(false);
                    console.log("Code request sent");
                });
        } else {
            console.log("Code is null");
            setFeedback("Please enter a code");
        }
    }
    return (
        <>
            {authStages.email && !authStages.correctCode && !authStages.loading && (
                <>
                    <h2 className={styles.registrationTitle}>Enter the 6 digit code you received in your email</h2>
                    <input className={styles.invisibleInput} ref={codeInput} type="number" placeholder="6 digit code" />
                    <text className={styles.feedbackText} style={{ color: redText }}>{feedback}</text>
                    <Button className={styles.defaultSubmitBtn} onClick={handleClick}>Submit</Button>
                </>
            )}
        </>
    );
}

export default CheckCode;