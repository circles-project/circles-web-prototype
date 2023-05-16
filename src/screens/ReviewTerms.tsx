import { useEffect, useState } from 'react';
import ChooseUser from './ChooseUser';
import axios from 'axios';
import apiClient from '../apiClient/apiClient';

interface Props {
    page: {
        "session_id": number,
        "terms-accepted" : boolean,
        "username": string,
        "email": string,
        "correctCode": boolean
        "password": string
        "passwordConfirmed": boolean
    }
    pageUpdate: React.Dispatch<React.SetStateAction<{"session_id": number, "terms-accepted": boolean, "username": string, "email": string, "correctCode": boolean, "password": string, "passwordConfirmed": boolean }>>;
}

const ReviewTerms = ({page, pageUpdate} : Props) => {
    // TODO: Session id keeps changing and stages completed undefined. Need to fix. UseEffect is doing something to stages completed, why is ID changing though? Wrong SYntax?
    // const [buttonClicked, setButtonClicked] = useState(false);
    const handleClick = () => {
        console.log("session id before Terms POST: " + page.session_id);
        let authBody = {
            "auth": {
                "type": "m.login.terms",
                "session": page.session_id,
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
            console.log(".then stages completed: " + json.completed);
            console.log("Terms Accepted");
            page["terms-accepted"] = true;
            pageUpdate({...page, "terms-accepted":true});
        });
    }
    
    if (!page["terms-accepted"]) {
        return (
            <>
                <h1>Review Terms</h1>
                <button onClick={handleClick}>Got It</button>
            </>
        );
    } else {
        return (
            <>
            </>
        );
    }
}

export default ReviewTerms;