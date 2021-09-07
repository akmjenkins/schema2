# Schema3

[![npm version](https://img.shields.io/npm/v//schema2.svg)](https://npmjs.org/package/schema2)
[![Coverage Status](https://coveralls.io/repos/github/akmjenkins/schema2/badge.svg)](https://coveralls.io/github/akmjenkins/schema2)
![Build Status](https://github.com/akmjenkins/schema2/actions/workflows/main.yaml/badge.svg)
[![Bundle Phobia](https://badgen.net/bundlephobia/minzip/schema2)](https://bundlephobia.com/result?p=schema2)

Imagining a future JSON schema.

## Why?

Mainly because JSON schema's syntax is inconsistent. Every draft there are new keywords being added, and it's hard to keep track of them all. Schema2 built upon the [@zuze-lab/schema](https://github.com/zuze-lab/schema) but got rid of the functional flavor while keeping the abstract syntax tree.

Popular validators like [ajv](https://github.com/ajv-validator/ajv) or [hyperjump](https://github.com/hyperjump-io/json-schema-validator) are undoubtedly powerful, but, having evolved with JSON schema, have lots of complex configuration options, inconsistent syntax, and have [become](https://bundlephobia.com/result?p=@hyperjump/json-schema) [bloated](https://bundlephobia.com/result?p=ajv).

`schema2`, at it's core, is only about 2kb minzipped and under 7kb minzipped for all 7 schemas (mixed, number, boolean, string, date, object, array) including all 24 transformation operators and all 35 test operators.

## Keywords

The only keywords you need to know about for _Schema2_ are:

- `type` - specifies the type of schema
- `label` - a label, helpful, for error messages
- `tests` - all the validations that you want to do (this is where all the keywords go)
- `transforms` - ability to transform values
- `typeError` - ability to specify an error message for invalid type during validation
- `inner` - the inner schema definition for objects and arrays/tuples
- `conditions` - the ability to modify the validations or transforms of any schema depending on the value being validated or external [context](#context)
- `nullable` - null and undefined are treated as special values. Tests **WILL NOT** be run on null and undefined values. A special `nonNullable` error will be returned for a given schema if null is received as a value for a schema where `nullable` is false

###

These are the list of validators shipped with `schema2`:

### Example

```json
{
  "type": "object",
  "label": "user",
  "inner": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    }
  },
  "tests": [
    {
      "name": "keys",
      "schema": {
        "type": "string",
        "tests": [
          {
            "type": "oneOf",
            "values": ["firstName", "lastName"]
          }
        ]
      }
    }
  ],
  "conditions": [
    {
      "when": {
        "user.firstName": {
          "tests": [{ "type": "required" }]
        }
      },
      "then": {
        "inner": {
          "lastName": {
            "tests": [{ "type": "required" }]
          }
        }
      }
    }
  ]
}
```
