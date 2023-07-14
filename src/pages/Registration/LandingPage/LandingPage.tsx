import VerifyEmail from "../VerifyEmail.tsx";
import ReviewTerms from "../ReviewTerms/ReviewTermsAndPolicy.js";
import { useState } from "react";
import ChooseUser from "../ChooseUser.tsx";
import ReactModal from 'react-modal';
import CheckEmailCode from "../CheckEmailCode.js";
import SetPassphrase from "../SetPassphrase/SetPassphrase.tsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.tsx";
import { Button } from "react-bootstrap";
import styles from "./LandingPage.module.css";
import { _generate_random_bytes } from "../bsspeke/EmccBsspeke.js";
import '../RegistrationConstants.ts';
import { REGISTRATION_URL } from "../RegistrationConstants.ts";
import SetupProfile from "../../ProfileSetup/SetupProfile.tsx";
import SetupCircles from "../../ProfileSetup/SetupCircles.tsx";
import SignupSuccess from "../SignupSuccess.tsx";
import SetupDone from "../../ProfileSetup/SetupDone.tsx";
import useAuthStore from "../../../state-management/auth/store.ts";

function LandingPage() {

  ReactModal.setAppElement('#root');

  const { stages, isRegistering, registrationParams, setSessionId, setIsRegistering, setRegistrationParams, reset } = useAuthStore();

  // TODO: Implement login stage?
  // const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSettingUpProfile, setIsSettingUpProfile] = useState(false);
  const [profileSetupStages, setProfileSetupStages] = useState({
    "avatar": false,
    "roomSetup": false,
    "loading": false,
  });

  const handleCancel = () => {
    console.log("Canceling Registration");
    setIsRegistering(false);
    reset();
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
        setSessionId(json.session);
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

      {/* Registration Components */}
      <ReactModal isOpen={isRegistering} style={{ overlay: { position: "absolute", width: "50%", left: "25%" }, content: { display: "grid" }, }}>
        {registrationParams !== null ? (
          <>
            <ReviewTerms />
            <ChooseUser />
            <VerifyEmail />
            <CheckEmailCode />
            <SetPassphrase />
            <SignupSuccess isSettingUpProfile={isSettingUpProfile} setIsSettingUpProfile={setIsSettingUpProfile} />
          </>
        ) : null}
        <LoadingScreen active={stages.loading}/>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </ReactModal>

      {/* Profile Setup Components */}
      <ReactModal style={{ overlay: { position: "absolute", width: "50%", left: "25%" } }} isOpen={isSettingUpProfile}>
        <SetupProfile page={profileSetupStages} pageUpdate={setProfileSetupStages} />
        <SetupCircles page={profileSetupStages} pageUpdate={setProfileSetupStages} />
        <LoadingScreen active={profileSetupStages.loading} />
        <SetupDone page={profileSetupStages} />
      </ReactModal>
    </>
  );

}

export default LandingPage;