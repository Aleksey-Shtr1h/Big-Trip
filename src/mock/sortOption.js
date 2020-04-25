const sortOptions = [`event`, `time`, `price`];


const generateSort = () => {
  return sortOptions.map((it) => {
    return {
      name: it,
      type: it,
    };
  });
};

export {generateSort};
