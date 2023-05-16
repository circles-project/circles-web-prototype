import React, { useRef } from "react";

interface Props {
    page: {
        "session_id": number,
        "terms-accepted" : boolean,
        "username": string,
        "email": string
        "correctCode": boolean
        // TODO: should I be storing the password here?
        "password": string
        "passwordConfirmed": boolean
    }
    pageUpdate: React.Dispatch<React.SetStateAction<{ "session_id": number, "terms-accepted": boolean, "username": string, "email": string, "correctCode": boolean, "password": string, "passwordConfirmed": boolean }>>;
}

const SetPassphrase = ({page, pageUpdate} : Props) => {

    const passwordInput = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        // console.log("Set Password");
        // // TODO: Do I need this line?
        // page["password"] = "some password";
        // pageUpdate({...page, "password":page["password"]});
        // console.log(page);
        if (passwordInput.current !== null) {
            let authBody = {
                "auth": {
                    "type": "m.enroll.email.request_token",
                    "session": page.session_id,
                    "email": passwordInput.current.value
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
    if (page["correctCode"] && page["password"] === "") {
        return (
            <>
                <h1>Set Passphrase</h1>
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

export default SetPassphrase;