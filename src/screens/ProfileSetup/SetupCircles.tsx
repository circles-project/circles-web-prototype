import React from 'react'
import { useState, useEffect } from 'react'

const SetupCircles = () => {

    const [settingUp, setSettingUp] = useState<boolean>(true);
    const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
    const [avatarURLS, setAvatarURLS] = useState<string[]>([]);

    // TODO: Use redux to setup common variables and retrieve user_id
    const user_id = "james";
    const SETUP_PATH = '/_matrix/client/v3/profile/' + user_id + '/avatar_url';

    // TODO: Check if these functions work as intended in environment
    useEffect(() => {
        if (avatarFiles.length < 1) return;
        const newAvatarURLS = [];
        for (let i = 0; i < avatarFiles.length; i++) {
            if (avatarFiles[i] !== null) {
                newAvatarURLS.push(URL.createObjectURL(avatarFiles[i]));
            }
        }
        for (let i = avatarFiles.length; i < 3; i++) {
            setAvatarURLS(newAvatarURLS);
        }
        setAvatarURLS(newAvatarURLS);
    }, [avatarFiles]);

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            setAvatarFiles(...avatarFiles, event.target.files[0]);
        }
    };

    return (
    <>
        <div>
                <h1>Set up your circles</h1>
            <div>
                <img src={avatarURLS[0]} alt="Family Circles Picture"/>
                <input type="File" placeholder="Change"/>
                <h2>Family</h2>
                {/* TODO: Ask if it's the username or group owner */}
                <p>{"Username Here"}</p>
            </div>
            <div>
                <img src={avatarURLS[1]} alt="Friends Circles Picture"/>
                <input type="File" placeholder="Change"/>
                <h2>Friends</h2>
                <p>{"Username Here"}</p>
            </div>
            <div>
                <img src={avatarURLS[2]} alt="Community Circles Picture"/>
                <input type="File" placeholder="Change"/>
                <h2>Community</h2>
                <p>{"Username Here"}</p>
            </div>
        </div>
    </>
    )
}

export default SetupCircles