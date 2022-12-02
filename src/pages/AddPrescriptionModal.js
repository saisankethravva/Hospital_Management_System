import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { API, Storage } from 'aws-amplify';
import { createPrescription } from '../graphql/mutations';

export default function AddPrescriptionModal(props) {
  const MAX_ATTACHMENT_SIZE = 10000000;
  const file = useRef(null);
  const [fields, handleFieldChange] = useFormFields({
    description: "",
  });


  function validateForm() {
    try {
      return fields.description.length > 0;
    } catch (e) {
      return false;
    }
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
    validateForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(props);

    if (file.current && file.current.size > MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${MAX_ATTACHMENT_SIZE / 1000000} MB.`
      );
      return;
    } else if (file.current) {
      console.log(props.appointment);
      var uuid = require("uuid").v4();
      var path = uuid+"/"+file.current.name
      await API.graphql({ query: createPrescription, variables: { input: {"appointmentId": props.appointment.id, "patientId": props.appointment.patientId, "fileName": path, "description": fields.description,"doctorId": props.appointment.doctorId} } });
      await Storage.put(path, file.current,{ level: "public", });
      alert("Prescription uploaded!");
      fields.description = "";
      props.onUploaded();
      props.onHide();
    } else {
      alert("Please select a file to upload.");
    }
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
          Upload a new prescription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={fields.description}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <Button block type="submit" size="lg" disabled={!validateForm()}>
            Upload
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}