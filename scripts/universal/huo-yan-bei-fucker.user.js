// ==UserScript==
// @name         Huo Yan Bei Fucker
// @match        *://jinshuju.net/*
// @version      0.2.0
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
    let extraConfigurableSettings
    if (!(extraConfigurableSettings = GD?.publishedFormData?.data?.publishedForm?.form?.setting?.extraConfigurableSettings))
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
  })

  const timer = setInterval(() => {
    if (document.readyState !== 'complete')
      return

    clearInterval(timer)

    const publishedFormData = unsafeWindow?.GD?.publishedFormData
    const questions = publishedFormData?.data?.publishedForm?.form?.fields?.nodes
    if (!questions)
      return

    const inputElements = document.querySelectorAll('input')
    if (inputElements.length === 0)
      return

    let correctAnswerMap = new Map()
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

    GM_log(JSON.stringify(publishedFormData))

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
  }, 3000)
})()
