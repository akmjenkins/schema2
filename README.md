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
    [ "requireFields", "firstName", "lastName"]
  ],
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

### To Do

Allow object instead of arrays

```json
{
  "type": "object",
  "inner": {
    "firstName": {
      "type": "string",
      "tests": {
        "required": true,
        "oneOf": [1,2,{ "ref": "$someContext" }, { "message": "Should be the same as field {{refs.$someContext.label}}" }]
      }
    }
  }
}
```

The ref values passed into the validator should be an a `refs` object when it comes to the messages

### Pass refs[refName].label and refs[refName].value for interpolation

### transforms

#### common
#### object
#### string
#### boolean
#### number