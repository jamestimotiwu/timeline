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
    this.finalItem = Object.assign(getItemByElement(this.el))
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
    var colReturn = resolveCollision(item);
    if(colReturn[0]){
      console.log("isCollide!")

      this.finalItem = applyPositionToItems(item, colReturn[1], colReturn[2]);
    }
  }

  onMouseUp(e) {
    // Move element to final item location
    // null check
    if(this.finalItem) {
      this.el.style.left = this.finalItem.x;
      this.el.style.top = this.finalItem.y;
      this.finalItem = null
    }
    this.el.style.zIndex = 1
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

items.map((item) => {
  item.element.style.left = item.x;
  item.element.style.top = item.y;
  item.element.style.position = 'absolute'
  item.element.style.zIndex = 999
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
  // if same item
  if(item1.element === item2.element) {
    //console.log("same item: ", i );
    return false;
  }
  let boundItem = item2.element.getBoundingClientRect();
  let r_offset = Math.round(item1.w / 3);
  let t_offset = Math.round(item1.h / 2);
  //console.log("id: ", item1.id);
  //console.log("moving: ", boundItem.right);
  //console.log("static: ", item1.r);

  return ((item1.y + t_offset) > boundItem.y) 
    && (((item1.r - r_offset) > boundItem.left && boundItem.left > (item1.x + r_offset)) ||
    ((item1.r - r_offset) < boundItem.right && boundItem.right < item1.r));
}

function sortByLeft(item1, item2) {
  return item1.x - item2.x;
}

// idx1 is new idx of moving item/idx of colliding elem
// idx2 is curr idx of moving item
function swapItem(list, idx1, idx2) {
  let newArr = [];
  let prev_left = 0;
  let newItem2 = Object.assign(items[idx2]);
  for(var i = 0; i < list.length; i++) {
    if(i === 0) {
      prev_left = list[0].x;
    }
    if(i === idx2) {
      continue;
    }
    let newItem1 = Object.assign(items[i])

    // Check ordering of items to determine rearrangement
    if(idx1 < idx2) {
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
  console.log("new: ",newArr.length);
  return newArr;
}

// item1 is item checked, item2 is moving element
function resolveCollision(item) {
  let isCollide = false;
  //let prev_left = 0;
  let collisionIdx = -1;
  let itemIdx = -1;

  for(var i = 0;i < items.length; i++) {
    if(collisionLeft(items[i], item)) {
      console.log("collision detected: ", i);
      isCollide = true;
      collisionIdx = i;
    }
    if(item.id === items[i].id) {
      itemIdx = i;
    }
  }
  if (isCollide) {
    console.log("col_idx: ", collisionIdx," item_idx: ", itemIdx);
  }

  return [isCollide, collisionIdx, itemIdx];
}

function applyPositionToItems(item, collisionIdx, itemIdx) {
  //console.log("applying position except on item");
  // iterate over all items
  //console.log(items);
  let newItems = swapItem(items, collisionIdx, itemIdx);
  console.log(newItems);
  let finalItem = null
  for(var i=0;i < newItems.length; i++) {
    if(item.element === newItems[i].element){
      finalItem = newItems[i];
      continue;
    }
    newItems[i].element.style.left = newItems[i].x;
    newItems[i].element.style.top = newItems[i].y;
  }
  items = newItems;
  return Object.assign(finalItem);
}

