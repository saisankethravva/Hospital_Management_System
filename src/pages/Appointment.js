import React, { useState, useRef, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form, { Select } from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { createAppointment } from '../graphql/mutations';
import { listDoctors } from '../graphql/queries';
import { API } from 'aws-amplify';
import { listAppointments } from '../graphql/queries';

export default function Appointment(props) {
  const appointment = useRef(null);
  const [doctors, setDoctors]= useState([]);
  const date =  new Date();
  const [errorMessages, setErrorMessages] = useState([]);
  const [appointmentDate,setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointTime] = useState(null);
  const [preferredDoctor,setPreferredDoctor] = useState("")
  const [reasonForVisit,setReasonForVisit] = useState("")
  const [userData, setUserData] = useState({ payload: { username: '' } });
  const [fields, handleFieldChange] = useFormFields({
    appointmentDate: date.getDate,
    appointmentTime: date.getTime
  });

  useEffect(() => {
    fetchDoctors();
    }, []);

  function validateForm() {
    try {
      return (
        fields.appointmentDate !==  null &&
        fields.appointmentTime !==  null &&
        fields.doctorId !== null &&
        fields.description !== ""
      );
    } catch (e) {
      return false;
    }
  }

  function handleAppointmentChange(event) {
    validateForm();
  }

  async function fetchDoctors() {
    console.log("inside fetch doctors" );
    try {
        const apiData = await API.graphql({ query: listDoctors });
        console.log(apiData.data.listDoctors.items);
        setDoctors(apiData.data.listDoctors.items);
    }catch(e){
        console.error('error fetching doctors', e);
        setErrorMessages(e.errors);
    }
    
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  const handleSubmit = async () =>{
   // event.preventDefault();
   try {

    // alert(preferredDoctor)
     //console.log(props.id)
     //console.log("props",props)
     const apiData = await API.graphql({ query: listAppointments });
     //setListApp(apiData.data.listAppointments.items);
     var f=0;
     for (let x in apiData.data.listAppointments.items) {
       console.log("Prescrip1",apiData.data.listAppointments.items[x].appointmentDate);
       console.log("Prescrip1",apiData.data.listAppointments.items[x].appointmentTime);
       console.log("Prescrip1",apiData.data.listAppointments.items[x].doctorId);
       console.log("Prescrip22",appointmentTime);
       console.log("Prescrip22",appointmentDate);
       var j = appointmentTime.split(":");
       j[0]=parseInt(j[0]);
       j[1]=parseInt(j[1]);
       var j1=[...j];
       console.log("appointmentTime1",j,j1);
       if(j[1]>=30){
         j[1]=j[1]-30;
         j[0]+=1;
       }
       else{
         j[1]+=30;
       }
       if(j1[1]<=30){
         j1[1]=j1[1]+30;
         j1[0]-=1;
       }
       else{
         j1[1]-=30;
       }
       // var j = appointmentTime + 0.5 * 60 * 60 * 1000;
       // appointmentTime.setTime(appointmentTime + 1 * 60 * 60 * 1000);
       console.log("appointmentTime2",j,j1,(j1[0]+":"+j1[1]),typeof(j1[0]+":"+j1[1]));
       if (apiData.data.listAppointments.items[x].appointmentDate === appointmentDate && apiData.data.listAppointments.items[x].appointmentTime >(j1[0]+":"+j1[1]) && apiData.data.listAppointments.items[x].appointmentTime <(j[0]+":"+j[1]) && apiData.data.listAppointments.items[x].doctorId === preferredDoctor){
         f=1;
         alert("This time slot is already booked");
         break;
       }
       
     }
     if (f=== 0) {
     console.log("Prescrip2",apiData.data.listAppointments.items, apiData.data.listAppointments.items.length);
       await API.graphql({ query: createAppointment, variables: { input: {patientId:props.patient.id , doctorId:preferredDoctor, appointmentDate: appointmentDate, appointmentTime: appointmentTime,
          description:reasonForVisit } } });
          alert("Appointment Done!");
          fields.appointmentTime = date.getDate;
          fields.appointmentDate = date.getTime;
          fields.doctorId = "";
          fields.description = "";
          props.onUpdated();
          props.onHide();
     }
     } catch (e) {
       console.error('error taking appointment', e);
       setErrorMessages(e.errors);
     }
     // alert("Appointment Done!");
     // fields.appointmentTime = date.getDate;
     // fields.appointmentDate = date.getTime;
     // fields.doctorId = "";
     // fields.description = "";
     // props.onUpdated();
     // props.onHide();
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
          Appointment Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e)=>handleSubmit(e.preventDefault())}>
          <Form.Group controlId="appointmentDate">
            <Form.Label>Appointment Date</Form.Label>
            <Form.Control min = {formatDate(date)}
              value={appointmentDate}
              type="date"
              onChange={(e)=>setAppointmentDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="appointmentTime">
            <Form.Label>Appointment Time (Doctors are available between 09:00 AM and 10:00 PM)</Form.Label>
            <Form.Control
              min="09:00" max="22:00"
              value={appointmentTime}
              type="time"
              onChange={(e)=>setAppointTime(e.target.value)}
              required
            />
          </Form.Group>
        <Form.Group controlId="doctorId">
            <Form.Label>Preferred Doctor</Form.Label>
            <Form.Control 
            as="select" onChange={(e)=>setPreferredDoctor(e.target.value)}
            >
              <option key="" value="preferred doctor"> Preferred Doctor</option>
                   {
          doctors.map(doctor => (
                 <option  key={doctor.id || doctor.firstName} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>  
                
              ))
            }  

            </Form.Control>
        </Form.Group>   

        <Form.Group controlId="description">
            <Form.Label>Reason for visit</Form.Label>
            <Form.Control
              
              value={reasonForVisit}
              type="text"
              onChange={(e)=>setReasonForVisit(e.target.value)}
            />
          </Form.Group>  
          <Button block type="submit" size="lg" disabled={!validateForm()}>
            Take Appointment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}