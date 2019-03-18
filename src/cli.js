const Ajv = require('ajv')
const { addMonths, format } = require('date-fns')
const yaml = require('node-yaml')
const open = require('opn')
const path = require('path')

import renderInvoice from './renderInvoice'
import schema from './schema'

export default async function main() {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    console.error('usage: invoice <path-to-invoice-file.yaml>+')
    console.error('       invoice --new')
    process.exit(1)
  }

  if (args.length === 1 && args[0] === '--new') {
    console.log(newInvoice())
    process.exit()
  }

  const validate = new Ajv().compile(schema)
  const pieces = args.map(filePath => yaml.readSync(path.resolve(filePath)))
  const invoice = Object.assign(...pieces)
  const valid = validate(invoice)

  if (!valid) {
    console.error(validate.errors)
    process.exit(2)
  }

  const outPath = await renderInvoice(invoice)
  console.log('Rendered the invoice.')
  console.log(outPath)
  open(outPath)
  process.exit()
}

function newInvoice() {
  const today = new Date()
  return `Details:
  Invoice number: HL${format(today, 'YYMMDD')}
  Date issued: ${format(today, 'DD.MM.YYYY')}
  Date due: ${format(addMonths(today, 1), 'DD.MM.YYYY')}
Issued to:
  Name: TODO
  Address:
    - TODO ADDRESS
    - TODO ADDRESS
Charges:
  - Description: TODO
    Unit price: 99999
    Units: 99
`
}
