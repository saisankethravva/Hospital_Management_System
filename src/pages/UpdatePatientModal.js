import React, { useState, useRef } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { updatePatient } from '../graphql/mutations';
import { API } from 'aws-amplify';

export default function UpdatePatientModal(props) {
  const patient = useRef(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [fields, handleFieldChange] = useFormFields({
    phone: "",
    address: ""
  });

  function validateForm() {
    try {
      return (
        fields.phone.length > 0 &&
        fields.address.length > 0 &&
        fields.birthDate.length > 0 
      );
    } catch (e) {
      return false;
    }
  }

  function handlePatientChange(event) {
    validateForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await API.graphql({ query: updatePatient, variables: { input: {id: props.patient.id,firstName: fields.firstName,lastName: fields.lastName, phone: fields.phone,email: fields.email, address: fields.address,sex: fields.sex, ssn: fields.ssn,
      insuranceNumber: fields.insuranceNumber, birthDate: fields.birthDate+'T00:00:00.000Z'} } });
    } catch (e) {
      console.error('error updating patient', e);
      setErrorMessages(e.errors);
    }
      alert("Patient Details Updated!");
      fields.description = "";
      fields.address = "";
      props.onUpdated();
      props.onHide();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Patient
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={fields.firstName}
              placeholder={props.patient.firstName}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={fields.lastName}
              placeholder={props.patient.lastName}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={fields.phone}
              placeholder={props.patient.phone}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={fields.email}
              placeholder={props.patient.email}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={fields.address}
              placeholder={props.patient.address}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="ssn">
            <Form.Label>SSN</Form.Label>
            <Form.Control
              value={fields.ssn}
              placeholder={props.patient.ssn}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          
          <Form.Group controlId="insuranceNumber">
            <Form.Label>Insurance Number</Form.Label>
            <Form.Control
              value={fields.insuranceNumber}
              placeholder={props.patient.insuranceNumber}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="birthDate">
            <Form.Label>Birth Date</Form.Label>
            <Form.Control
              value={fields.birthDate}
              placeholder={props.patient.birthDate}
              type="date"
              onChange={handleFieldChange}
            />
          </Form.Group>

          <Form.Group controlId="sex">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              value={fields.sex}
              placeholder={props.patient.sex}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>

          <Button block type="submit" size="lg" disabled={!validateForm()}>
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}