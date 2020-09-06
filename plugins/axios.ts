export default function ({ $axios, redirect }) {
  // $axios.onRequest(config => {
  //   console.log('Making request to ' + config.url)
  // })

  $axios.onError((err: any, b) => {
    const code = parseInt(err.response && err.response.status)
    if (code !== 200) {
      if (!!err.response && !!err.response.data && !!err.response.data.msg) {
        window.notify(String(err.response.data.msg), 'e')
      } else {
        window.notify(String(err), 'e')
      }
    }
  })
}
