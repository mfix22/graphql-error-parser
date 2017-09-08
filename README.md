# `graphql-error-parser`

```javascript
const parse = require('graphql-error-parser')
const err = {
  message: 'Variable "$input" got invalid value {"id":"3","address":{"zip":"1","state":"MN","streetAddress1":"Test"}}.\nIn field "address": In field "city": Expected "String!", found null.\nIn field "address": In field "zip": Expected type "ZipCode", found "1": 00001 is not a valid zipcode'
}

parse(err)
/*
{
  address: {
    city: {
      type: 'String!',
      message: ''
    },
    zip: {
      type: 'ZipCode',
      message: '00001 is not a valid zipcode'
    }
  }
}
*/
```
