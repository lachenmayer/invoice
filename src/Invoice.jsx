import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

export default function Invoice({ invoice }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Issuer issuer={invoice.Issuer} />
        <Heading>Invoice</Heading>
        <Row>
          <IssuedTo to={invoice['Issued to']} />
          <Details details={invoice.Details} />
        </Row>
        <Charges charges={invoice.Charges} currency={invoice.Currency} />
        <PaymentDetails details={invoice['Payment details']} />
      </Page>
    </Document>
  )
}

function Issuer({ issuer }) {
  return (
    <FloatRight>
      <View style={styles.issuer}>
        <Name>{issuer.Name}</Name>
        {issuer.Address.map((line, i) => (
          <AddressLine key={i}>{line}</AddressLine>
        ))}
      </View>
    </FloatRight>
  )
}

function IssuedTo({ to }) {
  return (
    <View>
      <Label>To:</Label>
      <Name>{to.Name}</Name>
      {to.Address.map((line, i) => (
        <AddressLine key={i}>{line}</AddressLine>
      ))}
    </View>
  )
}

function Details({ details }) {
  return <Itemized items={details} style={styles.details} />
}

function Charges({ charges, currency }) {
  const subtotals = charges.map(
    charge => charge['Unit price'] * (charge.Units || 1)
  )
  const total = subtotals.reduce((a, b) => a + (b || 0), 0)
  const columns = [
    {
      heading: 'Description',
      label: true,
      value: charge => charge.Description,
      width: 0.57,
    },
    {
      heading: 'Units',
      value: charge => charge.Units,
      width: 0.08,
    },
    {
      heading: `Unit Price (${currency})`,
      value: charge => money(charge['Unit price']),
      width: 0.2,
    },
    {
      heading: `Total (${currency})`,
      value: (_, i) => money(subtotals[i]),
      width: 0.2,
    },
  ]
  const summaries = [
    {
      label: `Net total (${currency})`,
      value: money(total),
    },
    {
      label: 'VAT',
      value: '0.00',
    },
    {
      label: `Total (${currency})`,
      value: money(total),
    },
  ]
  return (
    <View style={styles.charges}>
      <Row>{columns.map(renderHeading)}</Row>
      {charges.map(renderCharge)}
      <View style={styles.ruler} />
      {summaries.map(renderSummary)}
    </View>
  )

  function renderHeading(column, i) {
    const textAlign = column.label ? 'left' : 'right'
    return (
      <TableHeading key={i} width={column.width} style={{ textAlign }}>
        {column.heading}
      </TableHeading>
    )
  }

  function renderCharge(charge, i) {
    return (
      <Row key={i}>
        {columns.map((column, j) => {
          const TableContent = column.label ? TableLabel : TableNumber
          return (
            <TableContent width={column.width} key={j}>
              {column.value(charge, i)}
            </TableContent>
          )
        })}
      </Row>
    )
  }

  function renderSummary(summary, i) {
    return (
      <Row key={i}>
        {columns.slice(0, -2).map((column, i) => (
          <TableLabel key={i} width={column.width} />
        ))}
        <TableLabel width={columns[columns.length - 2].width}>
          {summary.label}
        </TableLabel>
        <TableNumber width={columns[columns.length - 1].width}>
          {summary.value}
        </TableNumber>
      </Row>
    )
  }
}

function PaymentDetails({ details }) {
  return <Itemized items={details} style={{ width: '50%' }} />
}

//
// Layout components
//

function FloatRight({ children }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }} />
      {children}
    </View>
  )
}

function Itemized({ items, style }) {
  return (
    <View style={style}>
      {Object.entries(items).map(([label, value], i) => (
        <Row
          key={i}
          style={{ marginTop: itemizedMargin, marginBottom: itemizedMargin }}
        >
          <Label>{label}</Label>
          <Number>{value}</Number>
        </Row>
      ))}
    </View>
  )
}

function Row({ children, style }) {
  return (
    <View
      style={[{ flexDirection: 'row', justifyContent: 'space-between' }, style]}
    >
      {children}
    </View>
  )
}

function TableHeading({ width, children, style }) {
  return (
    <View style={[{ flex: width, margin: tableMargin }, style]}>
      <Text style={text('Roboto Condensed Bold', 1)}>{children}</Text>
    </View>
  )
}

function TableLabel({ width, children, style }) {
  return (
    <View style={[{ flex: width, margin: tableMargin }, style]}>
      <Label>{children}</Label>
    </View>
  )
}

function TableNumber({ width, children, style }) {
  return (
    <View style={[{ flex: width, margin: tableMargin }, style]}>
      <Number style={{ textAlign: 'right' }}>{children}</Number>
    </View>
  )
}

function Heading({ children }) {
  return (
    <Text
      style={[
        text('Roboto Condensed Bold', 2),
        { marginTop: baseline, marginBottom: baseline },
      ]}
    >
      {children}
    </Text>
  )
}

//
// Text components
//

function Name({ children }) {
  return <Text style={text('Roboto Condensed Bold')}>{children}</Text>
}

function AddressLine({ children }) {
  return <Text style={text('Roboto Condensed Regular')}>{children}</Text>
}

function Label({ children }) {
  return <Text style={text('Roboto Condensed Regular')}>{children}</Text>
}

function Number({ children, style }) {
  return <Text style={[text('Roboto Regular'), style]}>{children}</Text>
}

//
// Styles
//

const baseline = 14
const tableMargin = baseline * 0.5
const itemizedMargin = baseline * 0.5

const styles = StyleSheet.create({
  page: {
    padding: baseline * 3,
  },
  issuer: {
    margin: baseline,
  },
  details: {
    flex: 0.5,
  },
  charges: {
    marginTop: baseline * 3,
    marginBottom: baseline * 3,
  },
  ruler: {
    height: StyleSheet.hairlineWidth,
    marginTop: baseline,
    marginBottom: baseline,
    backgroundColor: 'black',
  },
})

function text(fontFamily, size = 1) {
  return {
    fontFamily,
    fontSize: size * baseline,
  }
}

function money(number) {
  return number ? number.toFixed(2) : ''
}
