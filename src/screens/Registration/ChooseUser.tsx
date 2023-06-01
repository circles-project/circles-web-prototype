import { useState } from 'react';
import { useRef } from 'react';
import RegistrationProps from './Interfaces/RegistrationProps';
import './TopLevelStyles.css';
import { Button } from 'react-bootstrap';
import './RegistrationConstants.ts'
import { REGISTRATION_URL } from './RegistrationConstants.ts';

interface Props {
  page: RegistrationProps;
  pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
}

const ChooseUser = ({ page, pageUpdate}: Props) => {
  const username = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<string>("Enter a Username");
  let redText = feedback === "Enter a Username" ? "black" : "red" ;

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
          setFeedback("Error: " + json.error);
        }
      })
      .catch((error) => {
        console.log("Error: " + error);
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
          <h1 className="registrationTitle">Choose a Username</h1>
          <input className="invisibleInput" ref={username} type="text" placeholder="Username" style={{position: "relative", paddingTop: "10%"}} />
          <text className="feedbackText" style={{color: redText}}>{feedback}</text>
          <Button className={"defaultSubmitBtn"} onClick={handleClick}>Submit</Button>
        </>
      )}
    </>
  );
}

export default ChooseUser;
