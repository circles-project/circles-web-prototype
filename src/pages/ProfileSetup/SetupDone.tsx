import useProfileSetupStore from "../../state-management/profileSetup/store";

// Setup done page  
const SetupDone = () => {
    const { profileStages } = useProfileSetupStore();
    return (
        <>
            {profileStages.roomSetup && !profileStages.loading &&
                <h2 style={{ position: "relative", top: "-50%" }}>All Setup! Login to the app to get started.</h2>
            }
        </>
    );
}

export default SetupDone;