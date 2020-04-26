export const TRIP_COUNT = 10;

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const castTimeMinutesFormat = (value) => {
  return value < 30 ? `00` : `30`;
};

export const formatTime = (date) => {

  const hours = castTimeFormat(date.getHours() % 24);
  const minutes = castTimeMinutesFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatDate = (date) => {
  const dateNow = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = castTimeFormat(date.getFullYear()).slice(2);

  const fullDate = `${dateNow}/${month}/${year}`;

  return fullDate;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const shuffleArray = (array) => {
  const result = array.slice();
  result.sort(() => Math.random() - 0.5);
  return result;
};

export const getArrayTripTime = (time) => {
  let result = [];
  let hourInterval = 0;
  let minuteInterval = 0;

  for (let i = 1; i <= time * 2; i++) {
    let targetDate = new Date();
    let hour = getRandomIntegerNumber(1, 5);
    let minutes = getRandomIntegerNumber(1, 59);
    hourInterval += hour;
    minuteInterval += minutes;
    targetDate.setHours(targetDate.getHours() + hour + hourInterval);
    targetDate.setMinutes(targetDate.getMinutes() + minutes + minuteInterval);
    result.push(targetDate);
  }

  return result;
};

const dayTrip = getArrayTripTime(TRIP_COUNT);
export const dayTripSort = dayTrip.sort((prev, next) => prev - next).slice();

export const getDuration = (start, end) => {
  const durationTime = end - start;
  const day = Math.floor(durationTime / 1000 / 60 / 60 / 24);
  const hour = Math.floor((durationTime / 1000 / 60 / 60) % 24);
  const min = Math.floor((durationTime / 1000 / 60) % 60);
  const duration = `${day}D ${hour}H ${min}M`;
  return duration;
};

