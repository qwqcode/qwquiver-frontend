<template>
  <div class="card">
    <div class="card-header">
        <h2 class="card-title">关于</h2>
    </div>
    <div class="card-block">
        <p>本站提供获取相关互联网数据的便捷途径，<p/><p>以数据分享为目的，<p/><p>属非盈利性网站。<p/>
        <br/>
        <p><strong>免责声明</strong><p/><p>本站数据均收集自互联网，以方便浏览者为目的，只供作为信息参考，且不具有任何法律效应。<br/>一切因使用或信赖该网站内容（数据）而造成的任何直接或间接损失，本站拒绝承担任何责任。<p/>
        <p><strong>隐私保护</strong><p/><p>若您觉得对您造成了隐私的泄露，请联系本站管理员对相应数据进行删除，谢谢！</p>
        <br/>
        <h3>开源程序驱动</h3>
        <p><i>本站由 <a href="https://github.com/qwqcode/qwquiver" target="_blank">QWQUIVER</a> 强力驱动</i></p>
        <p><a href="https://github.com/qwqcode/qwquiver" target="_blank">QWQUIVER</a> 是一个开源的成绩查询，学生考试成绩查询统计站<br/>A website for exploring and analyzing exam results.</p>
        <p>Made with ♥ by <a href="https://github.com/qwqcode" target="_blank">QWQCODE</a></p>
        <p>程序作者：</p>
        <ul>
            <li>Blog: <a href="https://qwqaq.com" target="_blank">qwqaq.com</a></li>
            <li>GitHub: <a href="https://github.com/qwqcode" target="_blank">@qwqcode</a></li>
            <li>Telegram: <a href="https://t.me/qwqcode" target="_blank">@qwqcode</a></li>
        </ul>
        <p>版权声明：</p>
        <p>Copyright (C) {{new Date().getFullYear()}} <a href="https://qwqaq.com" target="_blank">qwqaq.com</a></p>
        <p><sub>和 QWQUIVER 相关的未经允许的代码和衍生品不得用于商业用途，侵权必究</sub></p>
        <p><sub>* 注：本站所有内容（数据）与程序作者无关，程序作者拒绝承担任何责任</sub></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class AboutPage extends Vue {}
</script>

<style scoped lang="scss">
</style>
