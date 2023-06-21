import RegistrationResponse from '../Registration/Interfaces/RegistrationResponse.tsx';
import { SERVER, DOMAIN } from '../Registration/RegistrationConstants.ts';
import ProfileSetupStages from './ProfileSetupStages.ts';

//TODO: Check type of joinRules and powerLevels
export function createRoom(roomName: string, topic: string, icon_uri: string, invite_ids: string[], roomType: string, roomTag: string, parentId: string, powerLevels: object, joinRule: string, regRes: RegistrationResponse | null): Promise<string> {
    const CREATE_URL = SERVER + '/_matrix/client/v3/createRoom';

    return new Promise((resolve, reject) => {
        fetch(CREATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${regRes?.access_token}`
            },
            body: JSON.stringify({
                "creation_content": {
                    "room_type": roomType,
                },
                "initial_state": [
                    { "type": "m.room.join_rules", "state_key": "", "content": { "join_rule": joinRule } }
                ],
                "name": roomName,
                "topic": topic,
                "power_level_content_override": powerLevels,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Room Created: ", data);
                setTags(regRes?.user_id, data.room_id, roomTag, regRes);
                if (icon_uri !== "") {
                    setGroupAvatar(icon_uri, data.room_id, regRes);
                }
                if (parentId !== "") {
                    establishParentChildRelationship(parentId, data.room_id, regRes);
                }
                resolve(data.room_id); // Resolve the promise with the room ID
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error); // Reject the promise with the error
            });
    });
}

// Add tags to a room
function setTags(userId: string | undefined, roomId: string, tag: string, regRes: RegistrationResponse | null) {
    const TAGS_URL = SERVER + '/_matrix/client/v3/user/' + userId + '/rooms/' + roomId + '/tags/' + tag;
    fetch(TAGS_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${regRes?.access_token}`
        },
        body: JSON.stringify({
            // TODO: Check if order is needed
            "order": .25
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Tags Added: ", data);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Set the avatar of a room
function setGroupAvatar(avatarURL: string, roomId: string, regRes: RegistrationResponse | null) {
    const AVATAR_URL = SERVER + '/_matrix/client/r0/rooms/' + roomId + '/state/m.room.avatar';

    fetch(AVATAR_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${regRes?.access_token}`
        },
        body: JSON.stringify({
            "info": {
                "h": 100,
                "w": 100,
            },
            "url": avatarURL
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Avatar Set: ", data);

        })
        .catch((error) => {
            console.error('Error:', error);
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
function establishParentChildRelationship(parentId: string, childId: string, regRes: RegistrationResponse | null) {

    // m.space.parent is event in child room - state_key is parent room's id
    // m.space.child is event in parent room - state_key is child room's id
    const CHILD_ROOM_URL = SERVER + '/_matrix/client/v3/rooms/' + childId + '/state/m.room.child/' + parentId;
    const PARENT_ROOM_URL = SERVER + '/_matrix/client/v3/rooms/' + parentId + '/state/m.room.parent/' + childId;

    // TODO: Ask about child room ordering
    // Adding m.space.parent event to child room
    fetch(CHILD_ROOM_URL, {
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
        .then(data => {
            console.log("Child/Parent Relationship Established: ", data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // Adding m.space.child event to parent room
    fetch(PARENT_ROOM_URL, {
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
        .then(response => {
            console.log("Child/Parent Relationship Established: ", response);
        }
        )
        .catch((error) => {
            console.log('Error:', error);
        });

}

// Sets the users profile avatar
export async function setProfileAvatar(avatarFile: File | null, regResponse: RegistrationResponse | null) {
    const AVATAR_URL_PATH = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/avatar_url';
    const mxcFile = await generateMxcUri(avatarFile, regResponse);

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
        .then(json => {
            console.log("Profile Avatar Set: ", json)
            getProfileAvatar(regResponse);
        })
        .catch((error) => {
            console.log("Error: " + error);
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
export function setDisplayName(displayName: string, regResponse: RegistrationResponse | null, pageUpdate: Function, page: ProfileSetupStages) {
    const DISPLAY_NAME_URL = SERVER + '/_matrix/client/v3/profile/' + regResponse?.user_id + '/displayname';

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
            // TODO: Uncomment, testing changing avatar photo
            pageUpdate({ ...page, "avatar": true });
        })
        .catch((error) => {
            console.log("Error: " + error);
        });
}

export function generateMxcUri(file: File | null, regResponse: RegistrationResponse | null): Promise<string> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file as Blob);

        fetch(SERVER + '/_matrix/media/v3/upload', {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${regResponse?.access_token}`
            }
        })
            .then((response) => response.json())
            .then(json => {
                console.log("Mxc URI: ", json);
                resolve(json.content_uri);
            })
            .catch((error) => {
                console.log("Error: " + error);
                reject("Error");
            });
    });
}

