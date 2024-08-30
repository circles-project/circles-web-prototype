import Stack from 'react-bootstrap/Stack';
import { Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { RxAvatar } from "react-icons/rx";
import { FaRegQuestionCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { FiRefreshCcw } from "react-icons/fi";

import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { useState, useEffect } from 'react'
// import './Navigation.css'

import * as matrix from "matrix-js-sdk";
import useMatrixSdk from "../state-management/MatrixSdk.ts";

const Header = () => {
  const navigate = useNavigate();
  const { client } = useMatrixSdk();


  const [avatar, setAvatar] = useState(String);
  // const [avatarFiles, setAvatarFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchAvatar = async () => {
      const response = await client?.getProfileInfo(client.getUserId()!, 'avatar_url');
      const url = response?.avatar_url;
      setAvatar(client?.mxcUrlToHttp(url!));
    }

    fetchAvatar();



    // if (avatarFiles.length < 1) return;
    // const newAvatarURLS = [];
    // for (let i = 0; i < avatarFiles.length; i++) {
    //     if (avatarFiles[i] === null || avatarFiles[i] === undefined) {
    //         continue;
    //     }

    //     newAvatarURLS[i] = URL.createObjectURL(avatarFiles[i]);
    // }
    // setAvatarURLS(newAvatarURLS);
  }, []);

  const switchUser = async () => {
    navigate('/login');
  };

  return (
    <>
      <header>
        <div className='border' >
          <Stack direction="horizontal" gap={2}>
            <div>
              <MdOutlinePhotoSizeSelectActual className='icon' />
            </div>
            <div className='m-auto '>
              <div>
                <h3>View Title</h3>
                <div>View Description</div>
              </div>
            </div>
            <div className="vr" />
            <Button className='btn-circles-primary'>
              <FiRefreshCcw className='icon' />
            </Button>
            <Button className='btn-circles-primary'>
              <GoBell className='icon' />
            </Button>
            <Button className='btn-circles-primary'>
              <FaRegQuestionCircle className='icon' />
            </Button>


            <DropdownButton title={
                avatar ? <Image src={avatar} /> : <RxAvatar className='icon' />
            }>

              <Dropdown.Item onClick={switchUser}>Switch user</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Log out</Dropdown.Item>
            </DropdownButton>
          </Stack>
        </div>
      </header>
    </>
  );
};

export default Header;
