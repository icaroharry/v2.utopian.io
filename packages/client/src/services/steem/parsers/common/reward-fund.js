// custom reward fund parser.
export const parseRewardFund = (rewardFund) => {
  rewardFund.recent_claims = parseInt(rewardFund.recent_claims)
  rewardFund.reward_balance = parseInt(rewardFund.reward_balance)

  return rewardFund
}
