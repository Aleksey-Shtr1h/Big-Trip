import AbstractSmartComponent from './abstract-smart-component.js';

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";

const StatisticsLegend = {
  TIME: `TIME SPENT`,
  TRANSPORT: `TRANSPORT`,
  MONEY: `MONEY`,
};

const StatisticsSign = {
  EURO: `€`,
  COUNT: `x`,
  HOURS: `H`,
};

const getStatResult = (cards, qwer) => {
  const caseResult = {
    [StatisticsLegend.TIME]: ((distanation) => {
      return cards.filter((card) => {
        return card.randomWayPointItem.toLowerCase() === distanation.toLowerCase();
      })
      .reduce((sum, value) => sum + Math.round(moment.duration(value.endDate - value.startDate) / (60 * 60 * 1000)), 0);
    }),
    [StatisticsLegend.TRANSPORT]: ((distanation) => {
      return cards.filter((card) => {
        return card.randomWayPointItem.toLowerCase() === distanation.toLowerCase();
      }).length;
    }),
    [StatisticsLegend.MONEY]: ((distanation) => {
      return cards.filter((card) => {
        return card.randomWayPointItem.toLowerCase() === distanation.toLowerCase();
      })
      .reduce((totalPrice, itemOf) => {
        return totalPrice + itemOf.price;
      }, 0);
    }),
  };
  return caseResult[qwer];
};

const renderChart = (typeCtx, cards, legend, sign, positionSign = true) => {
  const distanations = [...new Set(cards.map((card) => card.randomWayPointItem.toUpperCase()))];
  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: distanations,
      datasets: [{
        data: distanations.map(getStatResult(cards, legend)),
        backgroundColor: `rgba(0, 99, 132, 0.6)`,
        hoverBackgroundColor: `#e7d0ea`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 15,
            weight: `bold`,
          },
          color: `#ffffff`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => positionSign ? `${val}${sign}` : `${sign} ${val}`
        }
      },
      title: {
        display: true,
        text: legend,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 16,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: true,
      }
    }
  });
};

const createStatisticsSiteTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};


export default class StatisticsSite extends AbstractSmartComponent {
  constructor(cardsModel) {
    super();
    this._cards = cardsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsSiteTemplate();
  }

  show() {
    super.show();
    this.rerender(this._cards);
  }

  recoveryListeners() {}

  rerender(cards) {
    this._cards = cards;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._moneyChart = renderChart(moneyCtx, this._cards.getCards(), StatisticsLegend.MONEY, StatisticsSign.EURO, false);
    this._transportChart = renderChart(transportCtx, this._cards.getCards(), StatisticsLegend.TRANSPORT, StatisticsSign.COUNT);
    this._timeChart = renderChart(timeCtx, this._cards.getCards(), StatisticsLegend.TIME, StatisticsSign.HOURS);
  }
}
