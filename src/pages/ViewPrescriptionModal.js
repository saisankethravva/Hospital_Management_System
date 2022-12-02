import React, { useState, useEffect} from "react";
import Modal from "react-bootstrap/Modal";
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { API, Storage } from 'aws-amplify';
import { listPrescriptionByappointmentId } from '../graphql/customQueries';
import { deletePrescription as deletePrescriptionMutation } from '../graphql/mutations';

export default function ViewPrescriptionModal(props) {
  const [prescriptions, setPrescription] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
      async function fetchData() {
        fetchPrescription(props.appointment.id, props.appointment.patientId);
      }
      
      if (props.show){
          fetchData();
      }
  }, [props.show]);

  async function fetchPrescription(appointmentId, patientId) {
    try {
      const apiData = await API.graphql({ query: listPrescriptionByappointmentId, variables: { appointmentId: appointmentId, patientId: patientId }  });
      const prescriptionFromAPI = apiData.data.listPrescriptions.items;

      await Promise.all(prescriptionFromAPI.map(async prescription => {
      const content = await Storage.get(prescription.fileName,{ level: "public", });
      prescription.content = content;
      return prescription;
      }))

      setPrescription(apiData.data.listPrescriptions.items);
    } catch (e) {
        console.error('error fetching prescription', e);
        setErrorMessages(e.errors);
    }
  }

  async function deletePrescription(prescription) {
    await API.graphql({ query: deletePrescriptionMutation, variables: { input: { id: prescription.id } } });
    await Storage.remove(prescription.fileName,{ level: "public", });
    props.onFetched();
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
         Prescription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Description</th>
              <th>Created</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
         <tbody>
            {
              prescriptions.map(prescription => (
                <tr key={prescription.id}>
                  {/* <td>{prescription.id}</td> */}
                  <td>{prescription.description}</td>
                  <td>{prescription.createdAt}</td>
                  <td>
                    {
                      prescription.content && <a href={prescription.content} download={prescription.fileName}>
                        {
                          <AmplifyS3Image level="public" imgKey={prescription.fileName} alt={prescription.fileName.slice(prescription.fileName.lastIndexOf('/') + 1)} /> 
                        }
                      </a>
                    }
                  </td>
                  <td><button onClick={() => deletePrescription(prescription)}>Delete prescription</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
}