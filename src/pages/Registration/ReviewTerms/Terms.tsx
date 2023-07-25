import { RegistrationParams } from "../../../state-management/auth/store";
import styles from "./ReviewTermsAndPolicy.module.css";
import { Container } from "react-bootstrap";

interface Props {
    title: string
    termsParams: RegistrationParams["m.login.terms"];
}

// Terms display
const Terms = ({ title, termsParams }: Props) => {
    return (
        <Container className={styles.policyDisplay}>
            {title === "terms " + termsParams.policies[1].version && (
                <a href={termsParams.policies[1].en.url}>Click Here to Review Terms and Conditions</a>
            )}
        </Container>
    )
}

export default Terms;
