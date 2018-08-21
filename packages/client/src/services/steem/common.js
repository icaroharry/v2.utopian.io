// imports.
import { api } from 'src/services/steem/client'
import { parseRewardFund } from './parsers/common/reward-fund'
import { memoize } from 'lodash-es'

// reward fund getter.
export const getRewardFund = memoize(() => api.getRewardFundAsync('post').then(parseRewardFund))

// dynamic global properties getter.
export const getDynamicGlobalProperties = memoize(() => api.getDynamicGlobalPropertiesAsync())

// current median history price getter.
export const getMedianFeedPrice = memoize(() => api.getCurrentMedianHistoryPriceAsync())
