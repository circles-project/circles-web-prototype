import { useState } from 'react';
import Stack from 'react-bootstrap/Stack';
import { Button } from 'react-bootstrap';

import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarRightFilled } from "react-icons/tb";

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

          <TbLayoutSidebarLeftExpandFilled className='icon' onClick={() => setOpen(!open)} />
        }
        {
          open &&

          <div className='border' >
          <Stack gap={3}>
            {/* <div className="p-2">First item</div>
            <div className="p-2">Second item</div>
            <div className="p-2">Third item</div> */}

            <TbLayoutSidebarRightFilled className='icon' onClick={() => setOpen(!open)} />
            <Button>home</Button>
            <Button>circles</Button>
            <Button>groups</Button>
            <Button>messages</Button>
            <Button>photos</Button>
            <Button onClick={toggleTheme}>toggle theme</Button>
            <Button>settings</Button>
          </Stack>
        </div>
        }

      </nav>
    </>
  );
};

export default Navigation;
