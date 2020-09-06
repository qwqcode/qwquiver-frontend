<template>
<div ref="chart" class="chart"></div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import _ from 'lodash'
import $ from 'jquery'
import LoadingLayer from '../components/LoadingLayer.vue'
import * as ApiT from '../types/ApiTypes'

@Component({
  components: { LoadingLayer }
})
export default class Chart extends Vue {
  data: ApiT.ChartData | null = null
  params: ApiT.ChartParams | null = null
  loading!: LoadingLayer

  mounted () {
    this.loading = this.$refs.loading as LoadingLayer
    this.adjustDisplay()

    this.onRouteQueryChanged(this.$route.query)
  }

  adjustDisplay () {
    $(this.$el).css('height', `${this.$app.getContentHeight()}px`)
  }

  @Watch('$route.query')
  async onRouteQueryChanged (query: any) {
    if (query === this.params) return

    this.loading.show()
    this.params = query
    const respData = await this.$axios.$get('./api/chart', {
      params: this.params
    })
    this.loading.hide()
    if (respData.success) {
      this.data = respData.data
      this.drawChart()
    }
  }

  drawChart () {
    if (this.data === null || !this.data.chartData)
      return

    const ds = new DataSet()
    const dv = ds.createView().source(this.data.chartData)
    dv.transform({
      type: 'fold',
      fields:  [...this.data.fieldList], // 展开字段集
      key: 'subject', // key字段
      value: 'score' // value字段
    })

    const chart = new G2.Chart({
      container: this.$refs.chart as HTMLDivElement,
      forceFit: true,
      height: this.$app.getContentHeight()
    })
    chart.source(dv, {})
    chart.scale({
      score: {
        min: 0,
        max: 100,
      }
    })
    chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    })
    chart.axis('score', {
      label: {
        formatter: (val) => {
          return val
        }
      }
    })
    chart
      .line()
      .position('exam*score')
      .color('subject')
      .shape('circle')
    chart
      .point()
      .position('exam*score')
      .color('subject')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1
      })
    chart.render()
  }
}
</script>

<style scoped lang="scss">
.sidebar {

}
</style>
