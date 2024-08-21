import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Style from './WelcomePage.module.css';

import Carousel from 'react-bootstrap/Carousel';

import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const navigate = useNavigate();


  function signup() {
    navigate('/signup');
  }

  return (
    <>
      <div className={[Style.background, "z-n1 position-absolute"].join(' ')} />
      <div className='d-flex flex-column min-vh-100'>
        <div className="wrapper flex-grow-1"></div>

        <main>
          <Container>
            <Row>
              <Col>
                <Image src="/src/assets/title/circles_light.svg" />
                <Carousel>
                  <Carousel.Item>
                    <Image src="/src/assets/welcome/section-3.png" width={600} />
                    <Carousel.Caption>
                      <h3>Engage with your community</h3>
                      <p>Connect with neighbors, coworkers, and friends from every sphere of life</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <Image src="/src/assets/welcome/section-three-iphones.png" width={600} />
                    <Carousel.Caption>
                      <h3>Keep your friends and family close</h3>
                      <p>Post to your timeline to share with all of your people in one place</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                  <Image src="/src/assets/welcome/section-ipad-photos.png" width={600} />
                    <Carousel.Caption>
                      <h3>Protect your little ones</h3>
                      <p>Share your moments, thoughts, and memories safely with those closest to you, without worrying about who else can see</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>


                {/* <section>
                  <Image src="/src/assets/icon/circles.svg"></Image>
                  <p>stay connected with family, friends, and your community, all with the safety of end-to-end encryption.</p>
                </section> */}
              </Col>
              <Col>
                <section>
                  <Form>
                    <Card>
                      {/* <Card.Img variant="top" src="/src/assets/title/circles_light.svg" /> */}
                      <Card.Body>
                        <Card.Title>Sign in</Card.Title>
                        <Card.Text>
                          with your Matrix account
                        </Card.Text>

                        <Form.FloatingLabel className="mb-3" controlId="username" label="Username">
                          <Form.Control type="text" placeholder="@user:example.com" />
                        </Form.FloatingLabel>

                        <Form.FloatingLabel className="mb-3" controlId="password" label="Password">
                          <Form.Control type="password" placeholder="Password" />
                          <Form.Text className="text-muted">
                            <a href="">Forgot your password?</a>
                          </Form.Text>
                        </Form.FloatingLabel>

                        {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Username</Form.Label>
                          <Form.Control type="text" placeholder="@user:example.com" />
                          <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                          </Form.Text>
                        </Form.Group> */}

                          {/* <Form.Check type="checkbox" label="Remember me" /> */}

                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                      </Card.Body>
                    </Card>
                  </Form>

                  <Card>
                      <Card.Body>
                        <Card.Title>Don't have an account?</Card.Title>
                        <Button variant="primary" type="submit" onClick={signup}>
                          Sign up
                        </Button>
                      </Card.Body>
                    </Card>
                </section>
              </Col>
            </Row>
          </Container>
        </main>

        <div className="wrapper flex-grow-1"></div>

        <footer className={[Style.footer, "border-top"].join(' ')} >
          <Navbar className="bg-body-tertiary" expand="lg">
            <Container>
                  <Navbar.Brand href="https://circles-project.github.io">
                    <Image className={Style.footerLogo} src='/src/assets/logo/circles-logo-web.svg'></Image>
                  </Navbar.Brand>
                  Copyright © The Circles Project 2024

                  <Navbar.Collapse className="justify-content-end">
                    <Nav>
                      <Nav.Link href="https://matrix.to/#/#circles:matrix.org">#circles:matrix.org</Nav.Link>
                      <Nav.Link href="https://github.com/circles-project">Github</Nav.Link>
                      <Nav.Link href="https://apps.apple.com/us/app/futo-circles/id6451446720">App Store</Nav.Link>
                      <Nav.Link href="https://play.google.com/store/apps/details?id=org.futo.circles&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">Google Play</Nav.Link>
                      <Nav.Link href="https://f-droid.org/en/packages/org.futo.circles/">F-Droid</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
            </Container>
          </Navbar>
        </footer>
      </div>
    </>
  );
}

export default WelcomePage;