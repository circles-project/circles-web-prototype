import RegistrationProps from "../Interfaces/RegistrationProps"
import { Circles } from "react-loading-icons";
import styles from "./LoadingScreen.module.css"

interface Props {
    page: RegistrationProps;
}

const SetPassphrase = ({page} : Props) => {

    return (
        <>
            {page["loading"] && (
                <> 
                    <h1 className={styles.loadingText}>Loading</h1>
                    {/* TODO: Add loading animation and logic for checking once password registered*/}
                    <Circles className={styles.spinnerIcon} stroke="#000000" fill="#000000" />        
                </>
            )}
        </>
    );
}

export default SetPassphrase;