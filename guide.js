// const is = (arg1, arg2, arg3, arg4) => (value, { resolve, createError, schema, options }) => {
//     return value === arg1
// }


const onlySchemas = (schemas, fn, error) => (...args) => (value, schemaStuff) => !schemas.includes(schemaStuff.schema.type) ? error(schemaStuff) || fn(...args)(value, schemaStuff);

const onlyNumber = (fn) => (...args) => (value, schemaStuff) => schemaStuff.schema.type !== 'number' || fn(...args)(value, schemaStuff);

const skipUndefined = (fn) => (...args) => (value, schemaStuff) => value === undefined || fn(...args)(value, schemaStuff);

const myCustomTest = onlySchemas(
    ['number'],
    (arg1, arg2) => {
        // do the test
    },
    ({ schema }) => {
        throw new Error('not good!')
    }
)

const validate = () => { };

validate({
    type: 'object',
    shape: {
        key: {
            type: 'string',
        },
        key2: {
            type: 'tuple',
            of: [{ type: 'string' }, { type: 'number' }],
        },
        key3: {
            type:: 'number',
            modifiers: [
                {
                    if: [{
                        $ref: { type: 'string', tests: ['required'] },
                        someKey: { tests:['valid']}
                    }],
                    then: { type: 'mixed', },
                    else: { tets: [['required']] }
                }
            ]
        }
    },
    transforms: []
    tests: [['is', ['1', '2', '3']]]
},
    'joe',
    {
        validators: {
            oneOf: (arrayOfValues) => (value, { resolve, schema, createError }) => arrayOfValues.includes(value)
        },
        transforms: {
            toDate: (...args) => (value, { resolve, schema }) => new Date(value)
        }
    }
)