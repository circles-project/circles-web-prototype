import ReactModal from "react-modal";
import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import {SERVER} from '../Registration/RegistrationConstants.ts'

const SetupProfile = () => {
    const [settingUp, setSettingUp] = useState<boolean>(true);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string>("");
    const name = useRef<HTMLInputElement>(null);

    // TODO: Use redux to setup common variables and retrieve user_id
    const user_id = "james";
    const SETUP_PATH = '/_matrix/client/v3/profile/' + user_id + '/avatar_url';

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

    const handleName = () => {

        if (name.current !== null) {
            console.log("Name: " + name.current.value);
            axios.post(SERVER + SETUP_PATH, {
                "displayname": name.current.value
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            console.log("Name is null");
        }
    }
    return (
        <ReactModal isOpen={settingUp}>
            <h1>Setup Profile</h1>
            {/*
            TODO: check if image is properly inserted
            */}
            <img src={avatarURL} alt="avatar" />
            <input type="file" onClick={onImageChange} placeholder="Choose a photo from my device's library"/>
            <input type="text" ref={name} placeholder="name" />
            <Button onClick={handleName}>Next</Button>
        </ReactModal>
    );
}

export default SetupProfile;