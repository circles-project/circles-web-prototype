import { useState } from 'react';
import { Button } from 'react-bootstrap';
import PrivacyPolicy from './PrivacyPolicy';
import Terms from './Terms';
import RegistrationProps from '../Interfaces/RegistrationProps';
import RegistrationParams from '../Interfaces/RegistrationParams';
import '../RegistrationConstants.ts'
import { REGISTRATION_URL } from '../RegistrationConstants.ts';
import topStyles from '../commonStyles.module.css'

interface Props {
    page: RegistrationProps
    pageUpdate: React.Dispatch<React.SetStateAction<RegistrationProps>>;
    termsParams: RegistrationParams["m.login.terms"];
}

const ReviewTerms = ({ page, pageUpdate, termsParams }: Props) => {
    const [title, setTitle] = useState(termsParams.policies[0].name + " " + termsParams.policies[0].version);


    // console.log("termsParams: " + termsParams);
    const handleClick = () => {
        if (title === "privacy " + termsParams.policies[0].version) {
            setTitle(termsParams.policies[1].name + " " + termsParams.policies[1].version);
        } else {
            let authBody = {
                "auth": {
                    "type": "m.login.terms",
                    "session": page.session_id,
                }
            }
            pageUpdate({ ...page, "loading": true });
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

                    page["terms-accepted"] = true;
                    pageUpdate({ ...page, "terms-accepted": true, "loading": false });
                })
                .catch((error) => {
                    console.log("Error: " + error);
                    pageUpdate({ ...page, "loading": false });
                });
        }
    }

    return (
        <>
            {!page["terms-accepted"] && !page["loading"] && (
                <>
                    <h1 className={topStyles.registrationTitle}>Review {title}</h1>

                    {/* Future Idea: Might be cleaner to have the links to the terms/policy instead of embedding */}
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