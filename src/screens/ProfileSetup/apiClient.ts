import RegistrationResponse from '../Registration/Interfaces/RegistrationResponse.tsx';
import { SERVER, DOMAIN } from '../Registration/RegistrationConstants.ts';

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
                //getRoomState(data.room_id, regRes);
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
            // TODO: Check if order is needed, ask Michael or Charles
            // "order": 0
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

    // TODO: Getting M_FORBIDDEN, error: "unknown room"
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

/* Notes:
In Matrix Api,
Read 11.36 for managing rooms and parent/child relatioships
Read 7.8 for sending events to a room
*/