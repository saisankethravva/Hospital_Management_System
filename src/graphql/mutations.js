/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPatient = /* GraphQL */ `
  mutation CreatePatient(
    $input: CreatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    createPatient(input: $input, condition: $condition) {
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
export const updatePatient = /* GraphQL */ `
  mutation UpdatePatient(
    $input: UpdatePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    updatePatient(input: $input, condition: $condition) {
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
export const deletePatient = /* GraphQL */ `
  mutation DeletePatient(
    $input: DeletePatientInput!
    $condition: ModelPatientConditionInput
  ) {
    deletePatient(input: $input, condition: $condition) {
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
export const createDoctor = /* GraphQL */ `
  mutation CreateDoctor(
    $input: CreateDoctorInput!
    $condition: ModelDoctorConditionInput
  ) {
    createDoctor(input: $input, condition: $condition) {
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
export const updateDoctor = /* GraphQL */ `
  mutation UpdateDoctor(
    $input: UpdateDoctorInput!
    $condition: ModelDoctorConditionInput
  ) {
    updateDoctor(input: $input, condition: $condition) {
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
export const deleteDoctor = /* GraphQL */ `
  mutation DeleteDoctor(
    $input: DeleteDoctorInput!
    $condition: ModelDoctorConditionInput
  ) {
    deleteDoctor(input: $input, condition: $condition) {
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
export const createPrescription = /* GraphQL */ `
  mutation CreatePrescription(
    $input: CreatePrescriptionInput!
    $condition: ModelPrescriptionConditionInput
  ) {
    createPrescription(input: $input, condition: $condition) {
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
export const updatePrescription = /* GraphQL */ `
  mutation UpdatePrescription(
    $input: UpdatePrescriptionInput!
    $condition: ModelPrescriptionConditionInput
  ) {
    updatePrescription(input: $input, condition: $condition) {
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
export const deletePrescription = /* GraphQL */ `
  mutation DeletePrescription(
    $input: DeletePrescriptionInput!
    $condition: ModelPrescriptionConditionInput
  ) {
    deletePrescription(input: $input, condition: $condition) {
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
export const createAppointment = /* GraphQL */ `
  mutation CreateAppointment(
    $input: CreateAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    createAppointment(input: $input, condition: $condition) {
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
export const updateAppointment = /* GraphQL */ `
  mutation UpdateAppointment(
    $input: UpdateAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    updateAppointment(input: $input, condition: $condition) {
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
export const deleteAppointment = /* GraphQL */ `
  mutation DeleteAppointment(
    $input: DeleteAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    deleteAppointment(input: $input, condition: $condition) {
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
export const createService = /* GraphQL */ `
  mutation CreateService(
    $input: CreateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    createService(input: $input, condition: $condition) {
      id
      serviceName
      serviceDescription
      createdAt
      updatedAt
    }
  }
`;
export const updateService = /* GraphQL */ `
  mutation UpdateService(
    $input: UpdateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    updateService(input: $input, condition: $condition) {
      id
      serviceName
      serviceDescription
      createdAt
      updatedAt
    }
  }
`;
export const deleteService = /* GraphQL */ `
  mutation DeleteService(
    $input: DeleteServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    deleteService(input: $input, condition: $condition) {
      id
      serviceName
      serviceDescription
      createdAt
      updatedAt
    }
  }
`;
