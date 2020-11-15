import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'

import en from 'vuetify/es5/locale/en'
import ko from 'vuetify/es5/locale/ko'

const theme = {
  themes: {
    light: {
      primary: '#344059',
      secondary: '#BFBFBF', // #FFCDD2
      accent: '#2C4027',
      info: '#4E7DA6',
      success: '#26A699',
      warning: '#F29727',
      error: '#F24C3D'

      // success: '#2C4027'
    },
    dark: {
      primary: '#E53935', // #E53935
      secondary: '#FFCDD2', // #FFCDD2
      accent: '#3F51B5' // #3F51B5
    }
  }
}

const VuetifyObj = new Vuetify({
  lang: {
    locales: { en, ko },
    current: 'ko'
  },
  theme
})

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
})

export default VuetifyObj
