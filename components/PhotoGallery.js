class PhotoGallery {
  constructor(images,node){
    this._node = null; //parent node
    this._galleryNode = null; //container node .PhotoGallery
    this._images = images; //images paths in array
    this._style = null; //css style object
    //if parent node included in constructor, build automatically
    if(node){
    	this.build(node);
    }
  }
  set style(obj){
    this._style = obj;
  }
  get node() {
  	return this._node;
  }
  get galleryNode(){
    return this._galleryNode;
  }
  get images() {
    return this._images;
  }
  get style(){
    return this._style;
  }
  addImage(img) {
    this._images.push(img);
  }
  clear(){
    this._images = null;
  }
  build(node){
    //clear previous node, if any
    if(this.node){
      while(this.node.firstChild){
        this.node.firstChild.remove();
      }
    }
    //change node
  	this._node = node;
    //clear node children
    while(node.firstChild){
    	node.firstChild.remove();
    }
    //create container
    let container = document.createElement('div');
    container.className = "PhotoGallery";
    //create elements
  	for(let i = 0; i < this.images.length; i++){
    	let div = document.createElement('div');
      let img = document.createElement('img');
      //inject img path from this.images
      img.src = this.images[i];
      div.append(img);
      container.append(div);
    }
    //append component to target node
    node.append(container);
    //add to object property data
    this._galleryNode = container;
    //set optional styles
    this.applyStyle();
  }

  applyStyle(obj){
    //overwrites instance's style if argument passed
    if (obj){
      this.style = obj;
    }
    //apply styles only if node and style exists
    console.log(this.style);
    if(this.galleryNode && this.style){
      for(let key in this.style){
        this.galleryNode.style[key] = this.style[key];
      }
    }
    /* CAUTION:
      This method does not erase previously set styles.
      Rebuild the instance with build(node) to reset styles.
    */
  }
}
