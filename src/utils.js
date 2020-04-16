export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const renderTemplate = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const castTimeMinutesFormat = (value) => {
  return value < 30 ? `00` : `30`;
};

const formatTime = (date) => {

  const hours = castTimeFormat(date.getHours() % 24);
  const minutes = castTimeMinutesFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const dateNow = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = castTimeFormat(date.getFullYear()).slice(2);

  const fullDate = `${dateNow}/${month}/${year}`;

  return fullDate;
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

function shuffleArray(array) {
  const result = array.slice();
  result.sort(() => Math.random() - 0.5);
  return result;
}

const getStartDate = () => {
  const targetDate = new Date();
  return targetDate;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValueDate = getRandomIntegerNumber(2, 15);
  const diffValueHours = getRandomIntegerNumber(0, 24);
  const diffValueMinutes = getRandomIntegerNumber(0, 60);
  targetDate.setDate(targetDate.getDate() + diffValueDate);
  targetDate.setHours(targetDate.getHours() + diffValueHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffValueMinutes);

  return targetDate;
};

export {formatTime, formatDate, getRandomArrayItem, getRandomIntegerNumber, shuffleArray, getStartDate, getRandomDate};
