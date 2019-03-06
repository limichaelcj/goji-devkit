/* DOM STRUCTURE

  modal-gallery
  - view image
  - reel images
  * prev button (absolutely positioned)
  * next button (absolutely positioned)
  * exit button (absolutely positioned)
*/

class ModalGallery {
  constructor(node, options = {}){
    if (!node || !(node instanceof HTMLElement)){
      throw new Error('ArgumentError: Constructor requires argument of type HTMLElement')
    }
    this._node = node; // parent node to inject in
    this._view = document.createElement('div'); // big picture center display
    this._reel = document.createElement('div'); // holds the images in the gallery
    this._images = Array.from(node.querySelectorAll('img')); // image nodes
    this._settings = {
      color: 'rgba(0,0,0,0.8)',
      highlight: 'rgba(210,210,210,0.8)'
    };
    this._state = {
      current: null
    };
    this.keyListener = this.keyListener.bind(this);
    this._configure(options);
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
  get settings(){
    return this._settings;
  }
  get current(){
    return this._state.current;
  }

  _configure(options) {
    this._applySettings(options);
    this._initialize();
  }

  _applySettings(options){
    const strongParams = validate(options);
    Object.assign(this._settings, strongParams);
    // HELPER FUNCTIONS
    // data validation
    function permit(obj, allowed){
      const newObj = JSON.parse(JSON.stringify(obj));
      for(let key in newObj) {
        if (!allowed.includes(key)) delete newObj[key];
      }
      return newObj;
    }
    function validate(options){
      const root = permit(options, ['color', 'highlight']);
      // colors
      clean(root, 'color', 'string', 'options.color');
      clean(root, 'highlight', 'string', 'options.highlight');

      return root;
      // helper
      function clean(obj, key, type, name){
        if (obj.hasOwnProperty(key) && typeof obj[key] != type) {
          delete obj[key];
          console.error(`${name} must be of type ${type}`);
        }
      }
    }
  }

  _initialize(){
    const settings = this._settings;
    // setup DOM element structure
    this.node.appendChild(this.view);
    this.node.appendChild(this.reel);
    this.images.forEach(elem => {
      this.reel.appendChild(elem);
    });
    this.node.classList.add('goji-devkit-modalgallery');
    this.view.classList.add('goji-devkit-modalgallery-view');
    this.reel.classList.add('goji-devkit-modalgallery-reel');
    // apply styles
    Object.assign(this.node.style, {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      zIndex: 5,
      backgroundColor: this.settings.color
    });
    Object.assign(this.view.style, {
      flex: '0 0 80%',
      display: 'block',
    });
    Object.assign(this.reel.style, {
      flex: '0 0 20%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      margin: '10px',
      overflow: 'auto'
    });
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
