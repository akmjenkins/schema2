import { all } from '../src';
const { cast } = all;

describe('transforms', () => {
  it('should uppercase', async () => {
    console.log(
      cast(
        {
          type: 'string',
          transforms: [
            'uppercase',
            ['replace', /j/i, 'm'],
            ['pad', 'start', 10, 'foo'],
          ],
        },
        'joe',
      ),
    );
  });
});

// transforms: {
//     pad: {
//         how:'start',
//         length:
//     }
// },
// tests: {
//     required: true,
//     oneOf: []
//     withoutKeys: {

//     }
// }
