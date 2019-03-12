<script>
import { mapGetters } from 'vuex'

export default {
  name: 'bounty-view-activity-tab',
  computed: {
    ...mapGetters('bounties', ['activity'])
  }
}
</script>

<template lang="pug">
q-tab-pane.bounty-activity(name="activity")
  q-timeline(responsive)
    q-timeline-entry(
      v-for="(entry, i) in activity"
      :key="i"
      :side=" i % 2 === 0 ? 'left' : 'right'"
      :icon="entry.icon"
      :color="entry.color"
    )
      .q-timeline-title(slot="title")
        .flex.items-center.timeline-content
          img.timeline-avatar.q-mr-sm(:src="entry.user.avatarUrl")
          .timeline-content-text(v-html="$t(`bounties.activity.${entry.key}`, { ...entry.data, user: entry.user.username })")
      .q-timeline-subtitle.activity-date(slot="subtitle") {{ $d(new Date(entry.createdAt), 'short') }}
</template>

<style lang="stylus">
@import "~variables"
.bounty-activity
  .activity-date
    @media (min-width $breakpoint-md-max)
      line-height 40px
  .timeline-avatar
    width 35px
    height 35px
    border-radius 50%
  .q-timeline-entry-left
    .timeline-content
      @media (min-width $breakpoint-sm-max)
        justify-content flex-end
      .timeline-content-text
        max-width 400px
  .timeline-content
    margin-top -6px
</style>
