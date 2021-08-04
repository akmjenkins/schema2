# Schema2

Imagining a better JSON schema.

## Why?

Mainly because JSON schema's syntax is inconsistent. Every draft there's a new keywords being added, and it's hard to keep track of them all. Schema2 built upon the [@zuze-lab/schema](https://github.com/zuze-lab/schema) but got rid of the functional flavor while keeping the abstract syntax tree.

Popular validators like [ajv](https://github.com/ajv-validator/ajv) or [hyperjump](https://github.com/hyperjump-io/json-schema-validator) are undoubtedly powerful, but, having evolved with JSON schema, have lots of complex configuration options, inconsistent syntax, and have [become](https://bundlephobia.com/result?p=@hyperjump/json-schema) [bloated](https://bundlephobia.com/result?p=ajv).

`schema2`, at it's core, is only 2kb minzipped and under 6kb minzipped for all 7 schemas (mixed, number, boolean, string, date, object, array) including all 22 transformation operators and all 37 test operators.

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

### Batteries Included vs Minimalistic

`schema2` is minimalistic and extensible so you can use whatever validators/transforms you like. We ship a "batteries included" option that includes a lengthy list of validators and transforms. If you don't want to use them, or maybe only use a subset of them, you can pass in your use the tiny library and pass in your own validators/transforms at runtime.

```js
// take just what you need
import { string } from '@zuze-lab/schema2/schemas';
import { is } from '@zuze-lab/schema2';

const matchesSchema = is(someSchema, someValue, { schemas: string });

// get the whole thing
import { is } from '@zuze-lab/schema2/full';

const matchesSchema = is(someSchema, someValue);
```

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

### Pass refs[refName].label and refs[refName].value for interpolation

### transforms

#### mixed

#### object

#### array

#### string

#### boolean

#### number
