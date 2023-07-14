import { useState } from 'react';
import { useRef } from 'react';
import styles from './commonStyles.module.css';
import { Button } from 'react-bootstrap';
import './RegistrationConstants.ts'
import { REGISTRATION_URL } from './RegistrationConstants.ts';
import useAuthStore from '../../state-management/auth/store.ts';

const ChooseUser = () => {
  const { stages, setLoading, setUsername } = useAuthStore();
  const username = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("Enter a Username");
  let redText = feedback === "Enter a Username" ? "black" : "red";

  const handleClick = () => {
    if (username.current !== null) {
      let authBody = {
        "auth": {
          "type": "m.enroll.username",
          "session": stages.sessionId,
          "username": username.current.value
        }
      }
      setLoading(true);
      setUsername(username.current.value);
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
          if (json.error) {
            console.log("Error: " + json.error);
            setUsername("");
            setFeedback("Error: " + json.error);
          }
          console.log(json);
        })
        .catch((error) => {
          console.log("Error: " + error);
          setUsername("");
          setFeedback("Error: " + error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("Username is null");
    }
  }

  return (
    <>
      {stages.termsAccepted && !stages.username && !stages.loading && (
        <>
          <h1 className={styles.registrationTitle}>Choose a Username</h1>
          <input className={styles.invisibleInput} ref={username} type="text" placeholder="Username" />
          <text className={styles.feedbackText} style={{ color: redText }}>{feedback}</text>
          <Button variant="primary" className={styles.defaultSubmitBtn} onClick={handleClick}>Submit</Button>
        </>
      )}
    </>
  );
}

export default ChooseUser;
