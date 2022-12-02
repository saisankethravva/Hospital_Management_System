import React, { useState, useRef } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { updateDoctor } from '../graphql/mutations';
import { API } from 'aws-amplify';

export default function UpdateDoctorModal(props) {
  const doctor = useRef(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [fields, handleFieldChange] = useFormFields({
    phone: "",
    address: "",
  });

  function validateForm() {
    try {
      return (
        fields.phone.length > 0 &&
        fields.address.length > 0
      );
    } catch (e) {
      return false;
    }
  }

  function handleDoctorChange(event) {
    validateForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await API.graphql({ query: updateDoctor, variables: { input: {id: props.doctor.id, phone: fields.phone, address: fields.address} } });
    } catch (e) {
      console.error('error updating doctor', e);
      setErrorMessages(e.errors);
    }
      alert("Doctor updated!");
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
          Update Doctor
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={fields.phone}
              placeholder={props.doctor.phone}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={fields.address}
              placeholder={props.doctor.address}
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