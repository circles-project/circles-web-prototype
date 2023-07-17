import React from 'react'
import { useState, useEffect } from 'react'
import { createRoom, getDisplayName } from './apiCalls'
import ProfileSetupStages from './ProfileSetupStages'
import { Container, Row, Image, Button, Col } from 'react-bootstrap'
import { BsImageFill } from 'react-icons/bs'
import './ProfileSetup.css'
import useAuthStore from '../../state-management/auth/store'

interface Props {
    page: ProfileSetupStages
    pageUpdate: React.Dispatch<React.SetStateAction<ProfileSetupStages>>
}

const SetupCircles = ({ page, pageUpdate}: Props) => {
    const { registrationResponse } = useAuthStore();

    const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
    const [avatarURLS, setAvatarURLS] = useState<string[]>([]);
    const [displayName, setDisplayName] = useState<string>("");
    getDisplayName(registrationResponse).then((displayName) => setDisplayName(displayName));

    useEffect(() => {
        if (avatarFiles.length < 1) return;
        const newAvatarURLS = [];
        for (let i = 0; i < avatarFiles.length; i++) {
            if (avatarFiles[i] === null || avatarFiles[i] === undefined) {
                continue;
            }

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

        const rootRoomId = await createRoom("Circles", "", null, null, "m.space", "org.futo.space.root", "", powerLevelsSpace, "private", registrationResponse);
        // setAccountData("root", rootRoomId, registrationResponse);
        const circlesRoomId = await createRoom("My Circles", "", null, null, "m.space", "org.futo.space.circles", rootRoomId, powerLevelsSpace, "private", registrationResponse);
        // setAccountData("circles", circlesRoomId, registrationResponse);
        const groupRoomId = await createRoom("My Groups", "", null, null, "m.space", "org.futo.space.groups", rootRoomId, powerLevelsSpace, "private", registrationResponse);
        // setAccountData("groups", groupRoomId, registrationResponse);
        const photosRoomId = await createRoom("My Photo Galleries", "", null, null, "m.space", "org.futo.space.photos", rootRoomId, powerLevelsSpace, "private", registrationResponse);
        // setAccountData("gallery", photosRoomId, registrationResponse);

        // Creating sub-space rooms
        await createRoom("Photos", "", null, null, "org.futo.social.gallery", "org.futo.space.gallery", photosRoomId, powerLevelsRooms, "private", registrationResponse);
        // setAccountData("gallery", photosId, registrationResponse);

        const familySpaceId = await createRoom("Family", "", avatarFiles[0], null, "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", registrationResponse);
        // setAccountData("circle", familySpaceId, registrationResponse);
        await createRoom("Family", "", avatarFiles[0], null, "org.futo.social.timeline", "org.futo.social.timeline", familySpaceId, powerLevelsRooms, "invite", registrationResponse);

        const friendsSpaceId = await createRoom("Friends", "", avatarFiles[1], null, "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", registrationResponse);
        // setAccountData("circle", friendsSpaceId, registrationResponse);
        await createRoom("Friends", "", avatarFiles[1], null, "org.futo.social.timeline", "org.futo.social.timeline", friendsSpaceId, powerLevelsRooms, "invite", registrationResponse);

        const communitySpaceId = await createRoom("Community", "", avatarFiles[2], null, "m.space", "org.futo.social.circle", circlesRoomId, powerLevelsSpace, "invite", registrationResponse);
        // setAccountData("circle", communitySpaceId, registrationResponse);
        await createRoom("Community", "", avatarFiles[2], null, "org.futo.social.timeline", "org.futo.social.timeline", communitySpaceId, powerLevelsRooms, "invite", registrationResponse);

        pageUpdate({ ...page, "roomSetup": true, "loading": false });
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