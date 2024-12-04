import { DeepPartial } from 'chart.js/dist/types/utils'
import { DataPoolInput, MetricInput } from '../../graphql'

export function patchMetricInputDataPool(
  metric: DeepPartial<MetricInput> | string | undefined,
  defaultDataPool: DataPoolInput | null | undefined
) {
  const metricInputKeys = Object.keys(metric ?? {})

  const usedMetricType = metricInputKeys[0]

  if (metricInputKeys.includes('dataPool')) {
    return metric
  }

  if (!['name', 'id'].includes(usedMetricType) && defaultDataPool != null && typeof metric === 'object') {
    metric = {
      ...metric,
      [usedMetricType]: {
        // @ts-expect-error - already checked if usedMetricType can index metric
        ...metric[usedMetricType],
        dataPool: defaultDataPool
      }
    }
  }

  return metric
}
