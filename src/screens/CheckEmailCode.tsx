import React, { useRef } from "react";

interface Props {
    page: {
        "session_id": number,
        "terms-accepted" : boolean,
        "username": string,
        "email": string
        "correctCode": boolean
        "password": string
        "passwordConfirmed": boolean
    }
    pageUpdate: React.Dispatch<React.SetStateAction<{"session_id": number, "terms-accepted": boolean, "username": string, "email": string, "correctCode": boolean, "password": string, "passwordConfirmed": boolean}>>;
}

const CheckCode = ({page, pageUpdate} : Props) => {

    const codeInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {

        if (codeInput.current !== null) {
            let authBody = {
                "auth": {
                    "session": page.session_id,
                    "type": "m.enroll.email.submit_token",
                    "token": codeInput.current.value
                }
            }
            fetch("https://matrix.varun.circles-dev.net/_matrix/client/v3/register", {
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
                    console.log("Code invalid or wrong: " + json.error);
                } else if (codeInput.current !== null) {
                    page["correctCode"] = true;
                    pageUpdate({...page, "correctCode": true});
                    console.log("Code Entered: " + codeInput.current.value);
                } else {
                    console.log("Code is null");
                }
            });
        } else {
            console.log("Code is null");
        }
    }
    if (page["email"] !== "" && !page["correctCode"]) {
        return (
            <>
                <h2>Enter the 6 digit code you received in your email</h2>
                <input ref={codeInput} type="number" placeholder="6 digit code" />
                <button onClick={handleClick}>Submit</button>
            </>
        );
    } else {
        return (
            <>
            </>
        );
    }
}

export default CheckCode;