<template>
  <div class="relation card">
    <div class="card-header">
        <h2 class="card-title"><i class="zmdi zmdi-link" /> - Relations</h2>
    </div>
    <div class="card-block">
      <div class="result-box">

      <form @submit.prevent="submit">
        <select v-model="params.use">
          <option value="middle">Middle</option>
          <option value="between">Between</option>
        </select>
        <input v-model="params.a" type="text" placeholder="A’s Name" /> & <input v-model="params.b" type="text" placeholder="B's Name" /> <input v-model="params.passwd" type="password" placeholder="Password" /> <input type="submit" value="GO" />
        <br/>
        <br/>
      </form>

        <LoadingLayer ref="loading" :delay="0" />

        <article v-html="ResultText" class="markdown-body" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'github-markdown-css/github-markdown.css'
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import _ from 'lodash'
import marked from 'marked'
import LoadingLayer from '../components/LoadingLayer.vue'
import * as ApiT from '../types/ApiTypes'

function initMarked () {
    const renderer = new marked.Renderer()
    const linkRenderer = renderer.link
    renderer.link = (href, title, text) => {
      const html = linkRenderer.call(renderer, href, title, text)
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
    }

    const nMarked = marked
    nMarked.setOptions({
      renderer,
      pedantic: false,
      gfm: true,
      breaks: true,
      sanitize: true, // 净化
      smartLists: true,
      smartypants: true,
      xhtml: false
    })

    return nMarked
}

@Component({
  components: { LoadingLayer }
})
export default class RelationPage extends Vue {
  params: ApiT.RelationParams = {
    use: 'middle',
    a: '',
    b: '',
    passwd: ''
  }
  data: ApiT.RelationData | null = null
  loading!: LoadingLayer
  marked = initMarked()

  mounted () {
    this.loading = this.$refs.loading as LoadingLayer
  }

  async submit (evt: HTMLFormElement) {
    if (this.params.a.trim() === '') { this.$notify.warning('请填入 A 的名字');return }
    if (this.params.b.trim() === '') { this.$notify.warning('请填入 B 的名字');return }

    this.loading.show()
    let respData
    try {
      respData = await this.$axios.$get('/api/relation', {
        params: this.params
      })
    } finally {
      this.loading.hide()
    }
    if (!respData || !respData.success || !respData.data) {
      return
    }
    this.data = respData.data as ApiT.RelationData
  }

  get ResultText () {
    if (!this.data || !this.data.text) return ''
    return marked(this.data.text)
  }
}
</script>

<style scoped lang="scss">
.relation {

}

.result-box {
    padding: 12px;
    max-width: 100%;
    min-height: calc(100vh - 300px);
    width: 100%;
    border: 1px solid #dadada;
}

input[type="text"] {
    margin-bottom: 10px;
}
</style>
