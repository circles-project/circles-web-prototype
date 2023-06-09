import ReactModal from "react-modal";
import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { SERVER } from '../Registration/RegistrationConstants.ts'
import RegistrationResponse from "../Registration/Interfaces/RegistrationResponse.tsx";
import { createRoom } from "./apiClient.ts";
import ProfileSetupStages from "./ProfileSetupStages.tsx";
import { getRoomState } from "./apiClient.ts";

interface Props {
    page: ProfileSetupStages;
    pageUpdate: React.Dispatch<React.SetStateAction<ProfileSetupStages>>
    regResponse: RegistrationResponse | null;
};

const SetupProfile = ({ page, pageUpdate, regResponse }: Props) => {
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string>("");
    const name = useRef<HTMLInputElement>(null);

    // TODO: Use redux to setup common variables and retrieve user_id
    // const user_id = "james";
    const AVATAR_URL = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/avatar_url';
    const DISPLAY_NAME_URL = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/displayname';

    // TODO: Check if these functions work as intended in environment
    useEffect(() => {
        if (avatarFile !== null) {
            setAvatarURL(URL.createObjectURL(avatarFile));
        }
    }, [avatarFile]);

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarFile(event.target.files[0]);
        }
    };

    const handleClick = () => {
        if (name.current !== null) {
            console.log("Name: " + name.current.value);

            // Submitting display name to server
            fetch(AVATAR_URL, {
                method: "PUT",
                body: JSON.stringify({
                    "avatar_url": avatarURL
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${regResponse?.access_token}`
                }

            })
                .then((response) => response.json())
                .then(json => {
                    console.log(json);
                    fetch(DISPLAY_NAME_URL, {
                        method: "PUT",
                        body: JSON.stringify({
                            "displayname": name.current?.value
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": `Bearer ${regResponse?.access_token}`
                        }
                    })
                        .then((response) => response.json())
                        .then(json => {
                            console.log(json);

                            // Logging newly created profile info, delete afer testing
                            fetch(SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                    'Authorization': `Bearer ${regResponse?.access_token}`,
                                }

                            })
                                .then((response) => response.json())
                                .then(json => {
                                    console.log(json);
                                    pageUpdate({ ...page, "avatar": true });
                                })
                                .catch((error) => {
                                    console.log("Error: " + error);
                                }
                                )

                        })
                        .catch((error) => {
                            console.log("Error: " + error);
                        })

                })
                .catch((error) => {
                    console.log("Error: " + error);
                });

        } else {
            console.log("Name is null");
        }
    }
    return (
        <>
            {!page["loading"] && !page["avatar"] &&
                <>
                    <h1>Setup Profile</h1>
                    <img style={{ height: "125px", width: "125px" }} src={avatarURL} alt="avatar" />
                    <input type="file" onChange={onImageChange} placeholder="Choose a photo from my device's library" />
                    <input type="text" ref={name} placeholder="name" />
                    <Button variant="primary" onClick={handleClick}>Next</Button>
                </>
            }
        </>
    );
}

export default SetupProfile;