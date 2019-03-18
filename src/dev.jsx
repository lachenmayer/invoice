import React from 'react'
import ReactDOM from 'react-dom'
import { PDFViewer, Font } from '@react-pdf/renderer'

import Invoice from './Invoice'

const exampleInvoice = {
  Issuer: {
    Name: 'Example Person',
    Address: ['123 Example Road', 'Example City'],
  },
  Currency: '$',
  'Payment details': {
    Name: 'Example Person',
    Bank: 'Example Bank',
    Branch: 'Example Branch',
    'Sort Code': '12-34-56',
    'Account No.': 123456789,
  },
  Details: {
    'Invoice number': 'ABC123',
    'Date issued': '01.01.2018',
    'Date due': '01.01.2118',
  },
  'Issued to': {
    Name: 'Someone Else',
    Address: ['321 Example Road', 'Example City'],
  },
  Charges: [
    { Description: 'Did loads of work', 'Unit price': 999, Units: 2 },
    { Description: 'Did even more work', 'Unit price': 999, Units: 5 },
  ],
}

const absoluteFill = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}

function App() {
  return (
    <main style={absoluteFill}>
      <PDFViewer width="100%" height="100%">
        <Invoice invoice={exampleInvoice} />
      </PDFViewer>
    </main>
  )
}

const fonts = {
  'Roboto Regular': require('../fonts/Roboto/Roboto-Regular.ttf'),
  'Roboto Condensed Regular': require('../fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf'),
  'Roboto Condensed Bold': require('../fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf'),
}

for (const [family, path] of Object.entries(fonts)) {
  Font.register(`${location.origin}/${path}`, { family })
}

ReactDOM.render(<App />, document.querySelector('main'))
