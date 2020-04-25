const sortOptions = [`event`, `time`, `price`];


const generateSortOptions = () => {
  return sortOptions.map((it) => {
    return {
      name: it,
      type: it,
    };
  });
};

export {generateSortOptions};
