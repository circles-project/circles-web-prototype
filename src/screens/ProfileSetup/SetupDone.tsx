import ProfileSetupStages from "./ProfileSetupStages";

interface Props {
    page: ProfileSetupStages
}

const SetupDone = ({ page }: Props) => {
    return (
        <>
            {page["roomSetup"] && !page["loading"] &&
                <h2 style={{ position: "relative", top: "-50%" }}>All Setup! Login to the app to get started.</h2>
            }
        </>
    );
}

export default SetupDone;