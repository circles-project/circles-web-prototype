import { Button } from "react-bootstrap";
import RegistrationProps from "./Interfaces/RegistrationProps";

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
                <div>
                    <h3>Successfully signed up!</h3>
                    <Button variant="primary" onClick={handleClick}>Next: Set Up</Button>
                </div>}
        </>
    );
};

export default SignupSuccess;