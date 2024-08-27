import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
// import { setDisplayName, setProfileAvatar } from "./apiCalls.ts";
import { Container, Image } from "react-bootstrap";
import { BsPersonSquare } from "react-icons/bs";
import useAuthStore from "../../state-management/auth/store.ts";
import useProfileSetupStore from "../../state-management/profileSetup/store.ts";

import * as matrix from "matrix-js-sdk";
import useMatrixSdk from "../../state-management/MatrixSdk.ts";

// Setup profile page
const SetupProfile = () => {
    const { registrationResponse } = useAuthStore();
    const { profileStages, setAvatar, setLoading } = useProfileSetupStore();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(null); // Change the type to string or null
    const name = useRef<HTMLInputElement>(null);

    const { client, setClient } = useMatrixSdk();

    useEffect(() => {
        // const setupCrypto = async () => {
        //     console.log("Initializing matrix crypto...");
        //     const matrixSdkCrypto = await import("@matrix-org/matrix-sdk-crypto-wasm");
        //     await matrixSdkCrypto.initAsync();

        //     // Optional: enable tracing in the rust-sdk
        //     new matrixSdkCrypto.Tracing(matrixSdkCrypto.LoggerLevel.Trace).turnOn();

        //     // Create a new OlmMachine
        //     //
        //     // The following will use an in-memory store. It is recommended to use
        //     // indexedDB where that is available.
        //     // See https://matrix-org.github.io/matrix-rust-sdk-crypto-wasm/classes/OlmMachine.html#initialize
        //     const olmMachine = await matrixSdkCrypto.OlmMachine.initialize(
        //         new matrixSdkCrypto.UserId(registrationResponse.user_id),
        //         new matrixSdkCrypto.DeviceId(registrationResponse.device_id),
        //     );

        //     return olmMachine;
        // }

        console.log(client);

        if (client === null) {
            console.log("Initializing matrix client...");

            // console.log("https://" + registrationResponse.user_id.split(':')[1]);
            // console.log(registrationResponse.access_token);
            // console.log(registrationResponse.user_id);

            const matrixClient = matrix.createClient({
                // update eventually for user chosen server instead of hard-coded
                baseUrl: "https://matrix." + registrationResponse.user_id.split(':')[1],
                accessToken: registrationResponse.access_token,
                userId: registrationResponse.user_id,
            });

            setClient(matrixClient);

            // setupCrypto();
        }

        if (avatarFile !== null) {
            setAvatarURL(URL.createObjectURL(avatarFile));
        }
    }, [avatarFile, client]);

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarFile(event.target.files[0]);
        }
    };

    const handleClick = async () => {
        if (name.current !== null) {
            const nameVal = name.current.value;
            console.log("Name: " + nameVal);
            setLoading(true);

            // Submitting display name and avatar to server
            // disabling due to mxc null exception
            // await setProfileAvatar(avatarFile, registrationResponse);
            // await setDisplayName(nameVal, registrationResponse);

            if (avatarFile) {
                const response = await client?.uploadContent(avatarFile, { type: avatarFile.type });
                await client?.setProfileInfo("avatar_url", { avatar_url: response!.content_uri });
            }

            await client?.setProfileInfo("displayname", { displayname: nameVal });

            setAvatar(true);
            setLoading(false);

        } else {
            console.log("Name is null");
        }
    }

    return (
        <Container style={{ height: "90%" }}>
            {!profileStages.loading && !profileStages.avatar && (
                <>
                    <h1 className="title">Setup Profile</h1>
                    {avatarURL ? (
                        <Image className="profilePic" rounded src={avatarURL} alt="avatar" />
                    ) : (
                        <BsPersonSquare size={100} className="profilePic" />
                    )}
                    <input type="file" accept=".jpg, .jpeg" id="choosePhotoInput" className="choosePhotoInput" onChange={onImageChange} placeholder="Choose a photo from my device's library" />
                    <input type="text" className="displayName" ref={name} placeholder="name" />
                    <Button variant="primary" className="nextBtn" onClick={handleClick}>Next</Button>
                </>
            )}
        </Container>
    );
}

export default SetupProfile;

