'use strict';

var items = [];

/**
 * Makes an element draggable.
 *
 * @param {HTMLElement} element - The element.
 */
function draggable(element) {
	var isMouseDown = false;

  // initial mouse X and Y for `mousedown`
  var mouseX;
  var mouseY;

  // element X and Y before and after move
  var elementX = 0;
  var elementY = 0;

  // mouse button down over the element
  element.addEventListener('mousedown', onMouseDown);

	/**
     * Listens to `mousedown` event.
     *
     * @param {Object} event - The event.
     */
	function onMouseDown(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    isMouseDown = true;
  }

	// mouse button released
  document.addEventListener('mouseup', onMouseUp);

	/**
     * Listens to `mouseup` event.
     *
     * @param {Object} event - The event.
     */
	function onMouseUp(event) {
    isMouseDown = false;
    elementX = parseInt(element.style.left) || 0;
    elementY = parseInt(element.style.top) || 0;
  }

	// need to attach to the entire document
  // in order to take full width and height
  // this ensures the element keeps up with the mouse
  document.addEventListener('mousemove', onMouseMove);

	/**
     * Listens to `mousemove` event.
     *
     * @param {Object} event - The event.
     */
	function onMouseMove(event) {
    if (!isMouseDown) return;
    var deltaX = event.clientX - mouseX;
    var deltaY = event.clientY - mouseY;
    element.style.left = elementX + deltaX + 'px';
    element.style.top = elementY + deltaY + 'px';
  }
}


/**** SNAPPING ****/

