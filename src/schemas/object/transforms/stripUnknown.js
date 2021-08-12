export default ({ value = true }) =>
  (v, { schema: { inner } }) =>
    value
      ? Object.keys(v).reduce(
          (acc, k) => {
            if (!(k in inner)) delete acc[k];
            return acc;
          },
          { ...v },
        )
      : v;
