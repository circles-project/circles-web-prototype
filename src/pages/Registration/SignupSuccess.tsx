import { Button } from "react-bootstrap";
import styles from "./commonStyles.module.css";
import useAuthStore from "../../state-management/auth/store";

interface Props {
    isSettingUpProfile: boolean;
    setIsSettingUpProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupSuccess = ( {isSettingUpProfile, setIsSettingUpProfile}: Props) => {
    const { stages, isRegistering, setIsRegistering} = useAuthStore();

    const handleClick = () => {
        setIsRegistering(false);
        setIsSettingUpProfile(true);
    };

    return (
        <>
            {stages.password && isRegistering && !isSettingUpProfile && !stages.loading &&
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ position: "relative", top: "75%", fontSize: "200%" }}>Successfully signed up!</h3>
                    <Button variant="primary" className={styles.defaultSubmitBtn} style={{ top: "80%", width: "70%", height: "12.5%" }} onClick={handleClick}>Next: Set Up</Button>
                </div>}
        </>
    );
};

export default SignupSuccess;