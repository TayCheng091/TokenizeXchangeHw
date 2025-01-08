export enum ChartInterval {
  ONE_MINUTE = '1m',
  THREE_MINUTES = '3m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  ONE_HOUR = '1h',
  TWO_HOURS = '2h',
  FOUR_HOURS = '4h',
  SIX_HOURS = '6h',
  EIGHT_HOURS = '8h',
  TWELVE_HOURS = '12h',
  ONE_DAY = '1d',
  THREE_DAYS = '3d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
}

export interface IntervalOption {
  value: ChartInterval;
  viewValue: string;
}

export interface CryptoPrice {
  symbol: string;
  price: string;
}

export interface CandleStickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
