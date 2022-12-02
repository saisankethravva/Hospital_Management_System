import { Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import { API } from 'aws-amplify';
import "./CreatePatient.css";
import { createPatient } from '../graphql/mutations';
import { isAdmin } from '../components/User';

export default function CreatePatient() {
  const [adminRole, setAdminRole] = useState(false);
    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [errorMessages, setErrorMessages] = useState([]);
    const [fields, handleFieldChange] = useFormFields({
      fistName: "",
      lastName: "",
      phone: "",
      address: "",
      birthDate: "",
      sex: "",
      ssn: "",
      insuranceNumber: ""
    });
    const history = useHistory();
  
    useEffect(() => {
      fetchUserData();
      fetchRoles();
      }, []);

    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          setUserData(userSession.signInUserSession.accessToken);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    function validateForm() {
      try {
        return (
          fields.firstName.length > 0 &&
          fields.lastName.length > 0 &&
          fields.phone.length > 0 &&
          fields.address.length > 0 &&
          fields.birthDate.length > 0 &&
          fields.sex.length > 0 &&
          fields.ssn.length > 0 &&
          fields.insuranceNumber.length > 0
        );
      } catch (e) {
        return false;
      }
    }
  
    async function handleSubmit(event) {
      event.preventDefault();
      try {
        await API.graphql({ query: createPatient, variables: { input: {firstName: fields.firstName, lastName: fields.lastName, id: userData.payload.username, phone: fields.phone, email: fields.email, address: fields.address,
            birthDate: fields.birthDate+'T00:00:00.000Z', sex: fields.sex, ssn: fields.ssn, insuranceNumber: fields.insuranceNumber} } });
      } catch (e) {
        console.error('error registering patient', e);
        setErrorMessages(e.errors);
      }
      history.push("/patient");
    }
    
    async function fetchRoles() {
      const admin = await isAdmin();
      setAdminRole(admin);
  }
    function RenderListPatientButton()
    {
      if(adminRole)
      {
        return (
          <Button variant="primary" onClick={() => {
            history.push('/listpatient')
          }}>
            List Patient
          </Button>
        )
      }
      return (
        <></>
      )
    }
  
    function renderForm() {
      return (
        <div>
          {/* <RenderListPatientButton /> */}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName" className='small'  size="md">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.firstName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="lastName" className='small'  size="md">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.lastName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="phone" size="md">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={fields.phone}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="email" size="md">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={fields.email}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="address" size="md">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={fields.address}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="birthDate" size="md">
            <Form.Label>Birth date</Form.Label>
            <Form.Control
              type="date"
              value={fields.birthDate}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="sex" size="md">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              type="text"
              value={fields.sex}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="ssn" size="md">
            <Form.Label>SSN</Form.Label>
            <Form.Control
              type="text"
              value={fields.ssn}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="insuranceNumber" size="md">
            <Form.Label>Insurance Number</Form.Label>
            <Form.Control
              type="text"
              value={fields.insuranceNumber}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Button block className="btn-theme" size="md" type="submit" disabled={!validateForm()}>
            Register
          </Button>
        </Form>
        </div>
      );
    }
  
    return <div className="createpatient"> <h5>REGISTRATION</h5> {renderForm()} </div>;
}
