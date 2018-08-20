import { get } from 'lodash-es'

export const rewardFund = ({ rewardFund }) => rewardFund
export const dynamicProperties = ({ dynamicProperties }) => dynamicProperties
export const feedPrice = ({ feedPrice }) => feedPrice
export const recentClaims = ({ rewardFund }) => get(rewardFund, 'recent_claims', 0)
export const rewardBalance = ({ rewardFund }) => get(rewardFund, 'reward_balance', 0)
export const baseFeedPrice = ({ feedPrice }) => get(feedPrice, 'base', 0)
export const userDetails = ({ userDetails }) => userDetails
export const steemUser = ({ userDetails }) => get(userDetails, 'name', null)
