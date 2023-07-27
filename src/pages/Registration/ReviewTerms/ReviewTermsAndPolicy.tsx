import { useState } from 'react';
import { Button } from 'react-bootstrap';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import Terms from './Terms.tsx';
import '../RegistrationConstants.ts'
import { REGISTRATION_URL } from '../RegistrationConstants.ts';
import topStyles from '../commonStyles.module.css'
import useAuthStore from '../../../state-management/auth/store.ts';

// Review terms and policy page
const ReviewTerms = () => {
    const { authStages, registrationParams, setLoading, setTermsAccepted} = useAuthStore();
    const termsParams = registrationParams["m.login.terms"];
    const [title, setTitle] = useState(termsParams.policies[0].name + " " + termsParams.policies[0].version);

    const handleClick = () => {
        if (title === "privacy " + termsParams.policies[0].version) {
            setTitle(termsParams.policies[1].name + " " + termsParams.policies[1].version);
        } else {
            let authBody = {
                "auth": {
                    "type": "m.login.terms",
                    "session": authStages.sessionId
                }
            }
            setLoading(true);
            fetch(REGISTRATION_URL, {
                method: "POST",
                body: JSON.stringify(authBody),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .then((response) => response.json())
                .then(json => {
                    console.log(json);
                    setTermsAccepted(true);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("Error: " + error);
                    setLoading(false);
                });
        }
    }

    return (
        <>
            {!authStages.termsAccepted && !authStages.loading && (
                <>
                    <h1 className={topStyles.registrationTitle}>Review {title}</h1>
                    <div >
                        <PrivacyPolicy title={title} termsParams={termsParams} />
                        <Terms title={title} termsParams={termsParams} />
                    </div>

                    <Button variant="primary" className={topStyles.defaultSubmitBtn} onClick={handleClick}>Got It</Button>
                </>
            )}
        </>
    );
}

export default ReviewTerms;