import { useState } from 'react';
import { useRef } from 'react';
import RegistrationProps from './Interfaces/RegistrationProps';
import styles from './commonStyles.module.css';
import { Button } from 'react-bootstrap';
import './RegistrationConstants.ts'
import { REGISTRATION_URL } from './RegistrationConstants.ts';

interface Props {
  page: RegistrationProps;
  pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
}

const ChooseUser = ({ page, pageUpdate }: Props) => {
  const username = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("Enter a Username");
  let redText = feedback === "Enter a Username" ? "black" : "red";

  const handleClick = () => {
    if (username.current !== null) {
      let authBody = {
        "auth": {
          "type": "m.enroll.username",
          "session": page.session_id,
          "username": username.current.value
        }
      }
      pageUpdate({ ...page, "loading": true });
      page["username"] = username.current.value;
      pageUpdate({ ...page, "username": username.current.value });
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
            page["username"] = "";
            pageUpdate({ ...page, "username": "" });
            setFeedback("Error: " + json.error);
          }
          console.log(json);
        })
        .catch((error) => {
          console.log("Error: " + error);
          page["username"] = "";
          pageUpdate({ ...page, "username": "" });
          setFeedback("Error: " + error);
        })
        .finally(() => {
          pageUpdate({ ...page, "loading": false });
        });
    } else {
      console.log("Username is null");
    }
  }

  return (
    <>
      {page["terms-accepted"] && !page["username"] && !page["loading"] && (
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
