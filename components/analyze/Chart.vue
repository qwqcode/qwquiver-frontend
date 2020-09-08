<template>
  <div class="chart-wrap">
    <LoadingLayer ref="loading" :delay="0" />
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'nuxt-property-decorator'
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import _ from 'lodash'
import $ from 'jquery'
import LoadingLayer from '../LoadingLayer.vue'
import * as ApiT from '../../types/ApiTypes'
import { FTrans } from '~/types/Field/Trans'

@Component({
  components: { LoadingLayer }
})
export default class Chart extends Vue {
  chart: G2.Chart | null = null
  loading!: LoadingLayer
  chartEl!: HTMLElement

  mounted () {
    this.loading = this.$refs.loading as LoadingLayer
    this.chartEl = this.$refs.chart as HTMLElement

    this.adjustDisplay()
  }

  adjustDisplay () {
    $(this.chartEl).css('height', `${$(this.$el).height()}px`)
  }

  drawChart (data: ApiT.AnalyzeData) {
    if (data === null || !data.exams)
      return

    const ds = new DataSet()
    const dv = ds.createView().source(data.exams)
    dv.transform({
      type: 'fold',
      fields:  [...data.fieldList], // 展开字段集
      key: 'subject', // key字段
      value: 'score' // value字段
    })

    this.chart = new G2.Chart({
      container: this.chartEl as HTMLDivElement,
      forceFit: true,
      height: $(this.$el).height()
    })
    this.chart.source(dv, {})
    this.chart.scale({
      score: {
        min: 0,
        max: 100,
      }
    })
    this.chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    })
    this.chart.axis('score', {
      label: {
        formatter: (val) => {
          return val
        }
      }
    })
    this.chart
      .line()
      .position('exam*score')
      .color('subject')
      .shape('circle')
    this.chart
      .point()
      .position('exam*score')
      .color('subject')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1
      })
    this.chart.render()
  }
}
</script>

<style scoped lang="scss">
.chart-wrap {
  display: block;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
</style>
