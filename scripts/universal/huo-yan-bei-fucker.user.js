// ==UserScript==
// @name         Huo Yan Bei Fucker
// @match        *://jinshuju.net/*
// @version      0.1.5
// @author       lth,zjx
// @run-at       document-start
// @grant        GM_log
// @grant        unsafeWindow
// @updateURL    https://zengjx.tk/scripts/universal/huo-yan-bei-fucker.meta.js
// @downloadURL  https://zengjx.tk/scripts/universal/huo-yan-bei-fucker.user.js
// ==/UserScript==

(function () {
  'use strict'

  const timer = setInterval(() => {
    if (document.readyState !== 'complete')
      return

    clearInterval(timer)

    const publishedFormData = GD?.publishedFormData
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
      correctAnswerMap.set(apiCode, Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer])
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
