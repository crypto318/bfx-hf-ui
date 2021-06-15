import React from 'react'
import { useSelector } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

import OrderForm from '../OrderForm'
import OrderBookPanel from '../OrderBookPanel'
import ChartPanel from '../ChartPanel'
import AtomicOrdersTablePanel from '../AtomicOrdersTablePanel'
import AlgoOrdersTablePanel from '../AlgoOrdersTablePanel'
import OrderHistory from '../OrderHistory'
import TradesTablePanel from '../TradesTablePanel'
import PositionsTablePanel from '../PositionsTablePanel'
import BalancesTablePanel from '../BalancesTablePanel'
import TradingStatePanel from '../TradingStatePanel'
import ExchangeInfoBar from '../ExchangeInfoBar'

import * as Routes from '../../constants/routes'

import {
  getLayouts,
  getCurrentUnsavedLayout,
} from '../../redux/selectors/ui'
import { getLocation } from '../../redux/selectors/router'

export const COMPONENT_TYPES = {
  CHART: 'CHART',
  ORDER_BOOK: 'ORDER_BOOK',
  ORDER_FORM: 'ORDER_FORM',
  TRADES_TABLE: 'TRADES_TABLE',
  POSITIONS_TABLE: 'POSITIONS_TABLE',
  BALANCES_TABLE: 'BALANCES_TABLE',
  ALGO_ORDERS_TABLE: 'ALGO_ORDERS_TABLE',
  ATOMIC_ORDERS_TABLE: 'ATOMIC_ORDERS_TABLE',
  ORDER_HISTORY_TABLE: 'ORDER_HISTORY_TABLE',
  TRADING_STATE_PANEL: 'TRADING_STATE_PANEL',
  EXCHANGE_INFO_BAR: 'EXCHANGE_INFO_BAR',
}

export const COMPONENT_LABELS = {
  [COMPONENT_TYPES.CHART]: 'Chart',
  [COMPONENT_TYPES.ORDER_BOOK]: 'Order Book',
  [COMPONENT_TYPES.ORDER_FORM]: 'Order Form',
  [COMPONENT_TYPES.TRADES_TABLE]: 'Trades Table',
  [COMPONENT_TYPES.BALANCES_TABLE]: 'Balances Table',
  [COMPONENT_TYPES.POSITIONS_TABLE]: 'Positions Table',
  [COMPONENT_TYPES.ALGO_ORDERS_TABLE]: 'Algo Orders Table',
  [COMPONENT_TYPES.ATOMIC_ORDERS_TABLE]: 'Atomic Orders Table',
  [COMPONENT_TYPES.ORDER_HISTORY_TABLE]: 'Order History Table',
  [COMPONENT_TYPES.TRADING_STATE_PANEL]: 'Trading State Panel',
  [COMPONENT_TYPES.EXCHANGE_INFO_BAR]: 'Ticker Panel',
}

export const COMPONENT_DIMENSIONS = {
  [COMPONENT_TYPES.CHART]: {
    w: 33, h: 10, minW: 30, minH: 8,
  },
  [COMPONENT_TYPES.ORDER_BOOK]: {
    w: 24, h: 20, minW: 21, minH: 5,
  },
  [COMPONENT_TYPES.ORDER_FORM]: {
    w: 20, h: 10, minW: 16, minH: 6,
  },
  [COMPONENT_TYPES.TRADES_TABLE]: {
    w: 24, h: 10, minW: 18, minH: 4,
  },
  [COMPONENT_TYPES.BALANCES_TABLE]: {
    w: 20, h: 6, minW: 18, minH: 5,
  },
  [COMPONENT_TYPES.POSITIONS_TABLE]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.ALGO_ORDERS_TABLE]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.ATOMIC_ORDERS_TABLE]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.ORDER_HISTORY_TABLE]: {
    w: 40, h: 6, minW: 21, minH: 5,
  },
  [COMPONENT_TYPES.TRADING_STATE_PANEL]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.EXCHANGE_INFO_BAR]: {
    w: 20, h: 8, minW: 20, minH: 4,
  },
}

export const DEFAULT_LAYOUTS_ID_MAPPING = {
  [Routes.tradingTerminal.path]: 'Default Trading',
  [Routes.marketData.path]: 'Default Market Data',
}

export const useLayout = () => {
  const { pathname } = useSelector(getLocation)
  const layouts = useSelector(getLayouts)
  const unsavedLayoutDef = useSelector(getCurrentUnsavedLayout)
  const layoutID = _get(DEFAULT_LAYOUTS_ID_MAPPING, pathname, '')
  const defaultLayoutDef = _get(layouts, layoutID, {})
  const layoutDef = _get(unsavedLayoutDef, 'routePath', null) === pathname
    ? unsavedLayoutDef
    : defaultLayoutDef

  return { layoutDef, layoutID }
}

const componentForType = (c) => {
  switch (c) {
    case COMPONENT_TYPES.CHART:
      return ChartPanel

    case COMPONENT_TYPES.ORDER_BOOK:
      return OrderBookPanel

    case COMPONENT_TYPES.ORDER_FORM:
      return OrderForm

    case COMPONENT_TYPES.TRADES_TABLE:
      return TradesTablePanel

    case COMPONENT_TYPES.ATOMIC_ORDERS_TABLE:
      return AtomicOrdersTablePanel

    case COMPONENT_TYPES.ALGO_ORDERS_TABLE:
      return AlgoOrdersTablePanel

    case COMPONENT_TYPES.ORDER_HISTORY_TABLE:
      return OrderHistory

    case COMPONENT_TYPES.POSITIONS_TABLE:
      return PositionsTablePanel

    case COMPONENT_TYPES.BALANCES_TABLE:
      return BalancesTablePanel

    case COMPONENT_TYPES.TRADING_STATE_PANEL:
      return TradingStatePanel

    case COMPONENT_TYPES.EXCHANGE_INFO_BAR:
      return ExchangeInfoBar

    default:
      return null
  }
}

export const renderLayoutElement = (layoutID, def = {}, componentProps = {}, onRemoveComponent) => {
  const { i, c, props = {} } = def
  const C = componentForType(c)
  const cProps = {
    ...props,
    ...componentProps.sharedProps,
    layoutID,
    layoutI: i,
    onRemove: () => onRemoveComponent(i),
  }

  if (!C) {
    return (
      <p>
        Unknown component type:
        {c}
      </p>
    )
  }

  if (C === ChartPanel && componentProps.chart) {
    Object.assign(cProps, componentProps.chart)
  } else if (C === OrderBookPanel && componentProps.book) {
    Object.assign(cProps, componentProps.book)
  } else if (C === TradesTablePanel && componentProps.trades) {
    Object.assign(cProps, componentProps.trades)
  } else if (C === OrderForm && componentProps.orderForm) {
    Object.assign(cProps, componentProps.orderForm)
  } else if (C === AtomicOrdersTablePanel && componentProps.orders) {
    Object.assign(cProps, componentProps.orders)
  }
  return <C {...cProps} />
}

export const layoutDefToGridLayout = layoutDef => layoutDef.layout.map(l => ({
  i: l.i,
  x: l.x,
  y: l.y,
  w: l.w,
  h: l.h,
}))

export const gridLayoutToLayoutDef = (layoutDef, parentLayoutDef) => {
  parentLayoutDef.layout.forEach((l) => {
    const elm = layoutDef.layout.find(lElm => lElm.i === l.i)

    if (elm) {
      elm.c = l.c
    }
  })

  return layoutDef
}
