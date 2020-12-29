// maintain list of items
// data structure
// start(x1), end(x2), width
// maintain same y position

var items = [];
var elements = [];
elements.push(document.getElementById('element1'));
elements.push(document.getElementById('element2'));
elements.push(document.getElementById('element3'));

// Map all elements to items list
elements.map((elem, i) => {
  let rect = elem.getBoundingClientRect();
  items.push({
    element: elem,
    x: rect.left,
    y: rect.top,
    r: rect.right,
    h: rect.height,
    w: rect.width,
    id: i,
  })
});

// Find item coliding with item/overlap
// Check item overlap
// item1 is item to check, item2 is moving element
function collisionLeft(item1, item2) {
  let r_offset = Math.round(item1.w / 4);
  return (item1.y - item1.h/2 < item2.y) || (item1.r - r_offset < item2.r);
}

function sortByLeft(item1, item2) {
  return item1.x - item2.x;
}

// item1 is item checked, item2 is moving element
function resolveCollision(item) {
  // Use flag to check if collision detected
  // If collision detected, do the following for rest of list
  // prev end to set new starts
  // insert object before colliding item
  // item2.left <- item1.left
  // item2.right <- item2.left + item2.width
  // do same thing for rest of list

  let isCollide = false;
  let prev_left = 0;

  for(var i = 0;i < items.length(); i++) {
    // if same item
    if(fixed_item.element.is(items[i].element)) continue;
    if(collisionLeft(items[i], item) {
      isCollide = true;
    }

    // Set new values for collisions
    if(isCollide) {
      items[i].x = prev_left;
      items[i].r = items[i].x + items[i].w
    }
    prev_left = items[i].left;
  }
  if (isCollide) {
    // sort list
    items.sort(sortByLeft);
    // apply change in css by modifying drag elements to new positions
    return true;
  }
  return false;
}

function applyPositionToItems() {
  // iterate over all items
  for(var i=0;i < items.length(); i++) {
    items[i].element.style.left = items[i].l;
    items[i].element.style.top = items[i].y;
  }
}



// TODO: create new draggable items here
// compare draggable items

// If canSnapLeft
// set the new left(x) of fixed item to new position, right(x) to left + width
// push right to left + width;

//
// mousemove
// highlight area/move elements at halfway/center

// push elements back if fixed item.end < item.end
// maintain last item where this condition is false to get the offset to push elements


