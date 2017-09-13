const morph = require('morphmorph')
const {
  and,
  or,
  capture,
  extra,
  wildcard,
  matchers,
  repeat
} = require('rexrex')

const quote = word => `"${word}"`

// Matches: `field "<fieldName"`
const extractFieldsRex = and('field ', quote(capture(extra(matchers.WORD))))

const anyLazy = capture(extra(matchers.ANY, matchers.LAZY))
// Matches: `Expected "<field>", found <value>.<message>`
const extractValuesRex = and(
  'Expected ',
  wildcard(capture('type.')),
  quote(anyLazy),
  ', found ',
  anyLazy,
  capture(or('\\.', ':')),
  repeat(matchers.ANY, 0, 1),
  capture(wildcard(matchers.ANY))
)

const extract = (message = '') => {
  const lines = message.split('\n')
  const fields = lines
    .map(line => line.match(new RegExp(extractFieldsRex, 'g')))
    .filter(i => i)
    .map(m =>
      m.map(v => RegExp(extractFieldsRex).exec(v))
       .map(v => v[1]))

  const values = lines
    .map(line => line.match(new RegExp(extractValuesRex, 'g')))
    .filter(i => i)
    .map(m => RegExp(extractValuesRex).exec(m))
    .filter(i => i)
    .map(v => ({
      type: v[2],
      message: v[5]
    }))

  return fields.reduce((accum, key, i) => morph.assign(key.join('.'))(accum, values[i]), {})
}

module.exports = exports.default = extract
