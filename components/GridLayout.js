class GridLayout {
  constructor(rows=10,columns=15){
    this._rows = rows;
    this._columns = columns;
    this._gap = 2;
    this._items = [];
  }
  //setters
  set rows(val){
    this._rows = val;
  }
  set columns(val){
    this._columns = val;
  }
  set gridGap(val){
    this._gap = val;
  }
  //getters
  get rows() {
    return this._rows;
  }
  get columns(){
    return this._columns;
  }
  get dimensions(){
    return {
      columns: this._columns,
      rows: this._rows
    }
  }
  get gridGap() {
    return this._gap;
  }
  get items() {
    return this._items;
  }
  get style(){
    return {
      display: "grid",
      gridTemplateRows: "repeat("+this._rows+", 1fr)",
      gridTemplateColumns: "repeat("+this._columns+", 1fr)",
      gridGap: this._gap+"px",
    };
  }
  get data() {
    let items = [];
    this._items.forEach((i)=>{
      items.push({
        name: i.dataset.name,
        area: i.style.gridArea,
        src: i.src
      });
    })
    return {
      rows: this._rows,
      columns: this._columns,
      items: items
    };
  }

  assignTo(node){
    let style = node.style;
    style.display = "grid";
    style.gridTemplateRows = "repeat("+this._rows+", 1fr)";
    style.gridTemplateColumns = "repeat("+this._columns+", 1fr)";
    style.gridGap = this._gap+"px"
  }

  fill(node, color='silver'){
    for(let i=0; i<(this._rows*this._columns); i++){
      let div = document.createElement('div');
      div.style.backgroundColor = color;
      div.setAttribute('data-type','fill');
      node.prepend(div);
    }
  }

  //inserts a DOM element in the parent node
  //x,y,w,h dimensions are in grid units
  //uses flex grid
  //add: css flex order for linear layout
  insert(type='text',content='null',gridArea, className='',order){
    let wrapper = document.createElement('div');
    //uses flex grid-area
    wrapper.style.gridArea = gridArea;
    wrapper.className = className;
    //add data
    if (order){
      wrapper.style.order = String(order);
    }
    let elem = document.createElement(type);
    elem.style.height = "100%";
    if (type==='img'){
      elem.src = content;
    } else {
      elem.style.width = "100%";
      let text = document.createElement('span');
      text.style.display = "block";
      text.innerHTML = content;
      elem.append(text);
    }
    wrapper.append(elem);
    return wrapper;
  }

}

export default GridLayout;
