import { TimeSeriesGranularity } from '../../helpers'

import { getLabelsBasedGranularity } from './utils'

describe('TimeSeries/utils', () => {
  describe('getLabelsBasedGranularity', () => {
    it('should return MINUTE for minute granularity', () => {
      const labels = [
        '2023-08-29T21:00:00Z',
        '2023-08-29T21:01:00Z',
        '2023-08-29T21:02:00Z',
        '2023-08-29T21:03:00Z',
        '2023-08-29T21:04:00Z',
        '2023-08-29T21:05:00Z',
        '2023-08-29T21:06:00Z',
        '2023-08-29T21:07:00Z',
        '2023-08-29T21:08:00Z',
        '2023-08-29T21:09:00Z',
        '2023-08-29T21:10:00Z',
        '2023-08-29T21:11:00Z',
        '2023-08-29T21:12:00Z',
        '2023-08-29T21:13:00Z',
        '2023-08-29T21:14:00Z'
      ]

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.Minute)
    })

    it('should return FIVE_MINUTES for five minutes granularity', () => {
      const labels = ['2023-08-29T21:00:00Z', '2023-08-29T21:05:00Z', '2023-08-29T21:10:00Z', '2023-08-29T21:15:00Z']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.FiveMinutes)
    })

    it('should return TEN_MINUTES for ten minutes granularity', () => {
      const labels = ['2023-08-29T20:50:00Z', '2023-08-29T21:00:00Z', '2023-08-29T21:10:00Z']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.TenMinutes)
    })

    it('should return FIFTEEN_MINUTES for fifteen minutes granularity', () => {
      const labels = ['2023-08-29T21:00:00Z', '2023-08-29T21:15:00Z', '2023-08-29T21:30:00Z', '2023-08-29T21:45:00Z']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.FifteenMinutes)
    })

    it('should return HOUR for hour granularity', () => {
      const labels = ['2023-08-29T18:00:00Z', '2023-08-29T19:00:00Z', '2023-08-29T20:00:00Z', '2023-08-29T21:00:00Z']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.Hour)
    })

    it('should return DAY for day granularity', () => {
      const labels = [
        '2023-08-23T05:00:00Z',
        '2023-08-24T05:00:00Z',
        '2023-08-25T05:00:00Z',
        '2023-08-26T05:00:00Z',
        '2023-08-27T05:00:00Z',
        '2023-08-28T05:00:00Z',
        '2023-08-29T05:00:00Z'
      ]

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.Day)
    })

    it('should return WEEK for week granularity', () => {
      const labels = ['2023-07-31', '2023-08-07', '2023-08-14', '2023-08-21', '2023-08-28']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.Week)
    })

    it('should return MONTH for month granularity', () => {
      const labels = ['2023-06-01T00:00:00.000Z', '2023-07-01T00:00:00.000Z', '2023-08-01T00:00:00.000Z']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.Month)
    })

    it('should return YEAR for year granularity', () => {
      const labels = ['2019-01-01', '2020-01-01', '2021-01-01', '2022-01-01', '2023-01-01']

      const result = getLabelsBasedGranularity(labels)

      expect(result).toEqual(TimeSeriesGranularity.Year)
    })
  })
})
