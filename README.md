# Schema2

Imagining a better JSON schema.

## Why?

Mainly because JSON schema's syntax is inconsistent. Every draft there's a new keywords being added, it's hard to keep track of them all. Schema2 built upon the [@zuze-lab/schema]() but got rid of the crazy functional complexity.

Popular validators like [ajv](https://github.com/ajv-validator/ajv) or [hyperjump](https://github.com/hyperjump-io/json-schema-validator) are undoubtedly powerful, but, having evolved with JSON schema, have lots of complex configuration options,inconsistent syntax, and are of configuration options and have [become](https://bundlephobia.com/result?p=@hyperjump/json-schema) [bloated](https://bundlephobia.com/result?p=ajv@6.12.6).


## Keywords

- `type` - specifies the type of schema
- `label` - a label, helpful, for error messages
- `tests` - all the validations that you want to do (this is where all the keywords go)
- `transforms` - ability to transform values
- `inner` - the inner schema definition for objects and arrays/tuples
- `conditions` - the ability to modify the validations or transforms of any schema depending on the value being validated or external [context](#context)


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
    [ "requireFields", "firstName", "lastName"]
  ]
  "conditions": [
    {
      "when": {
        "user.firstName": { 
          "tests": [ "required" ] 
        }
      },
      "then": {
        "inner": {
          "lastName": {  
            "tests": [ "required" ] 
          }
        }
      }
    }
  ]
}
```

### tests

#### `required(error?: Partial<ErrorMessage>)`
- schemas: all
- allowNull: true
- allowUndefined: false

#### `requireKeys(keys: string[], error?: Partial<ErrorMessage>)`
- schemas: all
- allowNull: false
- allowUndefined: false


### transforms

#### common
#### object
#### string
#### boolean
#### number