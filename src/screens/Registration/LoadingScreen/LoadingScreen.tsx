import RegistrationProps from "../Interfaces/RegistrationProps"
import { Circles } from "react-loading-icons";
import styles from "./LoadingScreen.module.css"
import ProfileSetupStages from "../../ProfileSetup/ProfileSetupStages";

interface Props {
    page: RegistrationProps | ProfileSetupStages;
}

const SetPassphrase = ({ page }: Props) => {

    return (
        <>
            {page["loading"] && (
                <div style={{ textAlign: "center" }}>
                    <h1 className={styles.loadingText}>Loading</h1>
                    <Circles className={styles.spinnerIcon} stroke="#000000" fill="#000000" />
                </div>
            )}
        </>
    );
}

export default SetPassphrase;