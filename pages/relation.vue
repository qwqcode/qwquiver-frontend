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
            <option value="nabbr">Nabbr</option>
            <option value="nclass">Nclass</option>
            <option value="varatar">Varatar*</option>
            <option value="ndetail">Ndetail*</option>
          </select>
          <input
            ref="inputA"
            type="text"
            :placeholder="
              !signalNameUse.includes(params.use) ? 'Name A' : 'Name'
            "
            autocomplete="off"
          />
          <span v-show="!signalNameUse.includes(params.use)">
            &
            <input
              ref="inputB"
              type="text"
              placeholder="Name B"
              autocomplete="off"
            />
          </span>
          <span v-show="!noNeedPasswdUse.includes(params.use)">
            <input
              v-model="params.passwd"
              type="password"
              placeholder="Password"
              autocomplete="off"
            />
          </span>
          <input type="submit" value="GO" />
          <br />
          <br />
        </form>

        <LoadingLayer ref="loading" :delay="0" />

        <div
          v-show="showNetwork"
          ref="networkGraph"
          class="network-graph"
        ></div>
        <article class="markdown-body" v-html="ResultText" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'github-markdown-css/github-markdown.css'
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import _ from 'lodash'
import marked from 'marked'
import $ from 'jquery'
import LoadingLayer from '../components/LoadingLayer.vue'
import * as ApiT from '../types/ApiTypes'

function initMarked() {
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
    xhtml: false,
  })

  return nMarked
}

@Component({
  components: { LoadingLayer },
})
export default class RelationPage extends Vue {
  params: ApiT.RelationParams = {
    use: 'middle',
    a: '',
    b: '',
    passwd: '',
  }
  data: ApiT.RelationData | null = null
  loading!: LoadingLayer
  marked = initMarked()

  signalNameUse = ['varatar', 'nabbr', 'ndetail', 'nclass']
  noNeedPasswdUse = ['nabbr', 'nclass']

  showNetwork = false

  head() {
    return {
      title: 'Relations',
      script: [
        {
          src: '/lib/vis-network.min.js',
        },
      ],
    }
  }

  mounted() {
    this.loading = this.$refs.loading as LoadingLayer

    const acConf: any = {
      noCache: true,
      serviceUrl: this.$axios.defaults.baseURL + 'api/relation/autocomplete',
      // deferRequestBy: 100,
      transformResult: (response) => {
        const data = JSON.parse(response)
        return {
          suggestions: $.map(data.data.names, (name) => {
            return { value: name, data: name }
          }),
        }
      },
    }

    ;($(this.$refs.inputA) as any).autocomplete(acConf)
    ;($(this.$refs.inputB) as any).autocomplete(acConf)

    if (this.$route.query.name) {
      $(this.$refs.inputA).val(this.$route.query.name as any)
    }
  }

  async submit(evt: HTMLFormElement) {
    this.params.a = $(this.$refs.inputA).val() as string
    this.params.b = $(this.$refs.inputB).val() as string

    if (this.params.a.trim() === '') {
      this.$notify.warning('请填入名字')
      return
    }
    if (
      !this.signalNameUse.includes(this.params.use) &&
      this.params.b.trim() === ''
    ) {
      this.$notify.warning('请填入名字')
      return
    }

    this.loading.show()
    let respData
    try {
      respData = await this.$axios.$get('/api/relation', {
        params: this.params,
      })
    } finally {
      this.loading.hide()
    }
    if (!respData || !respData.success || !respData.data) {
      return
    }
    this.data = respData.data as ApiT.RelationData
    if ((this.data as any).graph) {
      this.drawNetworkGraph((this.data as any).graph)
      console.log((this.data as any).graph)
    }
  }

  get ResultText() {
    if (!this.data || !this.data.text) return ''
    return marked(this.data.text)
  }

  drawNetworkGraph(data: any) {
    const vis = (window as any).vis
    // const nodes = new vis.DataSet([
    //   { id: 1, label: "Node 1" },
    //   { id: 2, label: "Node 2" },
    //   { id: 3, label: "Node 3" },
    //   { id: 4, label: "Node 4" },
    //   { id: 5, label: "Node 5" },
    // ]);

    // // create an array with edges
    // const edges = new vis.DataSet([
    //   { from: 1, to: 3 },
    //   { from: 1, to: 2 },
    //   { from: 2, to: 4 },
    //   { from: 2, to: 5 },
    //   { from: 3, to: 3 },
    // ]);

    // // create a network
    // const data = {
    //   nodes,
    //   edges,
    // };
    const options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30,
        },
        font: {
          size: 12,
          face: 'Tahoma',
        },
      },
      edges: {
        color: { inherit: true },
        width: 0.15,
        smooth: {
          type: 'continuous',
        },
      },
      interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 200,
      },
      configure: {
        // filter: (option, path) => {
        //   return false
        // },
        showButton: false,
      },
      physics: false,
    }
    const network = new vis.Network(this.$refs.networkGraph, data, options)
    this.showNetwork = true
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

input[type='text'] {
  margin-bottom: 10px;
}

.markdown-body /deep/ img {
  max-height: calc(100vh - 300px);
}

.network-graph {
  width: 100%;
  height: 1000px;
  border: 1px solid lightgray;
}
</style>
