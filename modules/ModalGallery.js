/* DOM STRUCTURE

  modal-gallery
  - view image
  - reel images
  * prev button (absolutely positioned)
  * next button (absolutely positioned)
  * exit button (absolutely positioned)
*/

class ModalGallery {
  constructor(){
    this._node = null;
    this._view = null;
    this._reel = null;
    this._images = [];
    this._current = null;
    this._border = "1px solid #6495ed";
    this.keyListener = this.keyListener.bind(this);
  }

  get node(){
    return this._node;
  }
  get view(){
    return this._view;
  }
  get reel(){
    return this._reel;
  }
  get images(){
    return this._images;
  }
  get current(){
    return this._current;
  }
  get border(){
    return this._border;
  }
  set node(node){
    this._node = node;
  }
  set view(view){
    this._view = view;
  }
  set reel(reel){
    this._reel = reel;
  }
  set current(index){
    this._current = index;
  }
  set border(style){
    this._border = style;
  }

  clearImages(){
    this._images = [];
  }
  addImage(imgSrc){
    this._images.push(imgSrc);
  }

  build(node){
    node.className = 'ModalGallery-main';
    //view component -- wrapper > svg > image
    let viewWrapper = document.createElement('div');
    viewWrapper.className = "ModalGallery-view-wrapper";
    let viewSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
    viewSVG.setAttribute("viewBox","0 0 100 100");
    viewSVG.setAttribute("preserveAspectRatio","xMidYMid meet");
    viewSVG.setAttribute("class","ModalGallery-view-svg");
    let view = document.createElementNS('http://www.w3.org/2000/svg','image');
    view.setAttribute("class","ModalGallery-view-image");
    viewSVG.append(view);
    viewWrapper.append(viewSVG);
    //create view and reel components
    let reel = document.createElement('div');
    let prev = document.createElement('div');
    let next = document.createElement('div');
    let exit = document.createElement('div');
    reel.className = 'ModalGallery-reel';
    prev.className = 'ModalGallery-btn ModalGallery-prev'
    next.className = 'ModalGallery-btn ModalGallery-next'
    exit.className = 'ModalGallery-exit';
    //button icons
    let prevIcon = document.createElement('i');
    let nextIcon = document.createElement('i');
    let exitIcon = document.createElement('i');
    prevIcon.className = 'fas fa-angle-left';
    nextIcon.className = 'fas fa-angle-right';
    exitIcon.className = 'fas fa-times';
    prev.append(prevIcon);
    next.append(nextIcon);
    exit.append(exitIcon);
    //button functions
    prev.onclick = ()=>this.nextImage(-1);
    next.onclick = ()=>this.nextImage(1);
    exit.onclick = ()=>this.exitGallery();
    //append all to parent node
    node.append(viewWrapper);
    node.append(reel);
    node.append(prev);
    node.append(next);
    node.append(exit);
    //store in object data
    this.node = node;
    this.view = view;
    this.reel = reel;
  }

  //images = array of image paths
  //first = src path of first image to display
  open(images,first){
    let node = this.node;
    let view = this.view;
    let reel = this.reel;
    //clear all previous images
    while (reel.firstChild){
      reel.firstChild.remove();
    }
    //add images to reel
    //key = image name, val = image src
    this.clearImages();
    //build each image
    let index = 0;
    images.forEach((image)=>{
      let img = document.createElement('img');
      img.dataset.index = index;
      //add image url to ModalGallery data
      this.addImage(image);
      //add image url to DOM element src
      img.src = image;
      img.onclick = ()=>{
        this.modReelImages({border: "none"});
        img.style.border = this.border;
        this.changeSVGImage(view,image);
        this.current = Number(img.dataset.index);
      };
      reel.append(img);
      index++;
    });
    //find first clicked image by matching with this.images
    this.current = this.images.indexOf(first);
    this.reel.childNodes[this.current].style.border = this.border;
    //set view image
    this.changeSVGImage(view,first);
    //reveal ModalGallery div
    //visibility for removing clicking response
    node.style.visibility = "visible";
    //opacity for smooth transition
    node.style.opacity = 1;
    //add key listener
    this.addKeyListener();
  }

  //change reel image border
  modReelImages(style){
    let reelImages = [].slice.call(this.reel.childNodes);
    reelImages.forEach((elem)=>{
      for(let key in style){
        elem.style[key] = style[key];
      }
    });
    return reelImages;
  }

  //click prev/next arrows or arrow keys
  nextImage(inc){
    let reel = this.modReelImages({border: "none"});
    this.stepCurrent(inc);
    //set image in svg to current image after stepping current
    this.changeSVGImage(this.view,this.images[this.current]);
    reel[this.current].style.border = this.border;
  }

  stepCurrent(inc){
    var next = this.current + inc;
    if (next >= this.images.length) next = 0;
    if (next < 0) next = this.images.length - 1;
    this.current = next;
  }
  //svg image helper
  changeSVGImage(node,img){
    node.setAttributeNS("http://www.w3.org/1999/xlink","href",img);
  }

  //listener
  addKeyListener(){
    document.addEventListener('keydown',this.keyListener);
  }
  keyListener(e){
    e = e || window.event;
    e.stopPropagation();
    switch(e.keyCode){
      case 27:
        this.exitGallery();
        return;
      case 37:
        this.nextImage(-1);
        return;
      case 39:
        this.nextImage(1);
        return;
      default:
        return;
    }
  }

  exitGallery(){
    document.removeEventListener('keydown',this.keyListener);
    this.node.style.opacity = 0;
    this.node.style.visibility = "hidden";
  }

}
