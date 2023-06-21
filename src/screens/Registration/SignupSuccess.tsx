import { Button } from "react-bootstrap";
import RegistrationProps from "./Interfaces/RegistrationProps";
import styles from "./commonStyles.module.css";

interface Props {
    page: RegistrationProps;
    isRegistering: boolean;
    setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
    isSettingUpProfile: boolean;
    setIsSettingUpProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupSuccess = ({ page, isRegistering, setIsRegistering, isSettingUpProfile, setIsSettingUpProfile }: Props) => {

    const handleClick = () => {
        setIsRegistering(false);
        setIsSettingUpProfile(true);
    };

    return (
        <>
            {page["password"] && isRegistering && !isSettingUpProfile && !page["loading"] &&
                <div style={{ textAlign: "center" }}>
                    <h3 style={{ position: "relative", top: "75%", fontSize: "200%" }}>Successfully signed up!</h3>
                    <Button variant="primary" className={styles.defaultSubmitBtn} style={{ top: "80%", width: "70%", height: "12.5%" }} onClick={handleClick}>Next: Set Up</Button>
                </div>}
        </>
    );
};

export default SignupSuccess;