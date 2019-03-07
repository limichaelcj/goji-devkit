class ModalGallery {
  constructor(node, options = {}){
    if (!node || !(node instanceof HTMLElement)){
      throw new Error('ArgumentError: Constructor requires argument of type HTMLElement')
    }
    this._node = node; // parent node to inject in
    this._view = document.createElement('img'); // big picture center display
    this._reel = document.createElement('div'); // holds the images in the gallery
    this._buffers = [document.createElement('div'), document.createElement('div')];
    this._settings = {
      view: 90,
      reel: '20%',
      color: 'rgba(0,0,0,0.8)',
      highlight: 'rgba(210,210,210,0.8)'
    };
    this._state = {
      images: [],
      selected: 0,
      keyListener: null
    };
    this._cycle = this._cycle.bind(this);
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
    return this._state.images;
  }
  get settings(){
    return this._settings;
  }
  get selected(){
    return this._state.selected;
  }
  set images(imageNodeArray) {
    this._state.images = imageNodeArray;
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
    // reel buffers
    this._buffers.forEach((div, index) => {
      div.innerHTML = '_';
      var bufferWidth = 100 + (index * 40);
      Object.assign(div.style, {
        height: '100%',
        minWidth: '40%',
        visibility: 'hidden',
      });
    });
    this.reel.prepend(this._buffers[0]);
    this.reel.appendChild(this._buffers[1]);
    // class identifiers
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
      zIndex: -1,
      opacity: 0,
      backgroundColor: this.settings.color,
      transition: 'opacity 200ms'
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
      overflowX: 'auto',
      overflowY: 'hidden'
    });
  }

  // link open function to img elements in specified class tag in document
  link(tag){
    Array.from(document.querySelectorAll(tag)).forEach(elem => {
      const images = Array.from(elem.querySelectorAll('img'));
      images.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.onclick = (e) => {
          e.stopPropagation();
          this._open(images, index);
        };
      });
    });
  }

  _open(images, index) {
    if (this.images.length > 1) this.images = [];
    for(let i=0; i<images.length; i++){
      this.images.push(document.createElement('img'));
    }
    this.images.forEach((img, i) => {
      this.reel.insertBefore(img, this._buffers[1]);
      img.src = images[i].src;
      Object.assign(img.style, {
        height: '100%',
        marginLeft: i < 1 ? '' : '20px',
        cursor: 'pointer',
        border: '1px solid transparent'
      });
      img.onclick = (e) => {
        e.stopPropagation();
        this._viewImage(i);
      };
    });
    Object.assign(this.node.style, {
      zIndex: 5,
      opacity: 1
    });
    this._viewImage(index);
    this.node.focus();
    const listener = window.addEventListener('keyup', (e) => {
      e = e || window.event;
      e.preventDefault();
      e.stopPropagation();
      switch(e.keyCode){
        case 27:
          this._close();
          window.removeEventListener('keyup', listener);
          break;
        case 37:
          this._viewImage(this._cycle(this.selected - 1));
          break;
        case 39:
          this._viewImage(this._cycle(this.selected + 1));
          break;
        default:
      }
    });
  }

  _close() {
    Object.assign(this.node.style, {
      zIndex: -1,
      opacity: 0
    });
    this.images.forEach(img => img.remove());
    this.images = [];
  }

  _viewImage(index){
    Object.assign(this.images[this.selected].style, {
      borderColor: 'transparent'
    });
    this.view.src = this.images[index].src;
    Object.assign(this.images[index].style, {
      borderColor: this.settings.highlight
    });
    this.selected = index;
    this.images[index].scrollIntoView(true);
  }

  _cycle(next){
    if (next > this.images.length - 1){
      return 0;
    } else if (next < 0) {
      return this.images.length - 1;
    } else {
      return next;
    }
  }

}
 export default ModalGallery;
