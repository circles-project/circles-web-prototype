import { useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Button, Image } from 'react-bootstrap';

import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarRightFilled } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { PiCirclesFourLight } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { GrGroup } from "react-icons/gr";

import './Navigation.css'

const Navigation = () => {
  const [open, setOpen] = useState(true);

  const toggleTheme = () => {
    const theme = document.documentElement.getAttribute('data-bs-theme');

    if (theme === 'light') {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
    else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }



  return (
    <>
    {/* only support dark theme after login for now (due to background image and no user settings) */}
      {/* <div data-bs-theme="dark">

      </div> */}
      <nav>
        {
          !open &&

          <div className='border' >
            <Stack gap={2} style={{ height: '99vh' }}>
              {/* <div className="p-2">First item</div>
              <div className="p-2">Second item</div>
              <div className="p-2">Third item</div> */}

              <Button>
                <TbLayoutSidebarLeftExpandFilled className='icon' onClick={() => setOpen(!open)} />
              </Button>
              <div className='my-4'></div>


              <Button>
                <Image src="src/assets/logo/circles-logo-web.svg" className='icon' />
              </Button>
              <Button>
                <PiCirclesFourLight className='icon' />
              </Button>
              <Button>
                <RiGroupLine className='icon' />
              </Button>
              <Button>
                <MdOutlineMessage className='icon' />
              </Button>
              <Button>
                <MdOutlinePhotoSizeSelectActual className='icon' />
              </Button>
              <Button>
                <GrGroup className='icon' />
              </Button>

              {/* <div className="wrapper flex-grow-1"></div> */}

              {/* <div className='ms-auto' style={{ height: '40vh' }}></div> */}

              {/* <div className='my-5'></div> */}

              <div style={{ height: '100%' }}></div>

              <Button onClick={toggleTheme}>TT</Button>
              <Button>
                <IoSettingsOutline className='icon' />
              </Button>
            </Stack>
          </div>
        }
        {
          open &&

          <div className='border' >
          <Stack gap={2} style={{ height: '99vh' }}>
            {/* <div className="p-2">First item</div>
            <div className="p-2">Second item</div>
            <div className="p-2">Third item</div> */}

            <div className='d-flex flex-row-reverse'>
              <Button>
                <TbLayoutSidebarRightFilled className='icon' onClick={() => setOpen(!open)} />
              </Button>
            </div>
            <div className='my-4'></div>

            <Button>
              <Image src="src/assets/logo/circles-logo-web.svg" className='icon' />
              <Image src="src/assets/title/circles_dark.svg" height={40} />
            </Button>
            <Button>
              <div className='d-flex flex-row'>
                  <PiCirclesFourLight className='icon' />
                  Circles
              </div>
            </Button>
            <Button>
              <div className='d-flex flex-row'>
                <RiGroupLine className='icon' />
                Groups
              </div>
            </Button>
            <Button>
              <div className='d-flex flex-row'>
                <MdOutlineMessage className='icon' />
                Messages
              </div>
            </Button>
            <Button>
              <div className='d-flex flex-row'>
                <MdOutlinePhotoSizeSelectActual className='icon' />
                Photos
              </div>
            </Button>
            <Button>
              <div className='d-flex flex-row'>
                <GrGroup className='icon' />
                People
              </div>
            </Button>


            <div style={{ height: '100%' }}></div>

            <Button onClick={toggleTheme}>toggle theme</Button>
            <Button>
              <div className='d-flex flex-row'>
                <IoSettingsOutline className='icon' />
                Settings
              </div>
            </Button>
          </Stack>
        </div>
        }

      </nav>
    </>
  );
};

export default Navigation;
