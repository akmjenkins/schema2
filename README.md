# Schema2

Imagining a better JSON schema.

## Why?

Mainly because JSON schema's syntax is inconsistent. Every draft there's a new keywords being added, and it's hard to keep track of them all. Schema2 built upon the [@zuze-lab/schema]() but got rid of the functional flavor while keeping the abstract syntax tree.

Popular validators like [ajv](https://github.com/ajv-validator/ajv) or [hyperjump](https://github.com/hyperjump-io/json-schema-validator) are undoubtedly powerful, but, having evolved with JSON schema, have lots of complex configuration options, inconsistent syntax, and have [become](https://bundlephobia.com/result?p=@hyperjump/json-schema) [bloated](https://bundlephobia.com/result?p=ajv).


## Keywords

The only keywords you need to know about for *Schema2* are:

- `type` - specifies the type of schema
- `label` - a label, helpful, for error messages
- `tests` - all the validations that you want to do (this is where all the keywords go)
- `transforms` - ability to transform values
- `inner` - the inner schema definition for objects and arrays/tuples
- `conditions` - the ability to modify the validations or transforms of any schema depending on the value being validated or external [context](#context)
- `nullable` - null and undefined are treated as special values. Tests **WILL NOT** be run on null and undefined values. A special `nonNullable` error will be returned for a given schema if null is received as a value for a schema where `nullable` is false

### Batteries Included vs Minimalistic



`schema2` is minimalistic and extensible so you can use whatever validators/transforms you like. We ship a "batteries included" option that includes a lengthy list of validators and transforms. If you don't want to use them, or maybe only use a subset of them, you can pass in your use the tiny library and pass in your own validators/transforms at runtime.
### 

These are the list of validators shipped with `schema2`:





### Example

```json
{
  "type": "object",
  "label": "user",
  "inner": {
    "firstName": {
      "type": "string",
    },
    "lastName": {
      "type": "string"
    }
  },
  "tests": [
    {
      "name": "requireFields",
      "fields": ["firstName","lastName"]
    }
  ],
  "conditions": [
    {
      "when": {
        "user.firstName": { 
          "tests": [ {"name":"required"} ] 
        }
      },
      "then": {
        "inner": {
          "lastName": {  
            "tests": [ {"name":"required"} ] 
          }
        }
      }
    }
  ]
}
```

### To Do

Allow object instead of arrays

```json
{
  "type": "object",
  "inner": {
    "firstName": {
      "type": "string",
      "tests": [
        {
          "name": "required"
        },
        {
          "name": "oneOf",
          "values": [1,2,{"ref":"$someContext"}],
          "error": {
            "message": "Should be the same as the other field"
          }
        }
      ]
    }
  }
}
```

// refs can be functions?

The ref values passed into the validator should be an a `refs` object when it comes to the messages

### Pass refs[refName].label and refs[refName].value for interpolation

### transforms

#### common
#### object
#### string
#### boolean
#### number

// errors are thrown as an array
// don't need to spend anytime massaging them
// pass in a getErrorMessages(errors,{messages})
//
/*
[
  {
    path:
    errorType:
    schemaType:
    label: (from schema)
    params: (to validator)
    refs: (also passed in to validator)
    message: (override)
  }
]

// what can be overridden in the validator?
// the name (errorType) or message, params and refs come from within


*/


I need nullable
I need typeCheck
I need default (which is just a later transform)
tests don't get passed undefined/null


[
    // current
    [ path, errors[] ]

    // change it to, maybe, does it matter?
    {
        [path]: errors[]
    }    
]


// The core creates the syntactical structure for you to do whatever it is that you frigging well want and is less than 3kb minzipped (just over 7kb minified)
// if I could pass in a parser that would be nice, but it's probably also too complicated for right now
// the only benefit I would get out of it is to extract the checkInner and reduceInner from the core
{
  type: mixed | string | object | array | number | boolean | date,
  nullable:
  inner: // object or array  
  tests: [],
  transforms: [],
  conditions: [],

}
// It's bigger than react (how the hell did react get so small?)
// The schemas are prebuilt things that you can use 

// To "inherit" from mixed you do this:

import { tests as mixedTests, transforms as mixedTransforms } from 'schema2/schemas/mixed';

const mySchema = {
  tests: {
    ...mixedTests,
    ...myCustomTests,
  },
  transforms: {
    ...mixedTransforms,
    ...myCustomTransforms
  }
}

export default mySchema;