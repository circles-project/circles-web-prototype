import VerifyEmail from "../VerifyEmail.tsx";
import ReviewTerms from "../ReviewTerms/ReviewTermsAndPolicy.js";
import ChooseUser from "../ChooseUser.tsx";
import ReactModal from 'react-modal';
import CheckEmailCode from "../CheckEmailCode.js";
import SetPassphrase from "../SetPassphrase/SetPassphrase.tsx";
import LoadingScreen from "../LoadingScreen/LoadingScreen.tsx";
import { Button } from "react-bootstrap";
import styles from "./LandingPage.module.css";
import '../RegistrationConstants.ts';
import { REGISTRATION_URL } from "../RegistrationConstants.ts";
import SetupProfile from "../../ProfileSetup/SetupProfile.tsx";
import SetupCircles from "../../ProfileSetup/SetupCircles.tsx";
import SignupSuccess from "../SignupSuccess.tsx";
import SetupDone from "../../ProfileSetup/SetupDone.tsx";
import useAuthStore from "../../../state-management/auth/store.ts";
import useProfileSetupStore from "../../../state-management/profileSetup/store.ts";

import { useNavigate } from 'react-router-dom';

function LandingPage() {

  ReactModal.setAppElement('#root');

  const navigate = useNavigate();
  const { authStages, isRegistering, registrationParams, setSessionId, setIsRegistering, setRegistrationParams, reset } = useAuthStore();
  const { profileStages, isSettingUpProfile } = useProfileSetupStore();

  // TODO: Implement login stage?
  // const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleCancel = () => {
    console.log("Canceling Registration");
    setIsRegistering(false);
    reset();
  }

  // Starts the registration process
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

  // Starts the registration process
  const goBack = () => {
    navigate('/login');
  }

  // For testing purposes
  // useEffect(() => {
  //   console.log("Change Detected in AuthStages: ", authStages);
  // }, [authStages]);
  // useEffect(() => {
  //   console.log("Change Detected in ProfileStages: ", profileStages);
  // }, [profileStages]);

  return (
    <>
      <div className="body" id="root">
        <div className={styles.homeCentering}>
          <h1 style={{}}>Circles</h1>
          <h2 style={{ marginTop: "3%" }}>Safe and Encrypted Networking</h2>
          <Button style={{ marginTop: "3%" }} onClick={handleClick}>
            Sign Up
          </Button>
          <Button style={{ marginTop: "3%", marginLeft: "5px" }} onClick={goBack}>
            Back
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
              <SignupSuccess />
            </>
          ) : null}
          <LoadingScreen active={authStages.loading}/>
          <button onClick={handleCancel} className={styles.cancelBtn}>
            Cancel
          </button>
        </ReactModal>

        {/* Profile Setup Components */}
        <ReactModal style={{ overlay: { position: "absolute", width: "50%", left: "25%" } }} isOpen={isSettingUpProfile}>
          <SetupProfile />
          <SetupCircles />
          <LoadingScreen active={profileStages.loading} />
          <SetupDone/>
        </ReactModal>
      </div>
    </>
  );

}

export default LandingPage;