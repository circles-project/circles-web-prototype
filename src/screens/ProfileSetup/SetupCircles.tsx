import React from 'react'
import { useState, useEffect } from 'react'
import { SERVER } from '../Registration/RegistrationConstants'
import RegistrationResponse from '../Registration/Interfaces/RegistrationResponse'
import { createRoom, getRoomState } from './apiClient'
import ProfileSetupStages from './ProfileSetupStages'
import { Container, Row, Image, Button, Col } from 'react-bootstrap'

interface Props {
    page: ProfileSetupStages
    pageUpdate: React.Dispatch<React.SetStateAction<ProfileSetupStages>>
    regResponse: RegistrationResponse | null;
}

const SetupCircles = ({ page, pageUpdate, regResponse }: Props) => {

    const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
    const [avatarURLS, setAvatarURLS] = useState<string[]>([]);

    // TODO: Check if these functions work as intended in environment
    useEffect(() => {
        if (avatarFiles.length < 1) return;
        const newAvatarURLS = [];
        for (let i = 0; i < avatarFiles.length; i++) {
            newAvatarURLS[i] = URL.createObjectURL(avatarFiles[i]);
        }
        setAvatarURLS(newAvatarURLS);
    }, [avatarFiles]);

    const onImageChange = (event: any, index: number) => {
        const updatedAvatarFiles = [...avatarFiles]; // Create a copy of the avatarFiles array
        updatedAvatarFiles[index] = event.target.files[0]; // Update the file at the specified index
        setAvatarFiles(updatedAvatarFiles); // Set the updated array
    };

    const createHierarcy = async () => {
        pageUpdate({ ...page, "loading": true });
        const powerLevelsSpace = {
            "events_default": 100,
        };
        const powerLevelsRooms = {
            "invite": 50,
        };

        const rootRoomId = await createRoom("Circles", "", "", [], "m.space", "org.futo.space.root", "", powerLevelsSpace, "private", regResponse);
        const circlesRoomId = await createRoom("My Circles", "", "", [], "m.space", "org.futo.space.circles", rootRoomId, powerLevelsSpace, "private", regResponse);
        const groupRoomId = await createRoom("My Groups", "", "", [], "m.space", "org.futo.space.groups", rootRoomId, powerLevelsSpace, "private", regResponse);
        const photosRoomId = await createRoom("My Photo Galleries", "", "", [], "m.space", "org.futo.space.photos", rootRoomId, powerLevelsSpace, "private", regResponse);

        // Creating sub-space rooms
        await createRoom("Photos", "", "", [], "org.futo.social.gallery", "org.futo.space.gallery", photosRoomId, powerLevelsRooms, "private", regResponse);

        const familySpaceId = await createRoom("Family", "", avatarURLS[0], [], "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", regResponse);
        await createRoom("Family", "", avatarURLS[0], [], "org.futo.social.timeline", "org.futo.social.timeline", familySpaceId, powerLevelsRooms, "invite", regResponse);

        const friendsSpaceId = await createRoom("Friends", "", avatarURLS[1], [], "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", regResponse);
        await createRoom("Friends", "", avatarURLS[1], [], "org.futo.social.timeline", "org.futo.space.timeline", friendsSpaceId, powerLevelsRooms, "invite", regResponse);

        const communitySpaceId = await createRoom("Community", "", avatarURLS[2], [], "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", regResponse);
        await createRoom("Community", "", avatarURLS[2], [], "org.futo.social.timeline", "org.futo.space.timeline", communitySpaceId, powerLevelsRooms, "invite", regResponse);

        // TODO: Add back "roomSetup" : true when done testing/fixing css
        pageUpdate({ ...page, "loading": false });
        getRoomState(circlesRoomId, regResponse);
    };

    return (
        <>
            {!page["loading"] && page["avatar"] && page["roomSetup"] && (
                <>
                    <h2 style={{ textAlign: "center" }}>Set up your circles</h2>
                    <Container>
                        <Row className='justify-content-md-center'>
                            <Col xs={6}>
                                <Image src={avatarURLS[0]} className="img-fluid" alt="Family Circles Picture" roundedCircle />
                                <input type="file" placeholder="Change" onChange={(event) => onImageChange(event, 0)} />
                            </Col>
                            <Col>
                                <h2>Family</h2>
                                {/* TODO: Ask if it's the username or group owner */}
                                <p>{"Username Here"}</p>
                            </Col>
                        </Row>
                        <Row className='justify-content-md-center'>
                            <Col>
                                <Image
                                    src={avatarURLS[1]}
                                    className="img-fluid"
                                    alt="Friends Circles Picture"
                                    roundedCircle
                                />
                                <input type="file" placeholder="Change" onChange={(event) => onImageChange(event, 1)} />
                            </Col>
                            <Col>
                                <h2>Friends</h2>
                                <p>{"Username Here"}</p>
                            </Col>
                        </Row>
                        <Row className='justify-content-md-center'>
                            <Col>
                                <Image
                                    src={avatarURLS[2]}
                                    className="img-fluid"
                                    alt="Community Circles Picture"
                                    roundedCircle
                                />
                                <input type="file" placeholder="Change" onChange={(event) => onImageChange(event, 2)} />
                            </Col>
                            <Col>
                                <h2>Community</h2>
                                <p>{"Username Here"}</p>
                            </Col>
                        </Row>
                    </Container>
                    <Button variant="primary" onClick={createHierarcy}>
                        Next: Set Up
                    </Button>
                </>
            )}
        </>
    );

}

export default SetupCircles