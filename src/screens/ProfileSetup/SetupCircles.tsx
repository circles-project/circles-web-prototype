import React from 'react'
import { useState, useEffect } from 'react'
import RegistrationResponse from '../Registration/Interfaces/RegistrationResponse'
import { createRoom, getDisplayName, getRoomState } from './apiClient'
import ProfileSetupStages from './ProfileSetupStages'
import { Container, Row, Image, Button, Col } from 'react-bootstrap'
import { BsImageFill } from 'react-icons/bs'
import './ProfileSetup.css'

interface Props {
    page: ProfileSetupStages
    pageUpdate: React.Dispatch<React.SetStateAction<ProfileSetupStages>>
    regResponse: RegistrationResponse | null;
}

const SetupCircles = ({ page, pageUpdate, regResponse }: Props) => {

    const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
    const [avatarURLS, setAvatarURLS] = useState<string[]>([]);
    const [displayName, setDisplayName] = useState<string>("");
    getDisplayName(regResponse).then((displayName) => setDisplayName(displayName));

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

        // TODO: m.space is currently the only type supported, add back org.futo.social.timeline?
        const familySpaceId = await createRoom("Family", "", avatarURLS[0], [], "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", regResponse);
        await createRoom("Family", "", avatarURLS[0], [], "", "org.futo.social.timeline", familySpaceId, powerLevelsRooms, "invite", regResponse);

        const friendsSpaceId = await createRoom("Friends", "", avatarURLS[1], [], "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", regResponse);
        await createRoom("Friends", "", avatarURLS[1], [], "", "org.futo.social.timeline", friendsSpaceId, powerLevelsRooms, "invite", regResponse);

        const communitySpaceId = await createRoom("Community", "", avatarURLS[2], [], "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", regResponse);
        await createRoom("Community", "", avatarURLS[2], [], "", "org.futo.social.timeline", communitySpaceId, powerLevelsRooms, "invite", regResponse);

        pageUpdate({ ...page, "roomSetup": true, "loading": false });
        getRoomState(circlesRoomId, regResponse);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "0vh" }}>
            <Container style={{ marginTop: "-85%", verticalAlign: "center" }}>
                {!page["loading"] && page["avatar"] && !page["roomSetup"] && (
                    <>
                        <h2 style={{ textAlign: "center", paddingBottom: "25px" }} className="separator">Set up your circles</h2>
                        <Container style={{ textAlign: "center" }}>
                            <Row className="separator circleRow">
                                <Col>
                                    {
                                        avatarURLS[0] ? (
                                            <Image src={avatarURLS[0]} className="img-fluid circlesPics" alt="Family Circles Picture" roundedCircle />
                                        ) : (
                                            <BsImageFill size={80} className="img-fluid" alt="Family Circles Picture" roundedCircle />
                                        )
                                    }
                                    <input type="file" accept=".jpg, .jpeg" placeholder="Change" onChange={(event) => onImageChange(event, 0)} />
                                </Col>
                                <Col style={{}}>
                                    <h2 className="fs-2" >Family</h2>
                                    <p>{displayName}</p>
                                </Col>
                            </Row>
                            <Row className="separator circleRow">
                                <Col >
                                    {
                                        avatarURLS[1] ? (
                                            <Image src={avatarURLS[1]} className="img-fluid circlesPics" alt="Friends Circles Picture" roundedCircle />
                                        ) : (
                                            <BsImageFill size={80} className="img-fluid" alt="Friends Circles Picture" roundedCircle />
                                        )
                                    }
                                    <input type="file" accept=".jpg, .jpeg" placeholder="Change" onChange={(event) => onImageChange(event, 1)} />
                                </Col>
                                <Col>
                                    <h2 className="fs-2">Friends</h2>
                                    <p>{displayName}</p>
                                </Col>
                            </Row>
                            <Row className="separator circleRow">
                                <Col >
                                    {
                                        avatarURLS[2] ? (
                                            <Image src={avatarURLS[2]} className="img-fluid circlesPics" alt="Community Circles Picture" roundedCircle />
                                        ) : (
                                            <BsImageFill size={80} className="img-fluid" alt="Community Circles Picture" roundedCircle />
                                        )
                                    }
                                    <input type="file" accept=".jpg, .jpeg" placeholder="Change" onChange={(event) => onImageChange(event, 2)} />
                                </Col>
                                <Col>
                                    <h2 className="fs-2">Community</h2>
                                    <p>{displayName}</p>
                                </Col>
                            </Row>
                        </Container>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" size='lg' style={{ width: "80%", marginTop: "5%" }} onClick={createHierarcy}>
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </Container>
        </div>
    );

}

export default SetupCircles