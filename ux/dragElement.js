export default function allowDrag(elem){
  var ox=0,oy=0,cx=0,cy=0;
  //set the elements mousedown functionality(html)
  elem.onmousedown = dragMouseDown;
  function dragMouseDown(e){
    e = e || window.event;
    e.preventDefault();
    //get the mouse cursor position at startup
    cx = e.clientX;
    cy = e.clientY;
    //while the mouse is 'down'...
    document.onmouseup = closeDragElement;
    //call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }
  function elementDrag(e){
    e = e || window.event;
    e.preventDefault();
    //calc offset between start cursor and new cursor position
    ox = cx - e.clientX; // negative offset x/y is to the right
    oy = cy - e.clientY; // positive offset is to the left
    //now that offset is calculated, set old cxy to new
    cx = e.clientX;
    cy = e.clientY;
    //set new position via changing css style top/left
    //this allows image to retain original position data
    elem.style.top = (elem.offsetTop - oy) + "px";
    elem.style.left = (elem.offsetLeft - ox) + "px";
  }
  function closeDragElement(){
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export default allowDrag;
