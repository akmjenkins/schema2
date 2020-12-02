import { createTransform } from '../../utils';

const transform = (v) => (v ? v.toLowerCase() : v);

export default createTransform(() => transform, { allowSchemas: ['string'] });
