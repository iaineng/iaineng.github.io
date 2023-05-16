// ==UserScript==
// @name         Soundraw Fucker
// @match        https://soundraw.io/*
// @version      0.1.0
// @author       zjx
// @grant        unsafeWindow
// @run-at       document-start
// @updateURL    https://zengjx.tk/scripts/universal/soundraw-fucker.meta.js
// @downloadURL  https://zengjx.tk/scripts/universal/soundraw-fucker.user.js
// ==/UserScript==

(function() {
    'use strict';

    function hookHttpRequest() {
        const urls = new Map()

        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open
        unsafeWindow.XMLHttpRequest.prototype.open = function () {
            urls.set(this, arguments[1])
            originalOpen.apply(this, arguments)
        }

        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send
        let originalOnreadystatechangeFns = new Map()
        unsafeWindow.XMLHttpRequest.prototype.send = function () { 
            if (!originalOnreadystatechangeFns.get(this)) {
                originalOnreadystatechangeFns.set(this, this.onreadystatechange)
            }
            this.onreadystatechange = function () {
                if (this.readyState !== 4) {
                    originalOnreadystatechangeFns.get(this)?.apply(this, arguments)
                    return
                }
                if (urls.get(this) === '/available_downloads') {
                    const obj = JSON.parse(this.responseText)
                    obj.result = 'true'

                    Object.defineProperties(this, {
                        'responseText': {
                            get() {
                                return JSON.stringify(obj)
                            }
                        },
                        'response': {
                            get() {
                                return JSON.stringify(obj)
                            }
                        }
                    })
                }

                originalOnreadystatechangeFns.get(this)?.apply(this, arguments)
            }

            originalSend.apply(this, arguments)
        }
    }

    hookHttpRequest();
})();
