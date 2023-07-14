import { Circles } from "react-loading-icons";
import styles from "./LoadingScreen.module.css";

interface Props {
    active: boolean;
}

const SetPassphrase = ({active}: Props) => {

    return (
        <>
            {active && (
                <div style={{ textAlign: "center" }}>
                    <h1 className={styles.loadingText}>Loading</h1>
                    <Circles className={styles.spinnerIcon} stroke="#000000" fill="#000000" />
                </div>
            )}
        </>
    );
}

export default SetPassphrase;