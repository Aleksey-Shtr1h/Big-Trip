const filterNames = [`everything`, `future`, `past`];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
    };
  });
};

export {generateFilters};
