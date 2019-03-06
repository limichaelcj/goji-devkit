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
    this._view = document.createElement('img'); // big picture center display
    this._reel = document.createElement('div'); // holds the images in the gallery
    this._images = Array.from(node.querySelectorAll('img')); // image nodes
    this._settings = {
      view: 90,
      reel: '20%',
      color: 'rgba(0,0,0,0.8)',
      highlight: 'rgba(210,210,210,0.8)'
    };
    this._state = {
      selected: 0
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
  get selected(){
    return this._state.selected;
  }
  set selected(index) {
    this._state.selected = index;
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
      const root = permit(options, ['view', 'reel', 'color', 'highlight']);
      // colors
      clean(root, 'view', 'number', 'options.view');
      clean(root, 'reel', 'string', 'options.reel');
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
    const viewWrapper = document.createElement('div');
    viewWrapper.appendChild(this.view);
    this.node.appendChild(viewWrapper);
    this.node.appendChild(this.reel);
    this.images.forEach(elem => {
      this.reel.appendChild(elem);
    });
    const buffers = [document.createElement('div'), document.createElement('div')];
    buffers.forEach((div, index) => {
      div.innerHTML = '_';
      var bufferWidth = 100 + (index * 40);
      Object.assign(div.style, {
        height: '100%',
        minWidth: '40%',
        visibility: 'hidden',
      });
    });
    this.reel.prepend(buffers[0]);
    this.reel.appendChild(buffers[1]);
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
    Object.assign(viewWrapper.style, {
      flex: '1 1 80%',
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    });
    Object.assign(this.view.style, {
      height: this.settings.view + '%',
      width: this.settings.view + '%',
      objectFit: 'contain'
    });
    Object.assign(this.reel.style, {
      flex: `0 0 ${this.settings.reel}`,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      boxSizing: 'border-box',
      padding: '20px',
      overflow: 'auto'
    });
    this.images.forEach((img, index) => {
      Object.assign(img.style, {
        height: '100%',
        marginLeft: index < 1 ? '' : '20px',
        cursor: 'pointer',
        border: '1px solid transparent'
      });
      img.onclick = (e) => {
        e.stopPropagation();
        this.viewImage(index);
      }
    });

    this.viewImage(0);
  }

  viewImage(index){
    Object.assign(this.images[this.selected].style, {
      borderColor: 'transparent'
    });
    this.view.src = this.images[index].src;
    Object.assign(this.images[index].style, {
      borderColor: this.settings.highlight
    });
    this.selected = index;
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
