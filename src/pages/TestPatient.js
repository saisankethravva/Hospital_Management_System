import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listPatients } from '../graphql/queries';
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPatient as createPatientMutation, deletePatient as deletePatientMutation , updatePatient as updatePatientMutation} from '../graphql/mutations';

const initialFormState = {   firstName: "",
lastName: "",
phone: "",
address: "",
sex: "",
ssn: "",
insuranceNumber: "" }

function App() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    console.log("inside fetch patient" );
    const apiData = await API.graphql({ query: listPatients });
    console.log(apiData.data.listPatients.items );
    setPatients(apiData.data.listPatients.items);
  }

  async function createPatient() {
    console.log("inside createPatient" );
    if (!formData.firstName || !formData.phone) return;
    console.log(formData);
    await API.graphql({ query: createPatientMutation, variables: { input: formData } });
    setPatients([ ...patients, formData ]);
    setFormData(initialFormState);
  }

  async function deletePatient({ id }) {
    const newPatientArray = patients.filter(patient => patient.id !== id);
    setPatients(newPatientArray);
    await API.graphql({ query: deletePatientMutation, variables: { input: { id } }});
  }

  async function updatePatient({patient}) {
    console.log("inside updatePatient" );
    console.log(patient);
    await API.graphql({ query: updatePatientMutation, variables: { input: patient}});
    fetchPatients();
  }

  return (
    <div className="Patient">
      <h1>Patient Registration</h1>
      <input
        onChange={e => setFormData({ ...formData, 'firstName': e.target.value})}
        placeholder="First Name"
        value={formData.firstName}
      />
      <br/>
       <input
        onChange={e => setFormData({ ...formData, 'lastName': e.target.value})}
        placeholder="Last Name"
        value={formData.lastName}
      />
     <br/>
     <input
        onChange={e => setFormData({ ...formData, 'phone': e.target.value})}
        placeholder="Phone Number"
        value={formData.phone}
      />
      <br/>

<input
        onChange={e => setFormData({ ...formData, 'address': e.target.value})}
        placeholder="Address"
        value={formData.address}
      />
<br/>
<input
        onChange={e => setFormData({ ...formData, 'sex': e.target.value})}
        placeholder="Sex"
        value={formData.sex}
      />
<br/>
<input
        onChange={e => setFormData({ ...formData, 'ssn': e.target.value})}
        placeholder="Social Security Number"
        value={formData.ssn}
      />
<br/>
    <input
        onChange={e => setFormData({ ...formData, 'insuranceNumber': e.target.value})}
        placeholder="Insurance Number"
        value={formData.insuranceNumber}
      />
      <br/>
      <DatePicker placeholderText="Birth Date" onChange={date => setDate(date)}
        value={formData.birthDate} />
      <br/>
      <br/>
      <div>

      <button onClick={createPatient}>Register Patient</button>
      </div>

    
      <br/>

 <div >

    <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Sex</th>
              <th>SSN</th>
              <th>Insurance Number</th>           
              <th>Action</th>
              <th>BirthDate</th>
            </tr>
          </thead>
          <tbody>
          {
          patients.map(patient => (
                <tr key={patient.id || patient.firstName} >
                  <td>{patient.firstName}</td>
                  <td>{patient.lastName}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.address}</td>
                  <td>{patient.sex}</td>
                  <td>{patient.ssn}</td>
                  <td>{patient.insuranceNumber}</td>
                  <td>{patient.birthDate}</td>
                  <td><button onClick={() => deletePatient(patient)}>Delete</button></td>
                  
                </tr>
              ))
            }
          </tbody>
        </table>
        </div>
   
    </div>
  );
}

export default withAuthenticator(App);