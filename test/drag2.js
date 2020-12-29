var items = [];

class Draggable {
  constructor(dr,el) {
    this.el = el
    this.dr = dr
    this.shiftX = null
    this.shiftY = null
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.addEventHandlers()
  }

  addEventHandlers() {
    this.dr.addEventListener('mousedown', this.onMouseDown)
    this.dr.addEventListener('dragstart', e => e.preventDefault())
    document.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseDown(e) {
    this.getDragPointer(e.clientX, e.clientY)
    this.prepareElement()
    this.moveElementTo(e.pageX, e.pageY)
    document.addEventListener('mousemove', this.onMouseMove)
  }

  getDragPointer(x, y) {
    const elRect = this.el.getBoundingClientRect()
    // is this neccessary? left = el.x, top = el.y
    this.shiftX = x - elRect.left
    this.shiftY = y - elRect.top
  }

  prepareElement() {
    this.el.style.position = 'absolute'
    this.el.style.zIndex = 999
  }

  moveElementTo(x, y) {
    const leftPosition = x - this.shiftX;
    const topPosition = y - this.shiftY;
    this.el.style.left = `${leftPosition}px`
    this.el.style.top = `${topPosition}px`
  }

  onMouseMove(e) {
    this.moveElementTo(e.pageX, e.pageY)
    if(resolveCollision(getItemByElement(this.el))){
      applyPositionToItems();
    }
  }

  onMouseUp(e) {
    document.removeEventListener('mousemove', this.onMouseMove)
  }

}

var elements = [];
elements.push(document.getElementById('element1'));
elements.push(document.getElementById('element2'));
elements.push(document.getElementById('element3'));

// Map all elements to items list
elements.map((elem, i) => {
  new Draggable(elem, elem);
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
//const draggables = document.querySelectorAll('.draggable')

//for (let draggable of draggables) {
//new Draggable(draggable)
//}


// onMouseUp -> applyPositionToItems if collision found or new position found
// onMouseMove -> check using resolveCollision(item)
// 
//

function getItemByElement(element) {
  for(var i=0;i<items.length;i++) {
    if(element === items[i].element) {
      return items[i];
    }
  }
}

/**** SNAPPING ****/
// Find item coliding with item/overlap
// Check item overlap
// item1 is item to check, item2 is moving element
function collisionLeft(item1, item2) {
  let r_offset = Math.round(item1.w / 4);
  console.log("id: ", item1.id);
  console.log("moving: ", item2.r);
  console.log("static: ", item1.r);

  return ((item1.y - item1.h/2) < item2.y) && ((item1.r - r_offset) < item2.r && item2.r < item1.r);
}

function sortByLeft(item1, item2) {
  return item1.x - item2.x;
}

// item1 is item checked, item2 is moving element
function resolveCollision(item) {
  let isCollide = false;
  let prev_left = 0;

  for(var i = 0;i < items.length; i++) {
    // if same item
    if(item.element === items[i].element) {
      //console.log("same item: ", i );
      continue;
    }
    if(collisionLeft(items[i], item)) {
      console.log("collision detected: ", i);
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

function applyPositionToItems(item) {
  //console.log("applying position except on item");
  // iterate over all items
  for(var i=0;i < items.length; i++) {
    if(item.element === items[i].element){
      continue;
    }
    items[i].element.style.left = items[i].x;
    items[i].element.style.top = items[i].y;
  }
}

