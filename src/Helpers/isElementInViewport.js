/*
 * Credit to Dan (http://stackoverflow.com/users/139361)
 * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport#answer-7557433
 */

function isElementInViewport (el) {
	if (el === undefined || el === null) {
		return false;
	}

	//special bonus for those using jQuery
	if (typeof jQuery === "function" && el instanceof jQuery) {
		el = el[0];
	}

	var rect = el.getBoundingClientRect();

	return rect.top >= 0;
}

module.exports = isElementInViewport;
