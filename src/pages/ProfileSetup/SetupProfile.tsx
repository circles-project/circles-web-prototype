import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { setDisplayName, setProfileAvatar } from "./apiCalls.ts";
import { Container, Image } from "react-bootstrap";
import { BsPersonSquare } from "react-icons/bs";
import useAuthStore from "../../state-management/auth/store.ts";
import useProfileSetupStore from "../../state-management/profileSetup/store.ts";


// Setup profile page
const SetupProfile = () => {
    const { registrationResponse } = useAuthStore();
    const { profileStages, setAvatar, setLoading } = useProfileSetupStore();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarURL, setAvatarURL] = useState<string | null>(null); // Change the type to string or null
    const name = useRef<HTMLInputElement>(null);

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

    const handleClick = async () => {
        if (name.current !== null) {
            const nameVal = name.current.value;
            console.log("Name: " + nameVal);
            setLoading(true);

            // Submitting display name and avatar to server
            await setProfileAvatar(avatarFile, registrationResponse);
            await setDisplayName(nameVal, registrationResponse);
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

