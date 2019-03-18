import React from 'react'
import ReactPDF, { Font } from '@react-pdf/renderer'
import tempy from 'tempy'

import Invoice from './Invoice'

export default async function renderInvoice(invoice) {
  const fonts = {
    'Roboto Regular': __dirname + '/../fonts/Roboto/Roboto-Regular.ttf',
    'Roboto Condensed Regular':
      __dirname + '/../fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf',
    'Roboto Condensed Bold':
      __dirname + '/../fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf',
  }

  for (const [family, path] of Object.entries(fonts)) {
    Font.register(path, { family })
  }

  const outPath = tempy.file({ extension: 'pdf' })
  await ReactPDF.render(<Invoice invoice={invoice} />, outPath)
  return outPath
}
