<template>
  <div class="analyze">
    <LoadingLayer ref="loading" :delay="0" />
    <template v-if="!!data">
    <div class="card">
      <div class="profile">
        <div v-show="false" class="avatar">
        </div>
        <div class="meta">
          <h2 class="name">{{ data.name }}</h2>
          <p class="school-class">{{ data.school }} · {{ data.class }}</p>
          <p>共参加 {{ data.examCount }} 次 {{ data.examGrp }} 考试</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="exam-chart">
        <Chart ref="chart" />
      </div>
    </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import _ from 'lodash'
import Chart from '../components/analyze/Chart.vue'
import LoadingLayer from '../components/LoadingLayer.vue'
import * as ApiT from '../types/ApiTypes'

@Component({
  components: { Chart, LoadingLayer }
})
export default class AnalyzePage extends Vue {
  params: ApiT.AnalyzeParams | null = null
  data: ApiT.AnalyzeData | null = null

  loading!: LoadingLayer

  mounted () {
    this.loading = this.$refs.loading as LoadingLayer

    this.request(this.$route.query)
  }

  async request (params: ApiT.AnalyzeParams) {
    this.params = params

    this.loading.show()
    const respData = await this.$axios.$get('./api/analyze', {
      params: this.params
    })
    this.loading.hide()
    if (respData.success) {
      this.data = respData.data
      this.$nextTick(() => {
        if (this.data == null) return
        const chart = this.$refs.chart as Chart
        this.data.exams = _.sortBy(this.data.exams, (o) => o.date ? +(new Date(o.date).getTime()) : -1)
        chart.drawChart(this.data)
      })
    }
  }

  @Watch('$route.query')
  async onRouteQueryChanged (query: any) {
    if (query === this.params) return

    this.request(query)
  }
}
</script>

<style scoped lang="scss">
.analyze {
  min-height: calc(100vh - 100px);
  position: relative;

  .profile {
    display: flex;
    flex-direction: row;
    height: 140px;
    overflow: hidden;

    .avatar {
      position: relative;
      overflow: hidden;
      height: 140px;
      width: 100px;
      background: #eee;
    }

    .meta {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 13px;
      margin-left: 13px;
      flex: 1;

      .name {
        color: #000;
        font-size: 25px;
        font-weight: normal;
        margin-bottom: 13px;
      }

      p {
        margin-bottom: 6px;
      }

      .school-class {

      }
    }
  }
}

.exam-chart {
  height: 550px;
}
</style>
