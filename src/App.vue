<template>
  <v-app>
    <v-app-bar app :color="toggle ? 'primary': ''" :dark="toggle? true: false">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <site-title :title="site.title"></site-title>
      <v-spacer/>
      <v-card-actions>
        <v-btn color="info" small fab @click="darkMode">
            <v-icon color="yellow">mdi-white-balance-sunny</v-icon>
          </v-btn>
      </v-card-actions>
      <site-search/>
      <site-sign></site-sign>
    </v-app-bar>
    <v-navigation-drawer
      app
      v-model="drawer"
      :width="$store.state.editable ? 380 : null"
      :color="toggle ? 'primary': ''"
      :dark="toggle? true: false"
      >
      <!-- :width="$store.state.editable ? 380 : null" -->
      <site-menu :items="site.menu" @close="drawer=false"></site-menu>
    </v-navigation-drawer>
    <v-main :color="toggle ? 'primary': ''" :dark="toggle? true: false">
      <router-view/>
    </v-main>
    <site-footer :toggle="this.toggle" :footer="site.footer"></site-footer>
  </v-app>
</template>

<script>
import SiteTitle from '@/views/site/title'
import SiteFooter from '@/views/site/footer'
import SiteMenu from '@/views/site/menu'
import SiteSign from '@/views/site/sign'
// import SiteSearch from '@/views/site/search'

export default {
  components: { SiteTitle, SiteFooter, SiteMenu, SiteSign },
  name: 'App',
  data () {
    return {
      toggle: false,
      drawer: false,
      site: {
        menu: [
          {
            title: 'home',
            icon: 'mdi-home',
            subItems: [
              {
                title: 'Dashboard',
                to: '/'
              },
              {
                title: 'About',
                to: '/about'
              }
            ]
          },
          {
            title: 'about',
            active: true,
            icon: 'mdi-account',
            subItems: [
              {
                title: 'xxx',
                to: '/xxx'
              }
            ]
          }
        ],
        title: '나의 타이틀입니다',
        footer: '푸터입니다'
      }
    }
  },
  created () {
    this.subscribe()
  },
  methods: {
    subscribe () {
      this.$firebase.database().ref().child('site').on('value', (sn) => {
        const v = sn.val()
        if (!v) {
          this.$firebase.database().ref().child('site').set(this.site)
          return
        }
        this.site = v
      }, (e) => {
        console.log(e.message)
      })
    },
    darkMode () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>
<style>
.white-space {
  white-space: pre-wrap;
}
</style>
