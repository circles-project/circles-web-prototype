import { SERVER, DOMAIN } from '../Registration/RegistrationConstants.ts';
import { RegistrationResponse } from '../../state-management/auth/store.ts';

// Create a room with the given parameters by sending m.room.create event to server
//TODO: Check type of joinRules and powerLevels
export async function createRoom(roomName: string, topic: string, avatarFile: File | null, roomType: string | null, roomTag: string, parentId: string, powerLevels: object, regRes: RegistrationResponse | null): Promise<string> {
    const CREATE_URL = SERVER + '/_matrix/client/v3/createRoom';
    try {
        const response = await fetch(CREATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${regRes?.access_token}`
            },
            body: JSON.stringify({
                "creation_content": {
                    "type": roomType,
                },
                "name": roomName,
                "topic": topic,
                "preset": "private_chat",
                "visibility": "private",
                "power_level_content_override": powerLevels,
            })
        });

        const data = await response.json();
        console.log("Room Created: ", data);

        await setTags(regRes?.user_id, data.room_id, roomTag, regRes);
        if (avatarFile) {
            await setGroupAvatar(avatarFile, data.room_id, regRes);
        }
        if (parentId) {
            await establishParentChildRelationship(parentId, data.room_id, regRes);
        }
        if (roomType === "org.futo.social.group" || roomType === "org.futo.social.gallery" || roomType === "org.futo.social.timeline") {
            await sendEvent(data.room_id, "m.room.encryption", { "algorithm": "m.megolm.v1.aes-sha2", }, regRes, "");
        }

        return data.room_id; // Resolve the promise with the room ID
    } catch (error) {
        console.error('Error:', error);
        throw error; // Reject the promise with the error
    }
}

// TODO: Adapt existing room setup to use sendEvent function (simplification puprposes and get rid of other functions)
// Send events to a room
export async function sendEvent(roomId: string, eventType: string, content: object, regRes: RegistrationResponse | null, stateKey?: string) {
    const SEND_EVENT_URL = SERVER + '/_matrix/client/v3/rooms/' + roomId + '/state/' + eventType + '/' + stateKey;
    fetch(SEND_EVENT_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${regRes?.access_token}`
        },
        body: JSON.stringify(content)
    })
        .then(response => response.json())
        .catch((error) => {
            console.log('Error:', error);
        });

}

// Add tags to a room
async function setTags(userId: string | undefined, roomId: string, tag: string, regRes: RegistrationResponse | null): Promise<void> {
    const TAGS_URL = SERVER + '/_matrix/client/v3/user/' + userId + '/rooms/' + roomId + '/tags/' + tag;
    try {
        await fetch(TAGS_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${regRes?.access_token}`
            },
            body: JSON.stringify({
                "order": 0
            })
        });

        await getTags(userId, roomId, tag, regRes);
        return;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


// Get tags of a room
async function getTags(userId: string | undefined, roomid: string, tag: string, regRes: RegistrationResponse | null) {

    return new Promise((resolve, reject) => {
        fetch(SERVER + '/_matrix/client/v3/user/' + userId + '/rooms/' + roomid + '/tags/' + tag, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${regRes?.access_token}`
            },
        })
            .then(response => response.json())
            .then(response => {
                resolve(response);
            }
            )
            .catch((error) => {
                console.error('Error:', error);
                reject(error);
            });
    });
}

// Set the avatar of a room
async function setGroupAvatar(avatarFile: File, roomId: string, regRes: RegistrationResponse | null): Promise<string> {
    const mxcURL = await generateMxcUri(regRes);
    const mxcFile = await uploadToMxc(avatarFile, mxcURL, regRes);

    const AVATAR_URL = SERVER + '/_matrix/client/r0/rooms/' + roomId + '/state/m.room.avatar';
    return new Promise((resolve, reject) => {
        fetch(AVATAR_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${regRes?.access_token}`
            },
            body: JSON.stringify({
                // TODO: Change info?
                "info": {
                    "h": 398,
                    "mimetype": "image/jpeg",
                    "size": 31037,
                    "w": 394
                },
                "url": mxcFile
            })
        })
            .then(response => response.json())
            .then(response => {
                resolve(response.event_id);
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error);
            });
    });
}

// Get the state of a room - testing purposes
export function getRoomState(roomid: string, regRes: RegistrationResponse | null) {
    const ROOM_STATE_URL = SERVER + '/_matrix/client/v3/rooms/' + roomid + '/state';
    fetch(ROOM_STATE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${regRes?.access_token}`
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("Room State: ", data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Establish parent/child relationship between two rooms
async function establishParentChildRelationship(parentId: string, childId: string, regRes: RegistrationResponse | null): Promise<void> {

    // m.space.parent is event in child room - state_key is parent room's id
    // m.space.child is event in parent room - state_key is child room's id
    const CHILD_EVENT_URL = SERVER + '/_matrix/client/v3/rooms/' + parentId + '/state/m.space.child/' + childId;
    const PARENT_EVENT_URL = SERVER + '/_matrix/client/v3/rooms/' + childId + '/state/m.space.parent/' + parentId;

    // Adding m.space.child event to child room
    return new Promise((resolve, reject) => {
        fetch(CHILD_EVENT_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${regRes?.access_token}`,
            },
            body: JSON.stringify({
                "via": [
                    DOMAIN
                ]
            })
        })
            .then(response => response.json())
            .then(() => {

                // Adding m.space.parent event to parent room
                fetch(PARENT_EVENT_URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json',
                        'Authorization': `Bearer ${regRes?.access_token}`,
                    },
                    body: JSON.stringify({
                        "via": [
                            DOMAIN
                        ]
                    })
                })
                    .then(response => response.json())
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                        reject(error);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error);
            });
    });
}

// Sets the users profile avatar
export async function setProfileAvatar(avatarFile: File | null, regResponse: RegistrationResponse | null): Promise<void> {
    const AVATAR_URL_PATH = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/avatar_url';
    const mxcURI = await generateMxcUri(regResponse);
    const mxcFile = await uploadToMxc(avatarFile, mxcURI, regResponse);

    return new Promise((resolve, reject) => {
        fetch(AVATAR_URL_PATH, {
            method: "PUT",
            body: JSON.stringify({
                "avatar_url": mxcFile,
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${regResponse?.access_token}`
            }

        })
            .then((response) => response.json())
            .then(() => {
                getProfileAvatar(regResponse);
                resolve();
            })
            .catch((error) => {
                console.log("Error: " + error);
                reject(error);
            });
    });

}

// Gets the users profile avatar
function getProfileAvatar(regResponse: RegistrationResponse | null) {
    const AVATAR_URL_PATH = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/avatar_url';
    fetch(AVATAR_URL_PATH, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${regResponse?.access_token}`
        }
    })
        .then((response) => response.json())
        .then(json => {
            console.log("Profile Avatar: ", json)
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
}

// Get the users display name, returns a promise
export function getDisplayName(regResponse: RegistrationResponse | null): Promise<string> {
    return new Promise((resolve, reject) => {
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
                resolve(json.displayname);
            })
            .catch((error) => {
                console.log("Error: " + error);
                reject("Error");
            });
    });
}

// Sets the users display name
export async function setDisplayName(displayName: string, regResponse: RegistrationResponse | null): Promise<void> {
    const DISPLAY_NAME_URL = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/displayname';
    // pageUpdate({ ...page, "loading": true });
    fetch(DISPLAY_NAME_URL, {
        method: "PUT",
        body: JSON.stringify({
            "displayname": displayName,
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${regResponse?.access_token}`
        }
    })
        .then((response) => response.json())
        .then(json => {
            console.log("Display Name Set: ", json);
            // pageUpdate({ ...page, "avatar": true });
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
}

// Generates an Mxc URI to be able to upload a file to
export function generateMxcUri(regResponse: RegistrationResponse | null): Promise<string> {
    return new Promise((resolve, reject) => {
        fetch(SERVER + `/_matrix/media/v3/upload`, {
            method: "POST",
            headers: {
                "Content-Type": "image/jpeg",
                "Accept": "application/json",
                "Authorization": `Bearer ${regResponse?.access_token}`,
            },
            body: JSON.stringify({
                "filename": "avatar",
            })  
        })
            .then((response) => response.json())
            .then(json => {
                resolve(json.content_uri);

            })
            .catch((error) => {
                console.log("Error: " + error);
                reject(error);
            });
    });
}

// Uploads a file to the provided Mxc URI
export function uploadToMxc(file: File | null, mxcURI: string, regResponse: RegistrationResponse | null): Promise<string> {
    const mediaID = mxcURI.split("/").pop();
    const serverName = mxcURI.split("/")[2];

    return new Promise((resolve, reject) => {
        fetch(SERVER + '/_matrix/media/v3/upload/' + serverName + '/' + mediaID, {
            method: "POST",
            body: file,
            headers: {
                "Content-Type": "image/jpeg",
                "Authorization": `Bearer ${regResponse?.access_token}`
            }
        })
            .then((response) => response.json())
            .then(json => {
                resolve(json.content_uri);
            })
            .catch((error) => {
                console.log("Error: " + error);
                reject(error);
            });
    });
}

// Checks the account data for the user; used for debugging - need to uncomment calls in SetupCircles.tsx and fix setAccountData function
export function checkSetup(regResponse: RegistrationResponse | null) {
    const DEBUG_URL = SERVER + '/_matrix/client/v3/user/' + regResponse?.user_id + '/account_data/org.futo.circles.config';
    fetch(DEBUG_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${regResponse?.access_token}`
        }
    })

        .then((response) => response.json())
        .then(json => {
            console.log("Debug: ", json);
        }
        )
        .catch((error) => {
            console.log("Error: " + error);
        }
        );
}

// TODO: Function not working as intended, adding only most recent
// Set the account data for the user and adds it to org.futo.circles.config
export function setAccountData(roomType: string, roomID: string, regResponse: RegistrationResponse | null) {
    const ACCOUNT_DATA_URL = SERVER + '/_matrix/client/v3/user/' + regResponse?.user_id + "/account_data/org.futo.circles.config";
    fetch(ACCOUNT_DATA_URL, {
        method: "PUT",
        body: JSON.stringify({
            [roomType]: roomID,
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${regResponse?.access_token}`
        }
    })
        .then((response) => response.json())
        .then(json => {
            console.log("Account Data Set: ", json);
        }
        )
        .catch((error) => {
            console.log("Error: " + error);
        }
        );
}

// Get the room hierarchy data for a given room
export function getRoomHierarchy(roomId: string, regResponse: RegistrationResponse | null) {
    const HIERARCHY_URL = SERVER + "/_matrix/client/v1/rooms/" + roomId + "/hierarchy";
    fetch(HIERARCHY_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${regResponse?.access_token}`
        }
    })
        .then((response) => response.json())
        .then(json => {
            console.log("Hierarchy: ", json);
        }
        )
        .catch((error) => {
            console.log("Error: " + error);
        }
        );
}

