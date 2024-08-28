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

// import './Navigation.css'

const Header = () => {
  const navigate = useNavigate();

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
            <Button>
              <FiRefreshCcw className='icon' />
            </Button>
            <Button>
              <GoBell className='icon' />
            </Button>
            <Button>
              <FaRegQuestionCircle className='icon' />
            </Button>


            <DropdownButton title={
              <RxAvatar className='icon' />
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
