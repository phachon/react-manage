import { reqCityData } from "../../../api";
export const ACTION_SET_FROM = "SET_FROM";
export const ACTION_SET_TO = "SET_TO";
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
  "SET_IS_CITY_SELECTOR_VISIBLE";
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
  "SET_CURRENT_SELECTING_LEFT_CITY";
export const ACTION_SET_CITY_DATA = "SET_CITY_DATA";
export const ACTION_SET_IS_LOADING_CITY_DATA = "SET_IS_LOADING_CITY_DATA";
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
  "SET_IS_DATE_SELECTOR_VISIBLE";
export const ACTION_SET_HIGH_SPEED = "SET_HIGH_SPEED";
export const ACTION_SET_DEPART_DATE = "SET_DEPART_DATE";

export function setFrom(from) {
  return {
    type: ACTION_SET_FROM,
    payload: from
  };
}

export function setTo(to) {
  return {
    type: ACTION_SET_TO,
    payload: to
  };
}

export function setIsLoadingCityData(isLoadingCityData) {
  return {
    type: ACTION_SET_IS_LOADING_CITY_DATA,
    payload: isLoadingCityData
  };
}

export function setCityData(cityDate) {
  return {
    type: ACTION_SET_CITY_DATA,
    payload: cityDate
  };
}

export function toggleHighSpeed() {
  return (dispatch, getState) => {
    const { highSpeed } = getState();
    dispatch({
      type: ACTION_SET_HIGH_SPEED,
      payload: !highSpeed
    });
  };
}

// 显示选择城市浮层
export function showCitySelector(currentSelectingLeftCity) {
  return dispatch => {
    dispatch({
      type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
      payload: true
    });

    dispatch({
      type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
      payload: currentSelectingLeftCity
    });
  };
}

export function hideCitySelector() {
  return {
    type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    payload: false
  };
}

export function setSelectedCity(city) {
  return (dispatch, getState) => {
    const { currentSelectingLeftCity } = getState();
    if (currentSelectingLeftCity) {
      dispatch(setFrom(city));
    } else {
      dispatch(setTo(city));
    }

    dispatch(hideCitySelector());
  };
}

// 出发站-目的站-互换
export function exchangeFromTo() {
  return (dispatch, getState) => {
    const { from, to } = getState();
    dispatch(setFrom(to));
    dispatch(setTo(from));
  };
}

export function setDepartDate(departDate) {
  return {
    type: ACTION_SET_DEPART_DATE,
    payload: departDate
  };
}

// 请求城市列表
export function fetchCityData() {
  return async (dispatch, getState) => {
    const { isLoadingCityData } = getState();
    // 如在请求中 直接 return
    if (isLoadingCityData) {
      return;
    }

    const cache = JSON.parse(localStorage.getItem("city_data_cache") || "{}");

    if (Date.now() < cache.expires) { // 判断缓存是否有效
      dispatch(setCityData(cache.data));

      return;
    }
    // 无缓存 缓存获取请求数据
    dispatch(setIsLoadingCityData(true));
    const {data} = await reqCityData();
    dispatch(setCityData(data));
    localStorage.setItem(
      "city_data_cache",
      JSON.stringify({
        expires: Date.now() + 600 * 1000, // 设置缓存的有效期
        data: data
      })
    );
    dispatch(setIsLoadingCityData(false));
  };
}


/**
 * @description 日期选择框
 */
export function showDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: true
  };
}

export function hideDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: false
  };
}
