import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Navigation from './Navigation';

const App = () => {
  return (
    <>
    {/* only support dark theme after login for now (due to background image and no user settings) */}
      <div data-bs-theme="dark">
        <Container fluid>
          <Row>
            <Col xs='auto'>
              <Navigation />
            </Col>
            <Col>
              App Content
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default App;
