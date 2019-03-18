// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"crut":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Invoice;

var _react = _interopRequireDefault(require("react"));

var _renderer = require("@react-pdf/renderer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Invoice({
  invoice
}) {
  return _react.default.createElement(_renderer.Document, null, _react.default.createElement(_renderer.Page, {
    style: styles.page
  }, _react.default.createElement(Issuer, {
    issuer: invoice.Issuer
  }), _react.default.createElement(Heading, null, "Invoice"), _react.default.createElement(Row, null, _react.default.createElement(IssuedTo, {
    to: invoice['Issued to']
  }), _react.default.createElement(Details, {
    details: invoice.Details
  })), _react.default.createElement(Charges, {
    charges: invoice.Charges,
    currency: invoice.Currency
  }), _react.default.createElement(PaymentDetails, {
    details: invoice['Payment details']
  })));
}

function Issuer({
  issuer
}) {
  return _react.default.createElement(FloatRight, null, _react.default.createElement(_renderer.View, {
    style: styles.issuer
  }, _react.default.createElement(Name, null, issuer.Name), issuer.Address.map((line, i) => _react.default.createElement(AddressLine, {
    key: i
  }, line))));
}

function IssuedTo({
  to
}) {
  return _react.default.createElement(_renderer.View, null, _react.default.createElement(Label, null, "To:"), _react.default.createElement(Name, null, to.Name), to.Address.map((line, i) => _react.default.createElement(AddressLine, {
    key: i
  }, line)));
}

function Details({
  details
}) {
  return _react.default.createElement(Itemized, {
    items: details,
    style: styles.details
  });
}

function Charges({
  charges,
  currency
}) {
  const subtotals = charges.map(charge => charge['Unit price'] * (charge.Units || 1));
  const total = subtotals.reduce((a, b) => a + (b || 0), 0);
  const columns = [{
    heading: 'Description',
    label: true,
    value: charge => charge.Description,
    width: 0.57
  }, {
    heading: 'Units',
    value: charge => charge.Units,
    width: 0.08
  }, {
    heading: `Unit Price (${currency})`,
    value: charge => money(charge['Unit price']),
    width: 0.2
  }, {
    heading: `Total (${currency})`,
    value: (_, i) => money(subtotals[i]),
    width: 0.2
  }];
  const summaries = [{
    label: `Net total (${currency})`,
    value: money(total)
  }, {
    label: 'VAT',
    value: '0.00'
  }, {
    label: `Total (${currency})`,
    value: money(total)
  }];
  return _react.default.createElement(_renderer.View, {
    style: styles.charges
  }, _react.default.createElement(Row, null, columns.map(renderHeading)), charges.map(renderCharge), _react.default.createElement(_renderer.View, {
    style: styles.ruler
  }), summaries.map(renderSummary));

  function renderHeading(column, i) {
    const textAlign = column.label ? 'left' : 'right';
    return _react.default.createElement(TableHeading, {
      key: i,
      width: column.width,
      style: {
        textAlign
      }
    }, column.heading);
  }

  function renderCharge(charge, i) {
    return _react.default.createElement(Row, {
      key: i
    }, columns.map((column, j) => {
      const TableContent = column.label ? TableLabel : TableNumber;
      return _react.default.createElement(TableContent, {
        width: column.width,
        key: j
      }, column.value(charge, i));
    }));
  }

  function renderSummary(summary, i) {
    return _react.default.createElement(Row, {
      key: i
    }, columns.slice(0, -2).map((column, i) => _react.default.createElement(TableLabel, {
      key: i,
      width: column.width
    })), _react.default.createElement(TableLabel, {
      width: columns[columns.length - 2].width
    }, summary.label), _react.default.createElement(TableNumber, {
      width: columns[columns.length - 1].width
    }, summary.value));
  }
}

function PaymentDetails({
  details
}) {
  return _react.default.createElement(Itemized, {
    items: details,
    style: {
      width: '50%'
    }
  });
} //
// Layout components
//


function FloatRight({
  children
}) {
  return _react.default.createElement(_renderer.View, {
    style: {
      flexDirection: 'row'
    }
  }, _react.default.createElement(_renderer.View, {
    style: {
      flex: 1
    }
  }), children);
}

function Itemized({
  items,
  style
}) {
  return _react.default.createElement(_renderer.View, {
    style: style
  }, Object.entries(items).map(([label, value], i) => _react.default.createElement(Row, {
    key: i,
    style: {
      marginTop: itemizedMargin,
      marginBottom: itemizedMargin
    }
  }, _react.default.createElement(Label, null, label), _react.default.createElement(Number, null, value))));
}

function Row({
  children,
  style
}) {
  return _react.default.createElement(_renderer.View, {
    style: [{
      flexDirection: 'row',
      justifyContent: 'space-between'
    }, style]
  }, children);
}

function TableHeading({
  width,
  children,
  style
}) {
  return _react.default.createElement(_renderer.View, {
    style: [{
      flex: width,
      margin: tableMargin
    }, style]
  }, _react.default.createElement(_renderer.Text, {
    style: text('Roboto Condensed Bold', 1)
  }, children));
}

function TableLabel({
  width,
  children,
  style
}) {
  return _react.default.createElement(_renderer.View, {
    style: [{
      flex: width,
      margin: tableMargin
    }, style]
  }, _react.default.createElement(Label, null, children));
}

function TableNumber({
  width,
  children,
  style
}) {
  return _react.default.createElement(_renderer.View, {
    style: [{
      flex: width,
      margin: tableMargin
    }, style]
  }, _react.default.createElement(Number, {
    style: {
      textAlign: 'right'
    }
  }, children));
}

function Heading({
  children
}) {
  return _react.default.createElement(_renderer.Text, {
    style: [text('Roboto Condensed Bold', 2), {
      marginTop: baseline,
      marginBottom: baseline
    }]
  }, children);
} //
// Text components
//


function Name({
  children
}) {
  return _react.default.createElement(_renderer.Text, {
    style: text('Roboto Condensed Bold')
  }, children);
}

function AddressLine({
  children
}) {
  return _react.default.createElement(_renderer.Text, {
    style: text('Roboto Condensed Regular')
  }, children);
}

function Label({
  children
}) {
  return _react.default.createElement(_renderer.Text, {
    style: text('Roboto Condensed Regular')
  }, children);
}

function Number({
  children,
  style
}) {
  return _react.default.createElement(_renderer.Text, {
    style: [text('Roboto Regular'), style]
  }, children);
} //
// Styles
//


const baseline = 14;
const tableMargin = baseline * 0.5;
const itemizedMargin = baseline * 0.5;

const styles = _renderer.StyleSheet.create({
  page: {
    padding: baseline * 3
  },
  issuer: {
    margin: baseline
  },
  details: {
    flex: 0.5
  },
  charges: {
    marginTop: baseline * 3,
    marginBottom: baseline * 3
  },
  ruler: {
    height: _renderer.StyleSheet.hairlineWidth,
    marginTop: baseline,
    marginBottom: baseline,
    backgroundColor: 'black'
  }
});

function text(fontFamily, size = 1) {
  return {
    fontFamily,
    fontSize: size * baseline
  };
}

function money(number) {
  return number ? number.toFixed(2) : '';
}
},{}],"i53S":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerFonts;

var _renderer = require("@react-pdf/renderer");

function registerFonts(fontMap) {
  for (const [family, path] of Object.entries(fontMap)) {
    _renderer.Font.register(path, {
      family
    });
  }

  _renderer.Font.registerHyphenationCallback(word => {
    return [word];
  });
}
},{}],"DxDr":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderInvoice;

var _react = _interopRequireDefault(require("react"));

var _renderer = _interopRequireDefault(require("@react-pdf/renderer"));

var _tempy = _interopRequireDefault(require("tempy"));

var _Invoice = _interopRequireDefault(require("./Invoice"));

var _registerFonts = _interopRequireDefault(require("./registerFonts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function renderInvoice(invoice) {
  (0, _registerFonts.default)({
    'Roboto Regular': __dirname + '/../fonts/Roboto/Roboto-Regular.ttf',
    'Roboto Condensed Regular': __dirname + '/../fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf',
    'Roboto Condensed Bold': __dirname + '/../fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf'
  });

  const outPath = _tempy.default.file({
    extension: 'pdf'
  });

  await _renderer.default.render(_react.default.createElement(_Invoice.default, {
    invoice: invoice
  }), outPath);
  return outPath;
}
},{"./Invoice":"crut","./registerFonts":"i53S"}],"dtX/":[function(require,module,exports) {
module.exports = {
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "Issuer": {
      "type": "object",
      "properties": {
        "Name": {
          "type": "string"
        },
        "Address": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["Name", "Address"]
    },
    "Currency": {
      "type": "string"
    },
    "Payment details": {
      "type": "object",
      "properties": {
        "Name": {
          "type": "string"
        },
        "Bank": {
          "type": "string"
        },
        "Branch": {
          "type": "string"
        },
        "Sort Code": {
          "type": "string"
        },
        "Account No.": {
          "anyOf": [{
            "type": "string"
          }, {
            "type": "number"
          }]
        }
      },
      "required": ["Name", "Bank", "Branch", "Sort Code", "Account No."],
      "additionalProperties": false
    },
    "Details": {
      "type": "object",
      "properties": {
        "Invoice number": {
          "type": "string"
        },
        "Date issued": {
          "type": "string"
        },
        "Date due": {
          "type": "string"
        }
      },
      "required": ["Invoice number", "Date issued", "Date due"]
    },
    "Issued to": {
      "type": "object",
      "properties": {
        "Name": {
          "type": "string"
        },
        "Address": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["Name", "Address"]
    },
    "Charges": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string"
          },
          "Unit price": {
            "type": "number"
          },
          "Units": {
            "type": "number"
          }
        },
        "required": ["Description"]
      }
    }
  },
  "required": ["Issuer", "Currency", "Payment details", "Details", "Issued to", "Charges"]
};
},{}],"LM5A":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = main;

var _renderInvoice = _interopRequireDefault(require("./renderInvoice"));

var _schema = _interopRequireDefault(require("./schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Ajv = require('ajv');

const {
  addMonths,
  format
} = require('date-fns');

const yaml = require('node-yaml');

const open = require('opn');

const path = require('path');

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('usage: invoice <path-to-invoice-file.yaml>+');
    console.error('       invoice --new');
    process.exit(1);
  }

  if (args.length === 1 && args[0] === '--new') {
    console.log(newInvoice());
    process.exit();
  }

  const validate = new Ajv().compile(_schema.default);
  const pieces = args.map(filePath => yaml.readSync(path.resolve(filePath)));
  const invoice = Object.assign(...pieces);
  const valid = validate(invoice);

  if (!valid) {
    console.error(validate.errors);
    process.exit(2);
  }

  const outPath = await (0, _renderInvoice.default)(invoice);
  console.log('Rendered the invoice.');
  console.log(outPath);
  open(outPath);
  process.exit();
}

function newInvoice() {
  const today = new Date();
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
`;
}
},{"./renderInvoice":"DxDr","./schema":"dtX/"}]},{},["LM5A"], null)