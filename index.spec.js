const extractFields = require('.')
describe('Extract Errors', () => {
  it('should extract field types and messages from error responses', () => {
    const err = 'Variable "$input" got invalid value {"id":"3","address":{"zip":"1","state":"MN","streetAddress1":"Test"}}.\nIn field "address": In field "city": Expected "String!", found null.\nIn field "address": In field "zip": Expected type "ZipCode", found "1": 00001 is not a valid zipcode'

    const { address } = extractFields(err)
    expect(address.city).toEqual({ type: 'String!', message: '' })
    expect(address.zip).toEqual({ type: 'ZipCode', message: '00001 is not a valid zipcode' })
  })

  it('should return an empty object if no matches are found', () => {
    const err = 'Error Message that doesn\'t match'
    const summary = extractFields(err)
    expect(summary).toEqual({})
  })

  it('should not fail if #fields matched does not match #values matched', () => {
    const err = 'In field "address": In field "city"'
    const {address} = extractFields(err)
    expect(address.city).toBeUndefined()
  })
})
