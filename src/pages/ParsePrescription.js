import React, { useState, useEffect } from "react";
import Predictions from '@aws-amplify/predictions';

export default function ParsePrescription() {

  const [prescriptionData, setPrescriptionData] = useState([]);

  useEffect(() => {
    // see https://docs.amplify.aws/lib/predictions/identify-text/q/platform/js/#working-with-the-api
    Predictions.identify({
      text: {
        source: { level: "private", key: "medical-prescription-ocr.png" },
        format: "FORM" // use Amazon Textract
      }
    })
      .then(response => { setPrescriptionData(response.text.keyValues); console.log(response.text.keyValues) })
      .catch(err => console.log({ err }));
  }, []);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {
            prescriptionData.map(row => (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td>{row.value.text}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}