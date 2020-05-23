const castTimeFormat = (value) => {
  return value < 10 ? `0` + value : value;
};

export const getDuration = (start, end) => {
  const durationTime = end - start;
  const day = Math.floor(durationTime / 1000 / 60 / 60 / 24);
  const hour = Math.floor((durationTime / 1000 / 60 / 60) % 24);
  const min = Math.floor((durationTime / 1000 / 60) % 60);

  const valueDay = day > 0 ? `${castTimeFormat(day)}D` : ``;
  let valueHour = `${castTimeFormat(hour)}H`;

  if (day === 0) {
    valueHour = hour > 0 ? `${castTimeFormat(hour)}H` : ``;
  }

  let valueMin = min > 0 ? `${castTimeFormat(min)}M` : ``;

  const duration = `${valueDay} ${valueHour} ${valueMin}`;
  return duration;
};

export const getCapitalizeFirstLetter = (value, boolValue = true) => {
  if (typeof value !== `string` || !value) {
    return ``;
  }

  if (boolValue) {
    return value[0].toUpperCase() + value.slice(1);
  } else {
    return value[0].toLowerCase() + value.slice(1);
  }
};


