import * as yup from 'yup';
import settle from '../src/settle';
import check from '../src/check';

describe('cast', () => {
  it('should cast a string', () => {
    expect(
      check(
        {
          type: 'string',
          label: 'my string',
          transforms: ['trim', 'strip', ['replace', 'a', 'b']],
        },
        '  frad ',
        { assert: false },
      ),
    ).toBe('frbd');
  });

  it.only('should cast a ref', () => {
    //   object({
    //     fielda: object({
    //       field1: object({
    //         field1: lazy(() => mixed(def('bill'))),
    //         field2: conditional(
    //           condition('.field3.field4', field => mixed(def(field)))
    //         ),
    //       }),
    //       field3: object({
    //         field4: conditional(
    //           condition('..field5', field => mixed(def(field)))
    //         ),
    //       }),
    //     }),
    //     field5: mixed(def('joe')),
    //   })
    // );

    // console.log(
    //   yup
    //     .object({
    //       fielda: yup.ref('field5.field6'),
    //       field5: yup.object({
    //         field6: yup.ref('field7'),
    //         field7: yup.string().default('fred'),
    //       }),
    //     })
    //     .cast({}),
    // );

    console.log(
      settle({
        type: 'object',
        inner: {
          fielda: {
            type: 'string',
          },
        },
      }),
    );

    // console.log(
    //   check(
    //     {
    //       type: 'object',
    //       inner: {
    //         fielda: { ref: 'field5.field6' },
    //         field5: {
    //           type: 'object',
    //           inner: {
    //             field6: { ref: 'field7' },
    //             field7: {
    //               type: 'string',
    //               default: 'fred',
    //             },
    //           },
    //         },
    //       },
    //     },
    //     {},
    //     {
    //       context: {
    //         jim: '10',
    //       },
    //     },
    //   ),
    // );

    expect(1).toBe(1);
  });
});
