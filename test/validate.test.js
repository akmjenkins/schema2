import * as yup from 'yup';
import settle from '../src/settle';

describe('validate', () => {
  it('should work', async () => {
    // try {
    //   yup
    //     .object({
    //       key: yup.string().required(),
    //       key2: yup.object({
    //         key3: yup.string().required(),
    //         key4: yup.object({
    //           key5: yup.string().required(),
    //         }),
    //       }),
    //     })
    //     //   .nullable()
    //     .validateSync(undefined, { abortEarly: false });
    // } catch (err) {
    //   console.log(err);
    // }

    try {
      const value = await settle(
        {
          type: 'object',
          label: 'user',
          inner: {
            firstName: {
              type: 'string',
              //   tests: [['is', { ref: '$f' }]],
              tests: [['required'], ['is', { ref: '$f' }]],
            },
            lastName: {
              type: 'string',
              //   tests: [['is', { ref: '$j' }]],
              tests: [['required'], ['is', { ref: '$j' }]],
            },
          },
        },
        {
          firstName: '',
          lastName: '',
        },
        {
          abortEarly: false,
          multiple: false,
          sync: false,
          context: {
            f: 'bill',
            j: 'wilson',
          },
        },
      );
      console.log(value);
    } catch (err) {
      console.log(err);
    }

    expect(1).toBe(1);
  });
});
