import { useState } from 'react';
import { useRef } from 'react';
import styles from './commonStyles.module.css';
import { Button } from 'react-bootstrap';
import './RegistrationConstants.ts'
import { REGISTRATION_URL } from './RegistrationConstants.ts';
import useAuthStore from '../../state-management/auth/store.ts';
import Form from 'react-bootstrap/Form';

// Email submit page
const CheckEmailCode = () => {
    const { authStages, setLoading, setEmail } = useAuthStore();
    const emailInput = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Enter an email");
    let redText = feedback === "Enter an email" ? "black" : "red";

    // Submit email logic (sends request to server for email verification code)
    const handleClick = () => {
        // no op since disabled email verification
        setEmail(true);
        return;

        if (emailInput.current !== null) {
            let authBody = {
                "auth": {
                    "type": "m.enroll.email.request_token",
                    "session": authStages.sessionId,
                    "email": String(emailInput.current.value)
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
                        setEmail(true);
                    }
                })
                .catch((error) => {
                    console.log("Error: " + error);
                    setFeedback("Error: " + error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            console.log("Email is null");
        }

    }

    return (
        <>
            {authStages.username !== "" && !authStages.email && !authStages.loading && (
                <>
                    <h1 className={styles.registrationTitle}>Verify Email</h1>
                    <input className={styles.invisibleInput} ref={emailInput} type="text" placeholder="Email" />
                    <Form.Text className={styles.feedbackText} style={{ color: redText }}>{feedback}</Form.Text>
                    <Button className={styles.defaultSubmitBtn} onClick={handleClick}>Submit</Button>
                </>
            )}
        </>
    );
}

export default CheckEmailCode;