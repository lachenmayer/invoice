#!/usr/bin/env node
const Ajv = require('ajv')
const { addMonths, format } = require('date-fns')
const fs = require('fs')
const { createServer } = require('http')
const h = require('hyperscript')
const yaml = require('node-yaml')
const open = require('opn')

const schema = require('./schema')

function main() {
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
  const pieces = args.map(path => yaml.readSync(path))
  const invoice = Object.assign(...pieces)
  const valid = validate(invoice)

  if (!valid) {
    console.error(validate.errors)
    process.exit(2)
  }

  serve(invoice)
}
main()

function person(element, person) {
  return h(
    element,
    h(`.name`, person.Name),
    h(`.address`, person.Address.map(line => h('.address-line', line)))
  )
}

function itemized(object) {
  return h(
    'table',
    Object.entries(object).map(([name, value]) =>
      h('tr', h('td', name), h('td.value', value))
    )
  )
}

function money(number) {
  return number ? number.toFixed(2) : ''
}

function charges(invoice) {
  const totals = invoice.Charges.map(
    charge => charge['Unit price'] * (charge.Units || 1)
  )
  const total = totals.reduce((a, b) => a + (b || 0), 0)
  return h(
    'table#charges',
    h(
      'tr',
      h('th', 'Description'),
      h('th', 'Units'),
      h('th', `Unit price (${invoice.Currency})`),
      h('th', `Total (${invoice.Currency})`)
    ),
    invoice.Charges.map((charge, i) =>
      h(
        'tr',
        h('td.description', charge.Description),
        h('td.value', charge.Units),
        h('td.value', money(charge['Unit price'])),
        h('td.value', money(totals[i]))
      )
    ),
    h(
      'tr.summary',
      h('td'),
      h('td'),
      h('td.heading', `Net total (${invoice.Currency})`),
      h('td.value', money(total))
    ),
    h('tr', h('td'), h('td'), h('td.heading', 'VAT'), h('td.value', '0.00')),
    h(
      'tr',
      h('td'),
      h('td'),
      h('td.heading', `Total (${invoice.Currency})`),
      h('td.value', h('strong', money(total)))
    )
  )
}

function page(title, ...contents) {
  const style = fs.readFileSync('./style.css', 'utf8')

  return h(
    'html',
    h(
      'head',
      h('meta', { charset: 'UTF-8' }),
      h('title', title),
      h('style', style)
    ),
    h('body', ...contents, h('script', 'window.print()'))
  ).outerHTML
}

function html(invoice) {
  return page(
    invoice.Details['Invoice number'],
    person('#issuer', invoice.Issuer),
    h('h1', 'Invoice'),
    h(
      '#info',
      h('div', h('h2', 'To:'), person('#to', invoice['Issued to'])),
      h('#details', itemized(invoice.Details))
    ),
    charges(invoice),
    h('h2', 'Payment details'),
    itemized(invoice['Payment details'])
  )
}

function serve(invoice) {
  createServer((req, res) => {
    res.end(html(invoice))
  }).listen(5000, () => {
    console.log('Your invoice is ready at http://localhost:5000/')
    open('http://localhost:5000')
  })
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
