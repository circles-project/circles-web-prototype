import { useState } from 'react';
import { useRef } from 'react';

interface Props {
    page: {
        "session_id": number,
        "terms-accepted" : boolean,
        "username": string,
        "email": string,
        // TODO: Should this be a number or is a simple check for truthiness sufficient?
        "correctCode": boolean
        "password": string
        "passwordConfirmed": boolean
    }
    pageUpdate: React.Dispatch<React.SetStateAction<{"session_id": number, "terms-accepted": boolean, "username": string, "email": string, "correctCode": boolean, "password": string, "passwordConfirmed": boolean}>>;
}

const CheckEmailCode = ({page, pageUpdate} : Props) => {

    // const handleClick = () => {
    //     console.log("Email Chosen");
    //     // TODO: Do I need this line?
    //     page["email"] = "some email";
    //     pageUpdate({...page, "email":"some email"});
    //     console.log(page);
    // }
    const emailInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        
        if (emailInput.current !== null) {
            let authBody = {
                "auth": {
                    "type": "m.enroll.email.request_token",
                    "session": page.session_id,
                    "email": String(emailInput.current.value)
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
                    console.log("Email invalid: " + json.error);
                } else if (emailInput.current !== null) {
                    console.log(json);
                    page["email"] = emailInput.current.value;
                    pageUpdate({...page, "email": emailInput.current.value});
                    console.log("Email Chosen: " + page.email);
                } else {
                    console.log("Email is null");
                }
            });
        } else {
            console.log("Email is null");
        }
        
    }
    if (page["terms-accepted"] && page["username"] !== "" && page["email"] === "") {
        return (
            <>
                <h1>Verify Email</h1>
                <input ref={emailInput} type="text" placeholder="Email" />
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

export default CheckEmailCode;