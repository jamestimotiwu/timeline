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
    console.log("mouse down");
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
    this.finalItem = collisionHandler(item, e.pageX - this.shiftX, e.pageY - this.shiftY);
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
var numElements = 10
const root = document.getElementById('root');
root.innerHTML = generateElements(0,numElements);
items = mapElements(0, numElements, 0, 4);

items.map((item) => {
  item.element.style.left = item.x;
  item.element.style.top = 4;
  item.element.style.position = 'absolute'
  item.element.style.zIndex = 999
});

channels.push({
  items: items,
  id: 0,
  y: 4,
  h: 50,
});

root.insertAdjacentHTML('beforeend', generateElements(numElements, numElements + 3));
let items2 = mapElements(numElements, numElements + 3, 1, 58);
items2.map((item) => {
  item.element.style.left = item.x;
  item.element.style.top = 58;
  item.element.style.position = 'absolute'
  item.element.style.zIndex = 999
});

channels.push({
  items: items2,
  id: 1,
  y: 58,
  h: 50,
});

function generateElements(start, n) {
  let html = '';
  for(var i=start;i<n;i++) {
    // random width
    // random background color
    // unique id as name
    let id = "element" + i;
    html += '<div class="elem" id='+id+'></div>'
  }
  return html;
}

function mapElements(start, n, chan_id, y) {
  let newItems =[];
  for(var i=start;i<n;i++) {
    let id = "element" + i;
    let elem = document.getElementById(id);
    elem.style.width = 100 + (Math.floor(Math.random() * Math.floor(150-100)));
    elem.style.background = randomColor();

    console.log("new draggable for ", id);
    new Draggable(elem, elem);
    let rect = elem.getBoundingClientRect();
    newItems.push({
      element: elem,
      x: rect.left,
      y: y,
      r: rect.right,
      h: rect.height,
      w: rect.width,
      id: id,
      chan_id: chan_id,
    })
  }
  return newItems;
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
  // iterate over all channels
  for(var j=0;j<channels.length;j++) {
    for(var i=0;i<channels[j].items.length;i++) {
      if(element === channels[j].items[i].element) {
        return channels[j].items[i];
      }
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
  const t_offset = Math.round(item1.h / 3);
  //console.log("id: ", item1.id);
  //console.log("moving: ", boundItem.right);
  //console.log("static: ", item1.r);
  /*
  return ((item1.y + t_offset) > boundItem.y) 
    && (((item1.r - r_offset) > boundItem.left && boundItem.left > (item1.x + r_offset)) ||
    ((item1.r - r_offset) < boundItem.right && boundItem.right < item1.r));
    */
  return (((item1.r - r_offset) > boundItem.left && boundItem.left > (item1.x + r_offset)) ||
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

// 1: channel
// 2: object
function checkChannel(y1, h1, y2, h2) {
  return (y1 <= y2 + h2/2) &&
    (y2 + h2/2 < y1 + h1);
}

// Get channel based on x, y, and height of object
function getChannel(x, y, h) {
  // temp for now, have channel id hierarchy
  for(var i=0;i<channels.length;i++) {
    if(checkChannel(channels[i].y, channels[i].h, y, h)){
      return channels[i];
    }
  }
  return null;
}

// Get channel by id
function getChannelById(id) {
  for(var i=0;i<channels.length;i++) {
    if(channels[i].id === id){
      //console.log("found chan ", chan)
      return channels[i];
    }
  }
  return null;
}

// Handle element movement and identify/handle collisions 
function collisionHandler(item, newX, newY) {
  // Check valid channel location based on newX/newY
  let chan = getChannel(newX, newY, item.h);
  let finalItem = item;
  let newItems = null;
  var colReturn = resolveCollision(chan, item, newX, newY);
  // If collision or new channel
  if(colReturn[0]){
    if (item.chan_id != chan.id) {
      // If chan.id is different than item.chan_id
      // Remove from old channel
      // Update chan id in item
      // swapItem? With colReturn[2] as -1
      colReturn[2] = getIndexOfItem(item.chan_id, item);
      if(colReturn[2] != -1) {
        // Remove item from previous channel?
        let oldChan = getChannelById(item.chan_id);
        newItems = removeItem(oldChan, colReturn[2], oldChan.y);
        finalItem = applyPositionToItems(item, newItems);
        oldChan.items = newItems;
      }
      item.chan_id = chan.id;
      colReturn[2] = -1;
    }
    newItems = swapItem(chan.items, colReturn[1], colReturn[2], item, chan.y);
    finalItem = applyPositionToItems(item, newItems);
    chan.items = newItems;
  } 
  // If channels are not the same and no collisions
  // if !colReturn[0] or oldChan != newChan
  else if(!checkSelf(item, newX, newY)) {
    // Check if self outside and also no longer within bounds of item
    // Remove item if no collision and leave bounds
    console.log("outside!");
    // Check old array for old item
    // If outside, remove from old channel
    colReturn[2] = getIndexOfItem(item.chan_id, item);
    if(colReturn[2] != -1) {
      // Remove item from previous channel?
      let oldChan = getChannelById(item.chan_id);
      newItems = removeItem(oldChan, colReturn[2], oldChan.y);
      finalItem = applyPositionToItems(item, newItems);
      oldChan.items = newItems;
      // Add to temp items because it was temporarily removed
      tempItems.push(item);
    }
    finalItem.x = newX;
    finalItem.y = newY;
  } 
  return finalItem;
}

function insertItem(list, item) {
  // iterate over list, find leftmost non overlap item
  // insert item at x location as is
  let newArr = [];
  let prev_r = 0;
  let seen = false;

  for(var i=0;i<list.length;i++){
    // front case
    if(i===0 && item.x < list[i].x && !seen) {
      newArr.push(item);
      seen = true;
    }
    // middle case
    if(!seen && prev_r < item.r) {
      newArr.push(item);
      seen = true;
    }
    prev_r = item.r;
    newArr.push(list[i]);
  }
  if(!seen) {
    newArr.push(item);
  }

  return newArr
}

// idx1 is new idx for moving item/idx of colliding elem
// idx2 is curr idx of moving item
function swapItem(list, idx1, idx2, item, y) {
  let newArr = [];
  let prev_left = 0;
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
    newItem1 = Object.assign(list[i])
    newItem1.y = y;

    // Check ordering of items to determine rearrangement
    // If idx2 <- -1, was removed so push everything to right
    if(idx1 < idx2 || idx2 === -1) {
      // Don't push to right if next item is not right enough 
      if(prev_left < newItem1.x) {
        prev_left = newItem1.r;
        continue;
      }
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
function removeItem(chan, idx, y) {
  let newArr = null;
  let prev_left = 0;
  if(idx === -1) {
    return chan.items;
  }
  //console.log("spliced!", idx)
  newArr = Object.assign(chan.items);
  newArr.splice(idx,1);
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
function resolveCollision(chan, item, newX, newY) {
  let isCollide = false;
  //let prev_left = 0;
  let collisionIdx = -1;
  let itemIdx = -1;

  if(chan===null) {
    return [false, -1, -1];
  }
  for(var i = 0;i < chan.items.length; i++) {
    if(checkCollision(chan.items[i], item, newX, newY)) {
      console.log("collision detected: ", i);
      isCollide = true;
      collisionIdx = i;
    }
    if(item.id === chan.items[i].id) {
      itemIdx = i;
      //console.log(checkSelf(item, newX, newY));
    }
  }
  return [isCollide, collisionIdx, itemIdx];
}

function getIndexOfItem(chan_id, item) {
  for(var i=0;i < channels[chan_id].items.length; i++) {
    if(item.id === channels[chan_id].items[i].id) {
      return i;
    }
  }
  return -1;
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
  console.log(channels)
  return Object.assign(finalItem);
}

// highlight new items
function newHighlight(x, y, width) {
  const proposedBlock = document.getElementById('highlight');
  let sty = "width: " + width + "px; left: " + x + "px; top: " + y + "px; background: #f6f6f6; position: absolute";
  proposedBlock.innerHTML = '<div style="'+sty+'" class="elem" id="highlighted-block"></div>';
}

// clear highlight of items
function clearHighlight() {
  const proposedBlock = document.getElementById('highlight');
  proposedBlock.innerHTML = '';
}

