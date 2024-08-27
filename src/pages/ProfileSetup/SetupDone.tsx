import useProfileSetupStore from "../../state-management/profileSetup/store";
import Button from 'react-bootstrap/Button';

import { useNavigate } from 'react-router-dom';


// Setup done page
const SetupDone = () => {
    const { profileStages } = useProfileSetupStore();
    const navigate = useNavigate();

    const launch = async () => {
        navigate('/');
    };

    return (
        <>
            {profileStages.roomSetup && !profileStages.loading &&
                <div style={{ position: "relative", top: "-50%" }} >
                    <h2>All Setup! Login to the app to get started.</h2>
                    <Button variant="primary" type="submit" onClick={launch} >Enter app</Button>
                </div>
            }
        </>
    );
}

export default SetupDone;