import { Auth } from 'aws-amplify';
import { API,Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import {  getPatient} from '../graphql/queries';
import { listAppointmentByPatient, listPrescriptionByPatient} from '../graphql/customQueries';
import { useHistory} from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import UpdatePatientModal from "./UpdatePatientModal";
import Appointment from "./Appointment";
import { deleteAppointment } from '../graphql/mutations';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import * as FaIcons from 'react-icons/fa';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function Patient() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [patient, setPatient]= useState({ });
    const [doctor, setDoctor]= useState({ });
    const [appointments, setAppointments]= useState([]);
    const [prescriptions, setPrescriptions]= useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const history = useHistory();
    const [updateModalShow, setUpdateModalShow] = React.useState(false);
    const [updateAppointmentModalShow, setAppointmentModalShow] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = useState([]);

    useEffect(() => {
      fetchUserData();
      
      }, []);

    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          getPatientInfo(userSession.signInUserSession.accessToken.payload.username);
         
          setUserData(userSession.signInUserSession.accessToken);
          fetchAppointments(userSession.signInUserSession.accessToken.payload.username);
          fetchPrescriptions(userSession.signInUserSession.accessToken.payload.username);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    async function fetchAppointments(userName) {
      console.log("inside fetch appointments" );
      try {
        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
          const apiData = await API.graphql({ query: listAppointmentByPatient, variables: { patientId: userName ,appointmentDate: dateString }  });
          console.log(apiData.data.listAppointments.items);
          function sortFunction(a, b) {
            return a.appointmentDate < b.appointmentDate ? 1 : -1;
          }
          const sortedData = apiData.data.listAppointments.items.sort(sortFunction);
          setAppointments(sortedData);
      }catch(e){
          console.error('error fetching appointments', e);
          setErrorMessages(e.errors);
      }
      
    }


    async function fetchPrescriptions(userName) {
      console.log("inside fetch prescriptions" );
      try {
          const apiData = await API.graphql({ query: listPrescriptionByPatient, variables: { patientId: userName }  });
          console.log(apiData.data.listPrescriptions.items);
          const prescriptionFromAPI  = apiData.data.listPrescriptions.items
          await Promise.all(prescriptionFromAPI.map(async prescription => {
            console.log(prescription.fileName);
            const content = await Storage.get(prescription.fileName,{ level: "public", });
            console.log(content);
            prescription.content = content;
            return prescription;
            }))


          setPrescriptions(apiData.data.listPrescriptions.items);
      }catch(e){
          console.error('error fetching prescriptions', e);
          setErrorMessages(e.errors);
      }
      
    }

    async function getPatientInfo(userName) {
        try {
          const apiData = await API.graphql({ query: getPatient, variables: { id: userName } } );
          console.log(apiData.data.getPatient)
          if (apiData.data.getPatient == null) {
            history.push("/createpatient")
          }
          setPatient(apiData.data.getPatient);
        } catch (e) {
            console.error('error fetching patient', e);
            setErrorMessages(e.errors);
        }
      }
    
    function openUpdatePatientModal(patient) {
      setSelectedPatient(patient);
      setUpdateModalShow(true);
    }

    function openAppointment(patient) {
      setSelectedPatient(patient);
      setAppointmentModalShow(true);
    }

    function onHideAppointmentModal(patient) {
      console.log("inside onHideAppointmentModal")
      setSelectedPatient(patient);
      setAppointmentModalShow(false);
      fetchAppointments(patient.id);
    
    }
  
    async function deleteAppointmentById({ id }) {

      try {
        console.log("inside delete appointment " + id);
        const newAppointmentArray = appointments.filter(appointment => appointment.id !== id);
        setAppointments(newAppointmentArray);
        await API.graphql({ query: deleteAppointment, variables: { input: { id } }});
 

      }catch (e) {
          console.error('error deleting appointment', e);
          setErrorMessages(e.errors);
      }
    
    }
    

    return (
        <div className='patient'>
          <div className='container info-holder'>
            <div className="name-container">
              <p className='name'>
                {patient.firstName} {patient.lastName}
                <span style={{verticalAlign: 'text-bottom'}}><FaIcons.FaEdit style={{cursor: 'pointer'}} onClick={() => openUpdatePatientModal(patient)}/></span>
              </p>
              <p className='name'>Email - {patient.email}</p>
              <p>Phone - {patient.phone}</p>
              <p>Address - {patient.address}</p>
              <p>DOB - {patient.birthDate ? patient.birthDate.substring(0,"yyy-mm-dd".length+1) : ""}</p>
              <p>Insurance - {patient.insuranceNumber}</p>
            </div>
          </div>
              <UpdatePatientModal
                  show={updateModalShow}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInfo(patient.id)}
                  onHide={() => setUpdateModalShow(false)}
                />

        <div className='container'>
          <h5 className='text-left'>Treatments</h5>
          <Button 
            className='appointment-btn'
            variant="success"
            size="sm"
            onClick={() => openAppointment(patient)}
          >
            Take Another Appointment
          </Button>
          <Tabs
            defaultActiveKey="upcoming"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="ongoing" title="Ongoing">
              <div className="home">
              <table>
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Treated by</th>
                    <th>Prescription</th>
                    <th>Description</th>
                  </tr>
                </thead>
              <tbody>
              {
              prescriptions.map(prescription => (
                
                    <tr key={prescription.id} >
                        {/* <td>{prescription.id}</td> */}
                      <td>{prescription.doctor != null ? prescription.doctor.firstName +" "+prescription.doctor.lastName : ""}</td>
                      <td>
                            {
                              prescription.content && <a href={prescription.content} download={prescription.fileName}>
                                {
                                
                                  <AmplifyS3Image level="public" imgKey={prescription.fileName} alt={prescription.fileName.slice(prescription.fileName.lastIndexOf('/') + 1)} /> 
                                }
                              </a>
                            }
                          </td>
                      <td>{prescription.description != null ?  prescription.description : ""} </td>              
                    </tr>
                  ))
                }
              </tbody>
              </table>
              </div>
            </Tab>
            <Tab eventKey="upcoming" title="Upcoming">
              <div className="profile">
              <table>
                <thead>
                  <tr>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Doctor Appointed</th>
                    <th>Medical condition</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {
                appointments.map(appointment => (
                      <tr key={appointment.id || appointment.appointmentDate} >
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td> {appointment.doctor != null ? appointment.doctor.firstName +" "+appointment.doctor.lastName : ""}</td>
                        <td>{appointment.description != null ?  appointment.description : ""} </td>
                        <td><button onClick={() => deleteAppointmentById(appointment)}>Delete</button></td>
                        
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              </div>
            </Tab>
          </Tabs>
        </div>
            <div style={{marginTop: '10px'}}>
              <Container>
              
              </Container>
          
            </div>

            <Appointment
                  show={updateAppointmentModalShow}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInfo(patient.id)}
                  onHide={() => onHideAppointmentModal(patient)}
                />
        </div>
    );
}

