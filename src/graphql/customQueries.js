export const listAppointmentByPatient = /* GraphQL*/ `
query listAppointmentByPatient($patientId: ID!,$appointmentDate: String!) {
  listAppointments(filter: {patientId: {eq: $patientId}, appointmentDate: {ge: $appointmentDate}}) {
    items {
      id
      appointmentDate
      appointmentTime
      doctorId
      patientId
      description
      doctor {
        firstName
        lastName
      }
      patient{
        email
      }
    }
  }
}
`;

export const listAppointmentByDoctor =  /* GraphQL*/  `
query listAppointmentByDoctor($doctorId: ID!, $appointmentDate: String!) {
  listAppointments(filter: {doctorId: {eq: $doctorId}, appointmentDate: {eq: $appointmentDate}}) {
    items {
      id
      appointmentDate
      appointmentTime
      doctorId
      patientId
      description
      patient {
        firstName
        lastName
        phone
      }
    }
  }
}
`;

export const listPrescriptionByappointmentId = /* GraphQL*/ `
  query listPrescriptionByappointmentId($appointmentId: ID!, $patientId: ID!) {
    listPrescriptions(filter: {appointmentId: {eq: $appointmentId}, patientId: {eq: $patientId}}) {
      items {
        id
        appointmentId
        patientId
        fileName
        description
        createdAt
        updatedAt
      }
    }
  }
`;

export const listPrescriptionByPatient = /* GraphQL*/ `
query listPrescriptionByPatient($patientId: ID!) {
  listPrescriptions(filter: {patientId: {eq: $patientId}}) {
    items {
      id
      appointmentId
      patientId
      doctorId
      fileName
      patientId
      description
      doctor {
        firstName
        lastName
      }
    }
  }
}
`;