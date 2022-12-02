import { Auth } from 'aws-amplify';
import { AmplifyChatbot } from "@aws-amplify/ui-react";
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory, useLocation } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import { API } from 'aws-amplify';
import "./CreateDoctor.css";
import { createDoctor } from '../graphql/mutations';
import { isAdmin } from '../components/User';

export default function CreateDoctor(props) {
  const [userData, setUserData] = useState({ payload: { username: '' } });
  const [errorMessages, setErrorMessages] = useState([]);
  const [adminRole, setAdminRole] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    fistName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const history = useHistory();

  const handleChatComplete = async (event) => {
    const { data, err } = event.detail;
    if (data) {
      console.log("Chat fulfilled!", data);
      const fields = typeof data.slots === 'string' || data.slots instanceof String ? JSON.parse(data.slots) : data.slots;
      console.log("fields=", fields);
      Auth.currentAuthenticatedUser()
        .then((userSession) => {
          const username = userSession.signInUserSession.accessToken.payload.username;
          API.graphql({ query: createDoctor, variables: { input: { firstName: fields.FirstName, lastName: fields.LastName, id: username, phone: fields.PhoneNumber, address: fields.City } } })
            .then(resp => history.push("/"));
        });
    }
    if (err) {
      console.error("Chat failed:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchRoles();
    const chatbotElement = document.querySelector("amplify-chatbot");
    chatbotElement.addEventListener("chatCompleted", handleChatComplete);
    return function cleanup() {
      chatbotElement.removeEventListener("chatCompleted", handleChatComplete);
    };
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
        fields.address.length > 0
      );
    } catch (e) {
      return false;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await API.graphql({ query: createDoctor, variables: { input: { firstName: fields.firstName, lastName: fields.lastName, id: userData.payload.username, phone: fields.phone, address: fields.address } } });
    } catch (e) {
      console.error('error creating doctor', e);
      setErrorMessages(e.errors);
    }



    history.push("/");
  }

  async function fetchRoles() {
    const admin = await isAdmin();
    setAdminRole(admin);
}
  function RenderListDoctorButton()
  {
    if(adminRole)
    {
      return (
        <Button variant="primary" onClick={() => {
          history.push('/listdoctor')
        }}>
          List Doctor
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
        <RenderListDoctorButton />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName" size="lg">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.firstName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="lastName" size="lg">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.lastName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="phone" size="lg">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={fields.phone}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="address" size="lg">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={fields.address}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Register
          </Button>
        </Form>
        <AmplifyChatbot
          botName="DoctorBot_sampledev"
          botTitle="Register Doctor Bot"
          welcomeMessage="Hello, say 'Register Doctor' to get started."
          conversationModeOn="true"
          voiceEnabled="true"
        />
      </div>
    );
  }

  return <div className="createdoctor"> <h1>Register Doctor</h1> {renderForm()} </div>;
}
