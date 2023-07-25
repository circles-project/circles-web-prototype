import { Button } from "react-bootstrap";
import styles from "./commonStyles.module.css";
import useAuthStore from "../../state-management/auth/store";
import useProfileSetupStore from "../../state-management/profileSetup/store";

// Signup success page
const SignupSuccess = () => {
    const { authStages, isRegistering, setIsRegistering} = useAuthStore();
    const { isSettingUpProfile, setSettingUpProfile } = useProfileSetupStore();

    const handleClick = () => {
        setIsRegistering(false);
        setSettingUpProfile(true);
    };

    return (
        <>
            {authStages.password && isRegistering && !isSettingUpProfile && !authStages.loading &&
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ position: "relative", top: "75%", fontSize: "200%" }}>Successfully signed up!</h3>
                    <Button variant="primary" className={styles.defaultSubmitBtn} style={{ top: "80%", width: "70%", height: "12.5%" }} onClick={handleClick}>Next: Set Up</Button>
                </div>}
        </>
    );
};

export default SignupSuccess;