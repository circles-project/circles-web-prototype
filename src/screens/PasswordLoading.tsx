interface Props {
    page: {
        "terms-accepted" : boolean,
        "username": string,
        "email": string
        "correctCode": boolean
        // TODO: should I be storing the password here?
        "password": string
        "passwordConfirmed": boolean
    }
    pageUpdate: React.Dispatch<React.SetStateAction<{ "terms-accepted": boolean, "username": string, "email": string, "correctCode": boolean, "password": string, "passwordConfirmed": boolean }>>;
}

const SetPassphrase = ({page, pageUpdate} : Props) => {

    // const handleClick = () => {
    //     console.log("Registering Password");
    //     // TODO: Do I need this line?
    //     page["password"] = "some password";
    //     pageUpdate({...page, "password":page["password"]});
    //     // console.log(page);
    // }
    if (page["password"] !== "" && !page["passwordConfirmed"]) {
        return (
            <>
                <h2>Completing Password Registration</h2>
                {/* TODO: Add loading animation and logic for checking once password registered*/}
            </>
        );
    } else {
        return (
            <>
            </>
        );
    }
}

export default SetPassphrase;