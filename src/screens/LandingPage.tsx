import VerifyEmail from "./VerifyEmail";
import ReviewTerms from "./ReviewTerms";
import { useEffect, useState } from "react";
import ChooseUser from "./ChooseUser";
import ReactModal from 'react-modal';
import CheckEmailCode from "./CheckEmailCode";
import SetPassphrase from "./SetPassphrase";
import PasswordLoading from "./PasswordLoading";
import apiClient from "../apiClient/apiClient";
import axios from "axios";

function LandingPage() {
    ReactModal.setAppElement('#root');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [userStages, setUserStages] = useState({
        "session_id": 0,
        "terms-accepted": false,
        "username": "",
        "email": "",
        "correctCode": false,
        "password": "",
        "passwordConfirmed": false
    });

    // TODO: Create object to store registration data?

    const handleCancel = () => {
        console.log("Canceling Registration");
        setIsRegistering(false);
        setUserStages({
            "session_id": 0,
            "terms-accepted": false,
            "username": "",
            "email": "",
            "correctCode": false,
            "password": "",
            "passwordConfirmed": false
        });
    }

    const handleClick = () => {
        console.log("Requesting new session id");
        fetch("https://matrix.varun.circles-dev.net/_matrix/client/v3/register", {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setIsRegistering(true);
            setUserStages({...userStages, "session_id": json.session});
            setIsRegistering(true);
        });
    }

    return (
        <>
            <h1 style={{}}>Circles</h1>
            <h2 style={{}}>Safe and Encrypted Networking</h2>
            <button style={{}} onClick={handleClick}>Sign Up</button>
            <ReactModal isOpen={isRegistering} style={{overlay: {position: "absolute",  width: "50%", left: "25%"}, content: {alignItems: "center"}}}>
                <ReviewTerms  page={userStages} pageUpdate={setUserStages}/>
                <ChooseUser page={userStages} pageUpdate={setUserStages}/>
                <VerifyEmail page={userStages} pageUpdate={setUserStages}/>
                <CheckEmailCode page={userStages} pageUpdate={setUserStages}/>
                <SetPassphrase page={userStages} pageUpdate={setUserStages}/>
                <PasswordLoading page={userStages} pageUpdate={setUserStages}/>
                <button onClick={handleCancel}>Cancel</button>
            </ReactModal>
        </>
    );
}

export default LandingPage;
