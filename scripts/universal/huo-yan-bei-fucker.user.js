// ==UserScript==
// @name         Huo Yan Bei Fucker
// @match        *://jinshuju.net/*
// @version      0.2.5
// @author       lth,zjx
// @run-at       document-start
// @grant        GM_log
// @grant        unsafeWindow
// @updateURL    https://zengjx.tk/scripts/universal/huo-yan-bei-fucker.meta.js
// @downloadURL  https://zengjx.tk/scripts/universal/huo-yan-bei-fucker.user.js
// ==/UserScript==

(function () {
  'use strict'

  function bypassAntiCheat (GD) {
    const extraConfigurableSettings = GD?.publishedFormData?.data?.publishedForm?.form?.setting?.extraConfigurableSettings
    if (!extraConfigurableSettings || !Array.isArray(extraConfigurableSettings))
      return

    for (const setting of extraConfigurableSettings) {
      let antiCheatingSetting
      if (!(antiCheatingSetting = setting?.antiCheatingSetting))
        continue

      antiCheatingSetting.pasteDisabled = false
      antiCheatingSetting.copyingDisabled = false
      antiCheatingSetting.enabled = false
      antiCheatingSetting.switchingScreenDisabled = false
      antiCheatingSetting.switchingScreenLimit = 999
      antiCheatingSetting.switchingScreenLimitTime = 999
    }
  }

  let GD = undefined

  Object.defineProperty(unsafeWindow, 'GD', {
    get: () => GD,
    set: (value) => {
      bypassAntiCheat(value)
      GD = value
    },
    configurable: false,
  })

  const timer = setInterval(() => {
    if (document.readyState !== 'complete')
      return

    const publishedFormData = unsafeWindow?.GD?.publishedFormData
    if (!publishedFormData)
      return

    if (!GD) {
      GM_log('unsafe! reload page!')
      unsafeWindow.location.reload()
    }

    const questions = publishedFormData?.data?.publishedForm?.form?.fields?.nodes
    if (!questions || !Array.isArray(questions))
      return

    const correctAnswerMap = new Map()
    for (const question of questions) {
      const apiCode = question?.apiCode
      const answer = question?.extraConfigurableSettings?.answers?.[0]
      const correctAnswer = answer?.correctAnswer
      if (!answer || !apiCode || !correctAnswer)
        continue

      correctAnswerMap.set(
        apiCode,
        Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer],
      )
    }
    if (correctAnswerMap.size === 0)
      return

    const inputElements = document.getElementsByTagName('input')
    if (inputElements.length === 0)
      return

    for (const inputElement of inputElements) {
      const answers = correctAnswerMap.get(inputElement.name)
      if (!answers)
        continue

      if (answers.includes(inputElement.value)) {
        setTimeout(() => {
          inputElement.click()
        }, 0)
      }
    }

    clearInterval(timer)
    GM_log(JSON.stringify(publishedFormData))
  }, 500)
})()
