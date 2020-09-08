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
          <p class="school-class">
            <span class="school">{{ data.school }}</span> ·
            <span v-for="v in data.classList" :key="v" class="class">{{ v }}</span>
          </p>
          <p>共参加 {{ data.examCount }} 次 {{ data.examGrp }} 考试</p>
        </div>
        <div class="actions">
          <span @click="() => { viewMode = viewMode == 'chart' ? 'text' : 'chart'}"><template v-if="viewMode == 'chart'">文字</template><template v-if="viewMode == 'text'">图表</template>模式</span>
        </div>
      </div>
    </div>

    <div class="card">
      <div v-if="viewMode == 'chart'" class="exam-chart">
        <Chart ref="chart" />
      </div>
      <div v-else-if="viewMode == 'text'" class="exams-text">
        <table>
          <tr>
            <th>名称</th>
            <th v-for="f in data.fieldList" :key="f">{{ f }}</th>
            <th>时间</th>
          </tr>
          <tr v-for="exam in data.exams" :key="exam.exam">
            <td><strong>{{ exam.exam }}</strong></td>
            <td v-for="f in data.fieldList" :key="f">{{ exam[f] || '' }}</td>
            <td>{{ exam.date }}</td>
          </tr>
        </table>
        <div class="pure-text">
          <ul v-for="exam in data.exams" :key="exam.exam">
            <h4>{{ exam.exam }}</h4>
            <span v-for="f in data.fieldList" :key="f"><li v-if="!!exam[f]"><strong>{{f}}</strong>：{{ exam[f] || '' }}</li></span>
            <p><sub>(时间：{{ exam.date }})</sub></p>
            <hr/>
          </ul>
        </div>
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
  viewMode: 'text'|'chart' = !this.$app.isMobile ? 'chart' : 'text'

  mounted () {
    this.loading = this.$refs.loading as LoadingLayer

    this.request(this.$route.query)
  }

  async request (params: ApiT.AnalyzeParams) {
    this.params = params

    this.loading.show()
    const respData = await this.$axios.$get('/api/analyze', {
      params: this.params
    })
    this.loading.hide()
    if (respData.success) {
      this.data = respData.data
      this.$nextTick(() => {
        if (this.data == null) return
        this.data.exams = _.sortBy(this.data.exams, (o) => o.date ? +(new Date(o.date).getTime()) : -1) // 时间排序
        this.drawChartByData()
      })
    }
  }

  @Watch('$route.query')
  async onRouteQueryChanged (query: any) {
    if (query === this.params) return

    this.request(query)
  }

  @Watch('viewMode')
  onViewModeChanged () {
    if (this.viewMode === 'chart' && this.data != null) {
      this.drawChartByData()
    }
  }

  drawChartByData () {
    if (this.viewMode !== 'chart' || this.data == null) return

    this.$nextTick(() => {
      if (this.data == null) return
      const chart = this.$refs.chart as Chart
      chart.drawChart(this.data)
    })
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
        .school {

        }

        .class {
          &:not(:last-child) {
            margin-right: 8px;
          }
        }
      }
    }

    .actions {
      display: flex;
      place-content: center;
      justify-content: center;
      align-items: center;
      padding-right: 30px;

      span {
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        color: var(--mainColor);
        border: 2px solid var(--mainColor);
        padding: 4px 14px;
        border-radius: 3px;
      }
    }
  }
}

.exam-chart {
  height: calc(100vh - 210px);
}

.exams-text {
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid #f4f4f4;
  }

  table th {
    font-weight: bold;
    border: 1px solid #dfe2e5;
    padding: 6px 13px;
  }

  table td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }

  table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }

  table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
}

.pure-text {
  display: none;
}

@include mq(mobile, tablet) {
  .exams-text table {
    display: none;
  }

  .pure-text {
    display: block;
    padding: 30px 0;

    h4 {
      color: var(--mainColor)
    }


    hr {
      border: 1px dashed #828282;
    }
  }
}
</style>
