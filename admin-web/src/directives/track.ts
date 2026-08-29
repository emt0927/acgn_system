import { trackClickMediaApi, type TrackLog } from "@/api/track"
import type { Directive } from "vue"

// 防止内存泄漏
const handlerMap = new WeakMap<HTMLElement, EventListener>()

//thack指令
export const vThack: Directive<HTMLElement, TrackLog> = {
    mounted(el, binding) {
        const clickHender = () => {
            const thackData = binding.value
            if (!thackData) return
            console.log('触发埋点', binding.value)
            trackClickMediaApi({ mediaId: thackData.mediaId, title: thackData.title, type: thackData.type })
        }
        handlerMap.set(el, clickHender)
        el.addEventListener('click', clickHender)
    },
    unmounted(el) {
        const clickHandler = handlerMap.get(el)
        if (clickHandler) {
            el.removeEventListener('click', clickHandler)
            handlerMap.delete(el)
        }
    }
}