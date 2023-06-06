import VerifyEmail from "../VerifyEmail";
import ReviewTerms from "../ReviewTerms/ReviewTermsAndPolicy.js";
import { useEffect, useState } from "react";
import ChooseUser from "../ChooseUser";
import ReactModal from 'react-modal';
import CheckEmailCode from "../CheckEmailCode.js";
import SetPassphrase from "../SetPassphrase";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import  Button  from "react-bootstrap/Button";
import styles from "./LandingPage.module.css";
import { _generate_random_bytes } from "../bsspeke/EmccBsspeke.js";
import RegistrationParams from "../Interfaces/RegistrationParams.js";
import '../RegistrationConstants.ts';
import { REGISTRATION_URL } from "../RegistrationConstants.ts";
// import SetupProfile from "../../ProfileSetup/SetupProfile.tsx";

function LandingPage() {

    ReactModal.setAppElement('#root');
    const [isRegistering, setIsRegistering] = useState(false);
    // const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [userStages, setUserStages] = useState({
        "session_id": 0,
        "terms-accepted": false,
        "username": "",
        "email": false,
        "correctCode": false,
        "password": false,
        "passwordConfirmed": false,
        "loading": false,
    });
    const[registrationParams, setRegistrationParams] = useState<RegistrationParams | null>(null);

    const handleCancel = () => {
        console.log("Canceling Registration");
        setIsRegistering(false);
        setUserStages({
            "session_id": 0,
            "terms-accepted": false,
            "username": "",
            "email": false,
            "correctCode": false,
            "password": false,
            "passwordConfirmed": false,
            "loading": false,
        });
    }

    const handleClick = () => {
        fetch(REGISTRATION_URL, {
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
            setRegistrationParams(json.params);
        })
        .catch(error => {
            console.log("Error: " + error);
        });
    }

    return (
        <>
          <div className={styles.homeCentering}>
            <h1 style={{}}>Circles</h1>
            <h2 style={{ marginTop: "3%" }}>Safe and Encrypted Networking</h2>
            <Button style={{ marginTop: "3%" }} onClick={handleClick}>
              Sign Up
            </Button>
          </div>
          <ReactModal isOpen={isRegistering} style={{overlay: { position: "absolute", width: "50%", left: "25%" }, content: { display: "grid" },}}>
            {registrationParams !== null ? (
                <>
                    <ReviewTerms page={userStages} pageUpdate={setUserStages} termsParams={registrationParams["m.login.terms"]}/>
                    <ChooseUser page={userStages} pageUpdate={setUserStages} />
                    <VerifyEmail page={userStages} pageUpdate={setUserStages} />
                    <CheckEmailCode page={userStages} pageUpdate={setUserStages} />
                    <SetPassphrase page={userStages} pageUpdate={setUserStages} setPasswordParams={registrationParams["m.enroll.bsspeke-ecc.oprf"]} setRegistering={setIsRegistering}/>
                </>
            ) : null}
            <LoadingScreen page={userStages} />
            <button onClick={handleCancel} className={styles.cancelBtn}>
              Cancel
            </button>
          </ReactModal>
          {/* <SetupProfile/> */}
        </>
      );
      
}

export default LandingPage;