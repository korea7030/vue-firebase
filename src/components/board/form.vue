<template>
  <v-container fluid v-if="!loaded">
    <v-skeleton-loader type="article"></v-skeleton-loader>
  </v-container>
  <v-container fluid v-else-if="loaded && !board">
    <v-alert type="warning" border="left" class="mb-0">
      게시판 정보를 불러오지 못했습니다
    </v-alert>
  </v-container>
  <v-container v-else fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''">
    <v-form>
      <v-card :loading="loading" outlined :tile="$vuetify.breakpoint.xs">
        <v-toolbar color="transparent" dense flat>
          <v-toolbar-title>게시물 작성</v-toolbar-title>
          <v-spacer/>
          <v-btn icon @click="save" :disabled="!user"><v-icon>mdi-content-save</v-icon></v-btn>
          <v-btn icon @click="$router.push('/board/' + boardId)"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider/>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field v-model="form.category" outlined label="게시판 종류"></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select v-model="form.type" :items="types" outlined label="게시판 유형" :disabled="exists"></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.title" outlined label="제목"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.description" outlined label="설명" hide-details></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-card outlined>
            <v-subheader>등록된 종류</v-subheader>
            <v-card-text>
              <v-chip
                color="info"
                label
                small
                v-for="(item, i) in form.categories"
                :key="i"
                class="mr-2 mb-2">
                {{item}} <v-icon small right @click="removeCategory(item, i)">mdi-close</v-icon>
                </v-chip>
            </v-card-text>
            <v-card-actions>
              <div width="100">
                <v-text-field
                  v-model="category"
                  append-icon="mdi-plus"
                  label="등록"
                  placeholder="eg) social"
                  hide-details
                  outlined
                  dense
                  @click:append="saveCategory"
                  @keypress.enter="saveCategory"
                />
              </div>
            </v-card-actions>
          </v-card>
        </v-card-text>
        <v-card-text>
          <v-card outlined>
            <v-subheader>등록된 태그</v-subheader>
            <v-card-text>
              <v-chip
                color="info"
                label
                small
                outlined
                v-for="(item, i) in form.tags"
                :key="i"
                class="mr-2 mb-2">
                {{item}} <v-icon small right @click="removeTag(item, i)">mdi-close</v-icon>
              </v-chip>
            </v-card-text>
            <v-card-actions>
              <div width="100">
                <v-text-field
                  v-model="tag"
                  append-icon="mdi-plus"
                  label="등록"
                  placeholder="eg) vuetify"
                  hide-details
                  outlined
                  dense
                  @click:append="saveTag"
                  @keypress.enter="saveTag"
                />
              </div>

            </v-card-actions>
          </v-card>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="$router.push('/board/' + boardId)"><v-icon left>mdi-close</v-icon>취소</v-btn>
          <v-btn @click="save" :disabled="!user" text color="primary">
            <v-icon left>mdi-content-save</v-icon> 저장
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>
<script>
import axios from 'axios'
import getSummary from '@/util/getSummary'
import imageCompress from '@/util/imageCompress'
export default {
  props: ['boardId', 'articleId', 'action'],
  data () {
    return {
      form: {
        category: '',
        tags: [],
        title: '',
        description: '',
        categories: [],
        tags: [],
        type: ''
      },
      exists: false,
      loading: false,
      ref: null,
      category: '',
      tag: '',
      loaded: false,
      types: ['일반', '갤러리', '페이지']
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    fireUser () {
      return this.$store.state.fireUser
    }
  },
  watch: {
    boardId () {
      this.fetch()
    },
    articleId () {
      this.fetch()
    },
    action () {
      this.fetch()
    }
  },
  created () {
    this.fetch()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    async fetch () {
      this.ref = this.$firebase.firestore().collection('boards').doc(this.boardId)
      this.loaded = false
      const docBoard = await this.ref.get()
      this.loaded = true
      this.board = docBoard.data()
      const doc = await this.ref.collection('articles').doc(this.articleId).get()
      this.exists = doc.exists

      if (this.exists) {
        const item = doc.data()
        this.form.category = item.category
        this.form.title = item.title
        this.form.description = item.description
        this.form.categories = item.categories
        this.form.tags = item.tags
        this.form.type = item.type
      }
    },
    async save () {
      if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다')
      if (!this.form.category || !this.form.title) throw Error('종류 제목은 필수 항목입니다')
      const r = await this.$swal.fire({
        title: '정말 추가하시겠습니까?',
        text: '추가 후 게시판 형태를 변경할 수 없습니다.',
        icon: 'warning',
        // confirmButtonText: 'Cool',
        showCancelButton: true
      })
      if (!r.value) return
      const form = {
        category: this.form.category,
        title: this.form.title,
        description: this.form.description,
        categories: this.form.categories,
        tags: this.form.tags,
        type: this.form.type,
        updatedAt: new Date()
      }
      this.loading = true
      try {
        const doc = {
          title: this.form.title,
          category: this.form.category,
          tags: this.form.tags,
          images: this.findImagesFromDoc(md, this.form.images), // this.form.images,
          updatedAt: new Date(),
          summary: getSummary(md, 300, 'data:image'),
          important: this.form.important
        }
        if (!this.exists) {
          form.createdAt = new Date()
          form.count = 0
          form.uid = this.$store.state.fireUser.uid
          form.user = {
            email: this.$store.state.user.email,
            photoURL: this.$store.state.user.photoURL,
            displayName: this.$store.state.user.displayName
          }
          form.readCount = 0
          form.commentCount = 0
          form.likeCount = 0
          // form.categories = ['일반']
          // form.tags = ['vue', 'firebase']
          await this.ref.set(form)
        } else {
          const fn = this.articleId + '-' + this.article.uid + '.md'
          await this.$firebase.storage().ref().child('boards').child(this.boardId).child(fn).putString(md)
          await this.ref.collection('articles').doc(this.articleId).update(doc)
          this.$router.push(this.$route.path)
        }
      } finally {
        this.loading = false
      }
    },
    findImagesFromDoc (md, images) {
      const filteredImages = images.filter(image => {
        return md.indexOf(image.url) >= 0
      })
      return filteredImages
    },
    async imageUpload (file) {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      const thumbnail = await imageCompress(file)
      const image = {
        size: file.size,
        id: '',
        url: '',
        thumbSize: thumbnail.size,
        thumbId: '',
        thumbUrl: ''
      }
      image.id = new Date().getTime() + '-' + this.fireUser.uid + '-' + file.name
      const sn = await this.$firebase.storage().ref()
        .child('images').child('boards')
        .child(this.boardId).child(this.articleId).child(image.id)
        .put(file)
      image.url = await sn.ref.getDownloadURL()
      image.thumbId = new Date().getTime() + '-' + this.fireUser.uid + '-thumb-' + file.name
      const snt = await this.$firebase.storage().ref()
        .child('images').child('boards')
        .child(this.boardId).child(this.articleId).child(image.thumbId)
        .put(thumbnail)
      image.thumbUrl = await snt.ref.getDownloadURL()
      this.form.images.push(image)
      return image
    },
    addImageBlobHook (blob, callback) {
      this.imageUpload(blob)
        .then(image => {
          callback(image.url, 'img')
        })
        .catch(console.error)
    }
  }
}
</script>
