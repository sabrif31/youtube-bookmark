// ==UserScript==
// @name     Youtube Bookmark
// @namespace https://github.com/siefkenj/crowdmark-addons
// @version  1.1
// @description A bookmark timeline for the youtube video
// @match https://www.youtube.com/watch?v=*
// @grant        GM_registerMenuCommand
// ==/UserScript==

function parserVideoIdJSON(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : false
}
// EXPORT LOCALSTORAGE
const exportBookmark = (isAll) => {
  const localGetItem = localStorage.getItem('youtube-bookmark')
  if (localGetItem) {
    const localStorageData = JSON.parse(localGetItem)
    const youtubeId = parserVideoIdJSON(document.location.href)
    // const videoTitle = document.querySelector('#above-the-fold yt-formatted-string').innerText
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    const json = JSON.stringify(isAll ? localStorageData : localStorageData[youtubeId])
    const blob = new Blob([json], { type: 'octet/stream' })
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = `YT-Bookmark${isAll ? '-all' : ''}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
const exportUniq = () => exportBookmark(false)
const exportAll = () => exportBookmark(true)
GM_registerMenuCommand('Export bookmark to JSON', exportUniq)
GM_registerMenuCommand('Export Allbookmarks to JSON', exportAll)
