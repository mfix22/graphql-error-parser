const morph = require('morphmorph')

const extract = (message = '') => {
  // Matches: `field "<fieldName"`
  const extractFieldsRex = `field "(\\w+)"`
  // Matches: `Expected "<field>", found <value>.<message>`
  const extractValuesRex = `Expected (type.)*"(.+?)", found (.+?)(\\.|:).{0,1}(.*)`

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
