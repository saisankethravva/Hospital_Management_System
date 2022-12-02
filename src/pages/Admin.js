import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { isAdmin } from '../components/User';


export default function Admin() {
  const history = useHistory();

  async function RenderListPatientButton() {
    const adminRole = await isAdmin();
    if (adminRole) {
      return (
        <Button variant="primary" onClick={() => {
          history.push('/listpatient')
        }}>
          List Patient
        </Button>
      )
    }
    return (
      <>not admin!</>
    )
  }

    return (
      // <Container>
      //   <Row>
      //     <Col>
      //       <RenderListPatientButton />
      //     </Col>
          <>here!</>
      //   </Row>
      // </Container>
    );
}
