const isSupportScrollIntoViewOptions = 'scrollBehavior' in document.documentElement.style

const isSupportRequestAnimationFrameApi = Boolean(window.requestAnimationFrame)

/**
 * fork from [link](https://stackoverflow.com/questions/35939886/find-first-scrollable-parent#answer-42543908)
 * @param {*} element
 * @param {*} includeHidden
 */
function getScrollParent (element: HTMLElement, includeHidden = false): HTMLElement {
  let style = getComputedStyle(element)
  const excludeStaticParent = style.position === 'absolute'
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/

  if (style.position === 'fixed') {
    return document.body
  }

  let parent: any;
  for (parent = element; (parent = parent.parentElement);) {
    style = getComputedStyle(parent)
    if (excludeStaticParent && style.position === 'static') {
      continue
    }
    overflowRegex.lastIndex = 0
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent
    }
  }

  return document.body
}

export default function scrollIntoView (element: HTMLElement, stepNum = 10) {
  if (isSupportScrollIntoViewOptions) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  } else if (isSupportRequestAnimationFrameApi) {
    const offsetTop = element.offsetTop
    const scrollableParent = getScrollParent(element)
    const scrollTop = scrollableParent.scrollTop
    const delta = offsetTop - scrollTop
    const perStep = delta / stepNum
    let times = 0
    const step = () => {
      if (times >= stepNum) {
        return
      }
      scrollableParent.scrollTop += (perStep - 1)
      times++
      window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
  } else {
    element.scrollIntoView(true)
  }
}
