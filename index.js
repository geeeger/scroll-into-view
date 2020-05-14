"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isSupportScrollIntoViewOptions = 'scrollBehavior' in document.documentElement.style;
var isSupportRequestAnimationFrameApi = Boolean(window.requestAnimationFrame);
/**
 * fork from [link](https://stackoverflow.com/questions/35939886/find-first-scrollable-parent#answer-42543908)
 * @param {*} element
 * @param {*} includeHidden
 */
function getScrollParent(element, includeHidden) {
    if (includeHidden === void 0) { includeHidden = false; }
    var style = getComputedStyle(element);
    var excludeStaticParent = style.position === 'absolute';
    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
    if (style.position === 'fixed') {
        return document.body;
    }
    var parent;
    for (parent = element; (parent = parent.parentElement);) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === 'static') {
            continue;
        }
        overflowRegex.lastIndex = 0;
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
            return parent;
        }
    }
    return document.body;
}
function scrollIntoView(element, stepNum) {
    if (stepNum === void 0) { stepNum = 10; }
    if (isSupportScrollIntoViewOptions) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    }
    else if (isSupportRequestAnimationFrameApi) {
        var offsetTop = element.offsetTop;
        var scrollableParent_1 = getScrollParent(element);
        var scrollTop = scrollableParent_1.scrollTop;
        var delta = offsetTop - scrollTop;
        var perStep_1 = delta / stepNum;
        var times_1 = 0;
        var step_1 = function () {
            if (times_1 >= stepNum) {
                return;
            }
            scrollableParent_1.scrollTop += (perStep_1 - 1);
            times_1++;
            window.requestAnimationFrame(step_1);
        };
        window.requestAnimationFrame(step_1);
    }
    else {
        element.scrollIntoView(true);
    }
}
exports.default = scrollIntoView;
