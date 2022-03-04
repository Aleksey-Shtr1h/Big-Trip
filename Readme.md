## Single page aplication based on object-oriented programming methodology

---

<br />

## Made with technologies **Vanilla JavaScript (ES6), OOP, Chart.js, Moment.js, Flatpickr.js, Webpack**

---

<br />

## <p align=center>**Start Scripts:**</p>

- ### **_npm install_** - install dependencies
- ### **_npm start_** - start app
- ### **_npm run build_** - build app

---

<br />

### Приложение построено c помощью патерна **MVP (Model-View-Presenter)** и паетерна **Observer**.

- **Model** - отвечает за формирование данных с сервера.
- **View** - отвечает за вид абстрактных блоков приложения.
- **Presenter** - отвечает за логику приложения и связывает **Model** с **View** для ререндера приложения

---

<br />

# <p align="center">Presenter and Model</p>

### 1. Первый **presenter** ( <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/controllers/main-controller.js">**src/controllers/main-controller.js**</a> ) запускается в <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/main.js">**src/main.js**</a>, который формирует начальную логику:

- <span style="color:red;">**_Рендерит_**</span> static и smart компоненты шапки
  ( <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/components/create-site-main-content-statistics.js">**Навигация**</a>,
  <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/components/create-site-header-trip-info.js">**Информация**</a>,
  <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/components/create-site-header-trip-cost.js">**Стоимость**</a> )
- <span style="color:red;">**Создается**</span> первый <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/controllers/main-controller.js#L40">**observer**</a> расчета стоимости, который подписывается на изменения карточек путешествий с помощью метода **bind** для привязки контекста именно в этом классе

- <span style="color:red;">**Создает**</span> логику фильтрации с помощью **presenter** <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/controllers/filter-cards-controller.js">
  **src/controllers/filter-cards-controller.js**
  </a>

- <span style="color:red;">**Принимает**</span> данные с серевера через REST API спсобом **fetch**, который находится в **src/api.js** методом класса
  <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/api.js#L61-L72">
  **_getData()_**
  </a>
  , раскидывает их по своим моделям (
  <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/model/event-distonation-model.js">**Distonation**</a>,
  <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/model/event-offer-model.js">**Offer**</a>,
  <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/model/event-point-model.js">**Point**</a>
  ) с помощью деструктаризации.

### и с помощью цепочки промисов заносит данные в модель, которая отвечает за карточки путушествий <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/model/event-card-model.js">**Card**</a> с помощью метода <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/model/event-card-model.js#L23-L26">**setCards()**</a>, он также создает массив прозвона обработчиков событий и запускает следеющий **presenter** ( <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/controllers/trip-days-controller.js">**src/controllers/trip-days-controller.js**</a> ), в который передает данные с сервера.

---

### 2. Presenter "**src/controllers/trip-days-controller.js**" формирует логику управления динамики всего преложения:

- <span style="color:red;">**_Рендерит_**</span> static и smart компоненты main

- <span style="color:red;">**Создаются**</span> <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/controllers/trip-days-controller.js#L61-L62">**два observers** </a> которые слушают изменения обработчиков событий с помощью метода
  **bind** для привязки контекста именно в этом классе

- <span style="color:red;">**Создается один из главных методов приложения**</span> <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/controllers/trip-days-controller.js#L200-L247">**onDataChange()**</a>, который овечает за создание, удаления, изменения карточек путешествий.

- <span style="color:red;">**Также**</span> присутвуют методы для изменения динамики приложения (**_обвновления/удаления дней и карточек_**) и создания массива прозвона обработчиков событий

- <span style="color:red;">**Создается**</span> логика сортировки

### после отработки всех нужных методов запускается <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/controllers/trip-days-controller.js#L19-L23">**renderTripCards()**</a>, который формирует новый **presenter** ( <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/controllers/trip-cards-controller.js">**src/controllers/trip-cards-controller.js**</a> )

---

### 3. Presenter "**src/controllers/trip-cards-controller.js**" формирует логику управления обработчиками событий приложения, в данной случае, формой карточки путешествий и анимацией. Здесь также есть функция <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/119a188654e807211cdce74bd82d48a6e3267e34/src/controllers/trip-cards-controller.js#L39-L81">**parseFormData()**</a>, которая парсит форму отправки на сервер.

---

<br />

# <p align="center">View</p>

### Все комопоненты наследуются от двух классов со своими методами:

- Если это компонент статический, то от <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/components/abstract-component.js">**AbstractComponent**</a>

- Если это компонент динамический, то от <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/components/abstract-smart-component.js">**AbstractSmartComponent**</a>

---

<br />

# <p align="center">API</p>

### Здесь сформариваны <a href="https://github.com/Aleksey-Shtr1h/Big-Trip/blob/master/src/api.js">**методы**</a> обработки данных с сервера:

- Получения карточек

- Обвновления карточек

- Удаления карточек
