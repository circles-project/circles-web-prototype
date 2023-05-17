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
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (passwordInput.current !== null) {
            if (passwordInput.current.value !== confirmPasswordInput.current?.value) {
                console.log("Passwords don't match");
                return;
            }
            let authBody = {
                "auth": {
                    "type": "m.enroll.password",
                    "session": page.session_id,
                    "new_password": passwordInput.current.value
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

                if (json.error) {
                    console.log("Password invalid: " + json.error);
                } else if (passwordInput.current !== null) {
                    console.log(json);
                    page["email"] = passwordInput.current.value;
                    pageUpdate({...page, "password": passwordInput.current.value});
                    console.log("Password Chosen: " + page.email);
                } else {
                    console.log("Password is null");
                }
            });
        } else {
            //TODO: Add error output to user
            console.log("Password is null");
        }
    }

    if (page["correctCode"] && page["password"] === "") {
        return (
            <>
                <h1>Set Passphrase</h1>
                <input type="text" ref={passwordInput} placeholder="Password" />
                <input type="text" ref={confirmPasswordInput} placeholder="Confirm Password" />
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