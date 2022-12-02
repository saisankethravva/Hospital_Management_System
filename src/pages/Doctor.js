import { API, Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { getDoctor,  } from '../graphql/queries';
import { listAppointmentByDoctor } from '../graphql/customQueries';
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import UpdateDoctorModal from "./UpdateDoctorModal";
import AddPrescriptionModal from "./AddPrescriptionModal";
import ViewPrescriptionModal from "./ViewPrescriptionModal";
import * as FaIcons from 'react-icons/fa';

export default function Doctor() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [doctor, setDoctor] = useState({ });
    const [appointments, setAppointments] = useState([]);
    const [appointment, setAppointment] = useState({});
    const [errorMessages, setErrorMessages] = useState([]);
    const history = useHistory();
    const [updateModalShow, setUpdateModalShow] = React.useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState([]);
    const [addModalShow, setAddModalShow] = React.useState(false);
    const [viewModalShow, setViewModalShow] = React.useState(false);

    useEffect(() => {
      fetchUserData();
      }, []);

    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          getDoctorInfo(userSession.signInUserSession.accessToken.payload.username);
          fetchAppointments(userSession.signInUserSession.accessToken.payload.username);
          setUserData(userSession.signInUserSession.accessToken);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    async function getDoctorInfo(userName) {
        try {
          //alert(userName)
          const apiData = await API.graphql({ query: getDoctor, variables: { id: userName } } );
          if (apiData.data.getDoctor == null) {
            history.push("/createdoctor")
          }
          setDoctor(apiData.data.getDoctor);
        } catch (e) {
            console.error('error fetching doctor', e);
            setErrorMessages(e.errors);
        }
      }

    async function fetchAppointments(userName) {
      //alert(userName)
      try {
        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
        const apiData = await API.graphql({ query: listAppointmentByDoctor, variables: { doctorId: userName, appointmentDate: dateString }  });
        console.log(apiData)
        setAppointments(apiData.data.listAppointments.items);
      } catch (e) {
          console.error('error fetching appointments', e);
          setErrorMessages(e.errors);
      }
    }
    
    function openUpdateDoctorModal(doctor) {
      setSelectedDoctor(doctor);
      setUpdateModalShow(true);
    }

    return (
        <div className='doctor'>
          <h3>Doctor Portal</h3>
              <div>
                    <div className='z-index-set'>
                      <Row className="align-items-center">
                        <Col style={{ fontSize: "1rem" }}>
                          <FaIcons.FaLaptopMedical style={{fontSize: '24px', marginRight: '5px',}} />
                          <b>First Name: </b> {doctor.firstName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Last Name:</b> {doctor.lastName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Phone:</b> {doctor.phone}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Address:</b> {doctor.address}
                        </Col>
                        <Col>
                            {/* <Button
                              variant="success"
                              block
                              size="sm"
                              onClick={() => openUpdateDoctorModal(doctor)}
                            >
                              Update
                            </Button> */}
                            <span style={{verticalAlign: 'text-bottom'}}><FaIcons.FaEdit style={{cursor: 'pointer'}} onClick={() => openUpdateDoctorModal(doctor)}/></span>
                        </Col>
                      </Row>
                    </div>
              </div>
              <UpdateDoctorModal
                  show={updateModalShow}
                  doctor={selectedDoctor}
                  onUpdated={() => getDoctorInfo(doctor.id)}
                  onHide={() => setUpdateModalShow(false)}
                />
            <div className='header-container'>
             <h4 style={{marginTop: '10px'}}>Today's Appointments</h4>
            </div>
            <div >
              <table>
                <thead>
                  <tr>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Patient</th>
                    <th>Phone</th>
                    <th>Reason for visit</th>
                    <th>View Prescription</th>
                    <th>Download Prescription</th>
                  </tr>
                </thead>
                <tbody>
                {
                appointments.map(appointment => (
                      <tr key={appointment.id || appointment.appointmentDate} >
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td> {appointment.patient != null ? appointment.patient.firstName +" "+appointment.patient.lastName : ""}</td>
                        <td>{appointment.patient.phone}</td>
                        <td>{appointment.description}</td>
                        <td><button onClick={() =>{ setAppointment(appointment);setAddModalShow(true)}}>Upload Prescription</button></td> 
                        <td><button onClick={() =>{ setAppointment(appointment);setViewModalShow(true)}}>View Prescription</button></td> 
                      </tr>
                    ))
                  }
                </tbody>
            </table>
          </div>
          <AddPrescriptionModal
                  show={addModalShow}
                  appointment={appointment}
                  onUploaded={() => fetchUserData()}
                  onHide={() => setAddModalShow(false)}
                />
           <ViewPrescriptionModal
                  show={viewModalShow}
                  appointment={appointment}
                  onFetched={() => fetchUserData()}
                  onHide={() => setViewModalShow(false)}
                />
      </div>
    );
}

