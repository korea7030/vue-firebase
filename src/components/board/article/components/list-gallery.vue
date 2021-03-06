<template>
  <v-container fluid>
    <v-row dense>
      <template v-for="item in items">
        <v-col cols="6" sm="4" md="3" lg="2" :key="item.id">
          <v-card
            color=""
            height="100%"
            @click="$router.push(toPath(item))">
            <v-system-bar color="secondary">
              <span class="font-italic caption hidden-xs-only"><display-time :time="item.createdAt"></display-time></span>
              <v-spacer/>
              <display-count :item="item" :column="false" size="small"></display-count>
            </v-system-bar>
            <v-img
              :src="srcFromItem(item)"
              :aspect-ratio="1"
              class="align-end"
            >
              <v-card-actions>
                <v-spacer/>
                <v-btn
                  small dark color="primary" icon @click.native.stop="item.overlay=true">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
            <v-list-item class="text-truncate align-center hidden-xs-only">
              <v-list-item-content>
                <v-list-item-subtitle>
                  <v-icon v-if="item.important === 1" small left color="success">mdi-bell-ring</v-icon>
                  <v-icon v-else-if="item.important === 2" small left color="warning">mdi-alert-circle</v-icon>
                  <v-icon v-if="newCheck(item.updatedAt, 'hours', 1)" small color="error" left>mdi-fire</v-icon>
                  <span>{{item.title}}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <display-user :user="item.user" size="small"></display-user>
              </v-list-item-action>
            </v-list-item>
            <v-overlay
              absolute
              :opacity="0.7"
              :value="item.overlay"
              @click.native.stop="item.overlay = false"
            >
              <v-container fill-height fluid>
                <v-card color="transparent" flat tile>
                  <v-card-subtitle class="white--text">
                    <span>{{item.title}}</span>
                  </v-card-subtitle>
                </v-card>
              </v-container>
            </v-overlay>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script>
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
import DisplayCount from '@/components/display-count'
import addYoutubeIframe from '@/util/addYoutubeIframe'
import isGif from '@/util/isGif'
import newCheck from '@/util/newCheck'
import getImageUrlFromMd from '@/util/getImageUrlFromMd'
// const LIMIT = 5
export default {
  components: { DisplayTime, DisplayUser, DisplayCount },
  props: ['items', 'boardId', 'category'],
  data () {
    return {
      newCheck,
      vis: false
    }
  },
  computed: {
    fireUser () {
      return this.$store.state.fireUser
    }
  },
  created () {
  },
  methods: {
    read (item) {
      this.$router.push({ path: this.$route.path + '/' + item.id })
    },
    liked (item) {
      if (!this.fireUser) return false
      return item.likeUids.includes(this.fireUser.uid)
    },
    onViewerLoad (v) {
      addYoutubeIframe(v.preview.el, this.$vuetify.breakpoint)
    },
    toPath (item) {
      const to = { path: `/board/${this.boardId}/${item.id}` }
      if (this.category) to.query = { category: this.category }
      return to
    },
    srcFromItem (item) {
      if (!item.images.length) return getImageUrlFromMd(item.summary)
      return isGif(item.images[0].id)
        ? item.images[0].url
        : item.images[0].thumbUrl
    }
  }
}
</script>
