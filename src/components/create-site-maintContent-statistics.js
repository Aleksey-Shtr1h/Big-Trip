import AbstractSmartComponent from './abstract-smart-component.js';

import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import flatpickr from "flatpickr";

const rendermoneyChart = (moneyCtx, cards) => {

  const BAR_HEIGHT = 55;
  // moneyCtx.height = BAR_HEIGHT * 6;
  const dist = [...new Set(cards.map((card) => card.randomWaypointItem))]

  const moneyChart = new Chart(moneyCtx, {

    // plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: dist,
      datasets: [{
        data: dist.map((d) => {
          return cards.filter((card) => {
            return card.randomWaypointItem === d;
          })
          .reduce((totalPrice, itemOf) => {
            return totalPrice + itemOf.price;
          }, 0)
        }),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
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
        enabled: false,
      }
    }
  });

}

// class="visually-hidden"
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

    this._moneyChart = rendermoneyChart(moneyCtx, this._cards.getCards());
  }
}
