import { RegistrationParams } from "../../../state-management/auth/store";
import styles from "./ReviewTermsAndPolicy.module.css"
import { Container } from "react-bootstrap";

interface Props {
    title: string;
    termsParams: RegistrationParams["m.login.terms"];
}

// Privacy Policy display
const PrivacyPolicy = ({ title, termsParams }: Props) => {
    return (
        <Container className={styles.policyDisplay}>
            {title === termsParams.policies[0].name + " " + termsParams.policies[0].version && (
                <a href={termsParams.policies[0].en.url}>Click Here to Review Privacy Policy</a>
            )}
        </Container>
    );
}
export default PrivacyPolicy;
