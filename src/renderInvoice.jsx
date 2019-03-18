import React from 'react'
import ReactPDF from '@react-pdf/renderer'
import tempy from 'tempy'

import Invoice from './Invoice'
import registerFonts from './registerFonts'

export default async function renderInvoice(invoice) {
  registerFonts({
    'Roboto Regular': __dirname + '/../fonts/Roboto/Roboto-Regular.ttf',
    'Roboto Condensed Regular':
      __dirname + '/../fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf',
    'Roboto Condensed Bold':
      __dirname + '/../fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf',
  })
  const outPath = tempy.file({ extension: 'pdf' })
  await ReactPDF.render(<Invoice invoice={invoice} />, outPath)
  return outPath
}
