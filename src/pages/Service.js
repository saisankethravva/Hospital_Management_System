import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import { useFormFields } from "../lib/hooksLib";
import { API, graphqlOperation } from 'aws-amplify';
import { createService } from "../graphql/mutations";
import { useHistory } from "react-router-dom";
import { getService, listServices } from "../graphql/queries";

function Service() {
  const [userData, setUserData] = useState({ payload: { username: '' } });
  const [show, setShow] = useState(false);
  const [resData, setResData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [services, setServices] = useState([]);
  const [singleService, setSingleService] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errorMessages, setErrorMessages] = useState([]);

  const history = useHistory();

  const [fields, handleFieldChange] = useFormFields({
    serviceName: "",
    serviceDescription: "",
  });

  function validateForm() {
    try {
      return fields.serviceName.length > 0;
    } catch (e) {
      return false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await API.graphql({ query: createService, variables: { input: {serviceName: fields.serviceName, serviceDescription: fields.serviceDescription } } }).then((res) => setResData(res));
    } catch (e) {
      console.error('error registering service', e);
      setErrorMessages(e.errors);
    }
    setShowAlert(true);
    handleClose();
    history.push("/service");
  }

  function SuccessAlert(){
    return (
    <Alert show={showAlert} variant="success">
        <Alert.Heading>Service Successfully Added!</Alert.Heading>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShowAlert(false)} variant="outline-success">
            Close me y'all!
          </Button>
        </div>
      </Alert>
    )
  }

  useEffect(() => {
    listServiceInfo();
    }, []);


async function listServiceInfo() {
        try {
          const apiData = await API.graphql(graphqlOperation(listServices) );
          //console.log(apiData.data.listServices.items)

          if (apiData.data.listService == null) {
            history.push("/service")
          }
          setServices(apiData.data.listServices.items);
        } catch (e) {
            console.error('error fetching patient', e);
            setErrorMessages(e.errors);
        }
      }

      async function getServiceInfo(id) {
        try {
          const apiData = await API.graphql({ query: getService, variables: { id: id } } );
          if (apiData.data.getDoctor == null) {
            history.push("/service")
          }
          setSingleService(apiData.data.getService);
          console.log(singleService)
        } catch (e) {
            console.error('error fetching service', e);
            setErrorMessages(e.errors);
        }
      }


  return (
    <Container>
      <Row>
        <Col className="m-3">
          <SuccessAlert />
          <Button variant="primary" onClick={handleShow}>
            Create New Service
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create a Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="serviceName">
                  <Form.Label>Service Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Service Name"
                    value={fields.serviceName}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="serviceDescription">
                  <Form.Label>Service Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={fields.serviceDescription}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={!validateForm()}>
                Add Service
              </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      { services.map(element => (
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Service Name</th>
            <th>Service Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{element.id}</td>
            <td>{element.serviceName}</td>
            <td>{element.serviceDescription}</td>
            <td>
              <Button variant="primary" onClick={() => getServiceInfo(element.id)}>Edit</Button>{' '}
              <Button variant="danger">Delete</Button>
            </td>
          </tr>
        </tbody>
      </Table>
      )) }

      </Row>
    </Container>
  );
}

export default Service;
