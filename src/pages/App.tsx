import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navigation';
import Header from './Header';
import './App.css'

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarRightFilled } from "react-icons/tb";

const App = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
    {/* only support dark theme after login for now (due to background image and no user settings) */}
      <div id='theme' data-bs-theme="dark" >
        <Container fluid >
          <Row>
            <Col className='p-0' xs='auto'>
              <Navigation />
            </Col>
            <Col>
              <Row>
                <Col className='p-0' >
                  <Header />
                </Col>
              </Row>
              <Row>
                <Col>
                  App Content
                </Col>

                {
                  !open &&

                  <Col xs={1}>
                    {/* todo: implement detail content after more work is done for main views */}
                    <div className='border' style={{ height: '90vh' }} >
                      <div>
                        <Button className='btn-circles-primary'>
                          <TbLayoutSidebarRightFilled className='icon' onClick={() => setOpen(!open)} />
                        </Button>
                      </div>
                    </div>
                  </Col>
                }

                {
                  open &&

                  <Col xs={4}>
                    {/* todo: implement detail content after more work is done for main views */}
                    <div className='border' style={{ height: '90vh' }} >
                      <div>
                        <div>Detail Content</div>
                        <Button className='btn-circles-primary'>
                          <TbLayoutSidebarLeftExpandFilled className='icon' onClick={() => setOpen(!open)} />
                        </Button>
                      </div>
                    </div>
                  </Col>
                }

              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default App;
