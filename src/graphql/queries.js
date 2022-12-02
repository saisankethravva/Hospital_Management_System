/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPatient = /* GraphQL */ `
  query GetPatient($id: ID!) {
    getPatient(id: $id) {
      id
      firstName
      lastName
      insuranceNumber
      ssn
      birthDate
      phone
      address
      sex
      email
      createdAt
      updatedAt
    }
  }
`;
export const listPatients = /* GraphQL */ `
  query ListPatients(
    $filter: ModelPatientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        insuranceNumber
        ssn
        birthDate
        phone
        address
        sex
        email
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDoctor = /* GraphQL */ `
  query GetDoctor($id: ID!) {
    getDoctor(id: $id) {
      id
      firstName
      lastName
      phone
      address
      createdAt
      updatedAt
    }
  }
`;
export const listDoctors = /* GraphQL */ `
  query ListDoctors(
    $filter: ModelDoctorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoctors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        phone
        address
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPrescription = /* GraphQL */ `
  query GetPrescription($id: ID!) {
    getPrescription(id: $id) {
      id
      appointmentId
      patientId
      doctorId
      fileName
      description
      doctor {
        id
        firstName
        lastName
        phone
        address
        createdAt
        updatedAt
      }
      patient {
        id
        firstName
        lastName
        insuranceNumber
        ssn
        birthDate
        phone
        address
        sex
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPrescriptions = /* GraphQL */ `
  query ListPrescriptions(
    $filter: ModelPrescriptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPrescriptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        appointmentId
        patientId
        doctorId
        fileName
        description
        doctor {
          id
          firstName
          lastName
          phone
          address
          createdAt
          updatedAt
        }
        patient {
          id
          firstName
          lastName
          insuranceNumber
          ssn
          birthDate
          phone
          address
          sex
          email
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAppointment = /* GraphQL */ `
  query GetAppointment($id: ID!) {
    getAppointment(id: $id) {
      id
      patientId
      doctorId
      appointmentDate
      appointmentTime
      description
      patient {
        id
        firstName
        lastName
        insuranceNumber
        ssn
        birthDate
        phone
        address
        sex
        email
        createdAt
        updatedAt
      }
      doctor {
        id
        firstName
        lastName
        phone
        address
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAppointments = /* GraphQL */ `
  query ListAppointments(
    $filter: ModelAppointmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAppointments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        patientId
        doctorId
        appointmentDate
        appointmentTime
        description
        patient {
          id
          firstName
          lastName
          insuranceNumber
          ssn
          birthDate
          phone
          address
          sex
          email
          createdAt
          updatedAt
        }
        doctor {
          id
          firstName
          lastName
          phone
          address
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getService = /* GraphQL */ `
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      serviceName
      serviceDescription
      createdAt
      updatedAt
    }
  }
`;
export const listServices = /* GraphQL */ `
  query ListServices(
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        serviceName
        serviceDescription
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
