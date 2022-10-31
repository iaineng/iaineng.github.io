// ==UserScript==
// @name         Huo Yan Bei Fucker
// @match        *://jinshuju.net/*
// @version      0.1.0
// @author       lth,zjx
// @run-at       document-start
// @grant        none
// @updateURL    https://zengjx.tk/scripts/universal/huo-yan-bei-fucker.meta.js
// @downloadURL  https://zengjx.tk/scripts/universal/huo-yan-bei-fucker.user.js
// ==/UserScript==

(function () {
  'use strict'

  const timer = setInterval(() => {
    if (document.readyState !== 'complete')
      return

    const questions = globalThis?.GD?.publishedFormData?.data?.publishedForm?.form?.fields?.nodes
    if (!questions)
      return

    const inputElements = document.querySelectorAll('input')
    let correctAnswerMap = new Map()

    for (const question of questions) {
      const apiCode = question?.apiCode
      const answer = question?.extraConfigurableSettings?.answers[0]
      const correctAnswer = answer?.correctAnswer
      if (!answer || !apiCode || !correctAnswer)
        continue
      correctAnswerMap.set(apiCode, Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer])
    }

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
  }, 3000)
})()
