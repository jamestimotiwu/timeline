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
    //this.prepareElement()
    this.finalItem = null
    this.finalItems = null
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
    // Get element
    try {
      this.finalItem = Object.assign(getItemByElement(this.el))
    } catch(err) {
      this.finalItem = null
    }
  }

  moveElementTo(x, y) {
    const leftPosition = x - this.shiftX;
    const topPosition = y - this.shiftY;
    this.el.style.left = `${leftPosition}px`
    this.el.style.top = `${topPosition}px`
  }

  onMouseMove(e) {
    this.moveElementTo(e.pageX, e.pageY)
    let item = getItemByElement(this.el);

    collisionHandler(item, e.pageX - this.shiftX, e.pageY - this.shiftY);
  }

  onMouseUp(e) {
    // Move element to final item location
    // null check
    if(this.finalItem) {
      //clearHighlight();
      this.el.style.left = this.finalItem.x;
      this.el.style.top = this.finalItem.y;
      this.finalItem = null
    }
    this.el.style.zIndex = 1
    document.removeEventListener('mousemove', this.onMouseMove)
  }

}

/*
 * Channels
 *
 * Each channel structure will maintain metadata on:
 *  Items in channel
 *  Channel id
 *  Channel height
 *  Channel top value
*/
var channels = [];
var items = [];
var tempItems = [];


/*** CREATE ELEMENTS ***/
var elements = [];
var numElements = 500
const root = document.getElementById('root');
root.innerHTML = generateElements(numElements);
mapElements(numElements);

items.map((item) => {
  item.element.style.left = item.x;
  item.element.style.top = item.y;
  item.element.style.position = 'absolute'
  item.element.style.zIndex = 999
});

function generateElements(n) {
  let html = '';
  for(var i=0;i<n;i++) {
    // random width
    // random background color
    // unique id as name
    let id = "element" + i;
    html += '<div class="elem" id='+id+'></div>'
  }
  return html;
}

function mapElements(n) {
  for(var i=0;i<n;i++) {
    let id = "element" + i;
    let elem = document.getElementById(id);
    elem.style.width = 100 + (Math.floor(Math.random() * Math.floor(150-100)));
    elem.style.background = randomColor();

    new Draggable(elem, elem);
    let rect = elem.getBoundingClientRect();
    items.push({
      element: elem,
      x: rect.left,
      y: rect.top,
      r: rect.right,
      h: rect.height,
      w: rect.width,
      id: id,
    })
  }
}

function randomColor() {
  var letters = '0123456789ABCDEF';
  var col = '#';
  for(var i=0;i<6;i++){
    col += letters[Math.floor(Math.random() * 16)];
  }
  return col;
}

function getItemByElement(element) {
  for(var i=0;i<items.length;i++) {
    if(element === items[i].element) {
      return items[i];
    }
  }
  // Check temp items if can't find item
  for(var i=0;i<tempItems.length;i++){
    if(element === tempItems[i].element) {
      //console.log("found temp");
      return tempItems[i];
    }
  }
}

/**** SNAPPING ****/
// Find item coliding with item/overlap
// Check item overlap
// item1 is item to check, item2 is moving element
function checkCollision(item1, item2, newX, newY) {
  // if same item
  if(item1.element === item2.element) {
    //console.log("same item: ", item1.i );
    return false;
  }
  const boundItem = {
    left: newX,
    right: newX + item2.w,
    y: newY,
  }
  const r_offset = Math.round(item1.w / 3);
  const t_offset = Math.round(item1.h / 2);
  //console.log("id: ", item1.id);
  //console.log("moving: ", boundItem.right);
  //console.log("static: ", item1.r);

  return ((item1.y + t_offset) > boundItem.y) 
    && (((item1.r - r_offset) > boundItem.left && boundItem.left > (item1.x + r_offset)) ||
    ((item1.r - r_offset) < boundItem.right && boundItem.right < item1.r));
}

// If same item check if still within bounds
// If not remove from list
// Alternatively, do this only if collision is not found yet it escaped from bounds
function checkSelf(item1, newX, newY) {
  return !(newX > item1.x + item1.w ||
    newX + item1.w < item1.x ||
    newY > item1.y + item1.h ||
    newY + item1.h < item1.y);
}

// Handle element movement and identify/handle collisions 
function collisionHandler(item, newX, newY) {
  var colReturn = resolveCollision(item, newX, newY);
  if(colReturn[0]){
    let newItems = swapItem(items, colReturn[1], colReturn[2], item);
    this.finalItem = applyPositionToItems(item, newItems);
  } else if(!checkSelf(item, newX, newY)) {
    // Check if self outside and also no longer within bounds of item
    // Remove item if no collision and leave bounds
    //console.log("outside!");
    if (colReturn[2] != -1) {
      this.finalItem = applyPositionToItems(item, removeItem(items,colReturn[2]));
      // Add to temp items because it was temporarily removed
      tempItems.push(item);
    }
    this.finalItem.x = newX;
    this.finalItem.y = newY;
  }
}

// idx1 is new idx for moving item/idx of colliding elem
// idx2 is curr idx of moving item
function swapItem(list, idx1, idx2, item) {
  let newArr = [];
  let prev_left = 0;
  let y = 4;
  let newItem1, newItem2 = null;
  newItem2 = Object.assign(item);
  newItem2.y = y;
  for(var i = 0; i < list.length; i++) {
    if(i === 0) {
      prev_left = list[0].x;
    }
    if(i === idx2) {
      continue;
    }
    newItem1 = Object.assign(items[i])
    newItem1.y = y;

    // Check ordering of items to determine rearrangement
    // If idx2 <- -1, was removed so push everything to left
    if(idx1 < idx2 || idx2 === -1) {
      // Push left
      if(i === idx1) {
        newItem2.x = prev_left
        newItem2.r = prev_left + 4 + newItem2.w;
        prev_left = newItem2.r;
        newArr.push(newItem2);
      }
      newItem1.x = prev_left
      newItem1.r = prev_left + 4 + newItem1.w;
      prev_left = newItem1.r;
      newArr.push(newItem1);
    } else {
      // Push right
      newItem1.x = prev_left
      newItem1.r = prev_left + 4 + newItem1.w;
      prev_left = newItem1.r;
      newArr.push(newItem1);
      if(i === idx1) {
        newItem2.x = prev_left
        newItem2.r = prev_left + 4 + newItem2.w;
        prev_left = newItem2.r;
        newArr.push(newItem2);
      }
    }
  }
  //console.log("new: ",newArr.length);
  return newArr;
}

// Removes item from item list
function removeItem(list, idx) {
  let newArr = null;
  let y = 4;
  let prev_left = 0;
  if(idx === -1) {
    return list;
  }
  //console.log("spliced!", idx)
  list.splice(idx,1);
  newArr = list;
  for(var i=0;i<newArr.length;i++) {
    if(i===0){
      prev_left = newArr[i].x + 4 + newArr[i].w;
    } else {
      newArr[i].x = prev_left;
      newArr[i].r = prev_left + 4 + newArr[i].w;
      prev_left = newArr[i].r
      newArr[i].y = y;
    }
  }
  //console.log(newArr);
  return newArr;
}

// item1 is item checked, item2 is moving element
function resolveCollision(item, newX, newY) {
  let isCollide = false;
  //let prev_left = 0;
  let collisionIdx = -1;
  let itemIdx = -1;

  for(var i = 0;i < items.length; i++) {
    if(checkCollision(items[i], item, newX, newY)) {
      console.log("collision detected: ", i);
      isCollide = true;
      collisionIdx = i;
    }
    if(item.id === items[i].id) {
      itemIdx = i;
      console.log(checkSelf(item, newX, newY));
    }
  }
  /*
  if (isCollide) {
    console.log("col_idx: ", collisionIdx," item_idx: ", itemIdx);
  }
  */
  return [isCollide, collisionIdx, itemIdx];
}

// Apply item structure on elements
function applyPositionToItems(item, newItems) {
  //console.log("applying position except on item");
  // iterate over all items
  let finalItem = item 
  for(var i=0;i < newItems.length; i++) {
    if(item.element === newItems[i].element){
      finalItem = newItems[i];
      newHighlight(newItems[i].x, newItems[i].y, newItems[i].w);
      continue;
    }
    newItems[i].element.style.left = newItems[i].x;
    newItems[i].element.style.top = newItems[i].y;
  }
  items = newItems;
  return Object.assign(finalItem);
}

// highlight new items
function newHighlight(x, y, width) {
  const proposedBlock = document.getElementById('highlight');
  let sty = "width: " + width + "px; left: " + x + "px; top: " + y + "px; background: #f9f9f9; position: absolute";
  proposedBlock.innerHTML = '<div style="'+sty+'" class="elem" id="highlighted-block"></div>';
}

// clear highlight of items
function clearHighlight() {
  const proposedBlock = document.getElementById('highlight');
  proposedBlock.innerHTML = '';
}

