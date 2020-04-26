const SortOptions = [`event`, `time`, `price`];


const generateSortOptions = () => {
  return SortOptions.map((it) => {
    return {
      name: it,
      type: it,
    };
  });
};

export {generateSortOptions};
