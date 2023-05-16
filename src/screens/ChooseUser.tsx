import { useState } from 'react';
import { useRef } from 'react';
import apiClient from '../apiClient/apiClient';

interface Props {
    page : {
        "session_id": number,
        "terms-accepted" : boolean,
        "username": string,
        "email": string,
        "correctCode": boolean
        "password": string
        "passwordConfirmed": boolean
    };
    pageUpdate: React.Dispatch<React.SetStateAction<{"session_id": number, "terms-accepted": boolean, "username": string, "email": string, "correctCode": boolean, "password": string, "passwordConfirmed": boolean}>>;
}

const ChooseUser = ({page, pageUpdate} : Props) => { 

    const username = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        
        if (username.current !== null) {
            console.log("session id before Terms POST: " + page.session_id);
            let authBody = {
                "auth": {
                    "type": "m.enroll.username",
                    "session": page.session_id,
                    "username": username.current.value
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
                // TODO: Add error handling and display onscreen to user
                if (json.error) {
                    console.log("Username invalid: " + json.error);
                } else if (username.current !== null) {
                    console.log(json);
                    page["username"] = username.current.value;
                    pageUpdate({...page, "username": username.current.value});
                    console.log("Username Chosen: " + page.username);
                    // console.log(".then stages completed: " + json.completed);
                } else {
                    console.log("Username is null");
                }
            });
        } else {
            console.log("Username is null");
        }
        
    }
    if (page["terms-accepted"] && page["username"] === "") {

        return (
            <>
                <h1>Choose a UserName</h1>
                <input ref={username} type="text" placeholder="Username" />
                <button onClick={handleClick}>Submit</button>
            </>
        );
    }  else {
        return (
            <>
            </>
        )
    }
}

export default ChooseUser;