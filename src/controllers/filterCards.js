import FilterComponent from '../components/create-site-header-trip-filter.js';

import {FilterType} from '../constants.js';
// import {getTasksByFilter} from '../utils/common.js';
import {renderTemplate, RenderPosition, raplaceElement} from '../utils/render.js';

export default class FilterController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterClickBtnChange = this._onFilterClickBtnChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  renderFilter() {
    const container = this._container;

    const filterCards = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filterCards);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      raplaceElement(this._filterComponent, oldComponent);
    } else {
      this._filterComponent.setFilterClickBtn(this._onFilterClickBtnChange);
      renderTemplate(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._cardsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.renderFilter();
  }

  _onFilterClickBtnChange(filterTypeClickEventBtn) {
    this._activeFilterType = filterTypeClickEventBtn;
    this._cardsModel.setFilterBtnClick(filterTypeClickEventBtn);
    this._onDataChange();
  }
}
