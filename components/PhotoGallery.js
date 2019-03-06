class PhotoGallery {
  constructor(node, options = {}){
    if (!node || !(node instanceof HTMLElement)){
      throw new Error('ArgumentError: Constructor requires argument of type HTMLElement')
    }
    this._node = node;
    this._photos = Array.from(node.querySelectorAll('img')); //images paths in array
    this._settings = {
      direction: 'row',
      padding: 40,
      color: 'white',
      scrollbar: {
        width: 16,
        color: '#222',
        border: '#aaa',
        radius: 0,
        margin: 0,
        shadow: 'transparent'
      }
    }
    this._configure(options);
  }
  get node() {
  	return this._node;
  }
  get photos() {
    return this._photos;
  }
  get settings() {
    return this._settings;
  }

  _configure(options) {
    this._applySettings(options);
    this._initialize();
  }

  _applySettings(options){
    // apply general settings
    const strongParams = validate(options);
    if (strongParams.hasOwnProperty('scrollbar')) {
      Object.assign(this._settings.scrollbar, strongParams.scrollbar);
      delete strongParams.scrollbar;
    }
    Object.assign(this._settings, strongParams);
    // HELPER FUNCTIONS
    // data validation
    function permit(obj, allowed){
      const newObj = JSON.parse(JSON.stringify(obj));
      for(let key in newObj){
        if (!allowed.includes(key)) delete newObj[key];
      }
      return newObj;
    }
    function validate(options){
      const root = permit(options, ['direction', 'padding', 'color', 'scrollbar']);
      // direction
      if (root.hasOwnProperty('direction') && !['row', 'column'].includes(root.direction)) {
        delete root.direction;
        console.error('options.direction must equal one of the following strings: row, column')
      }
      // padding
      clean(root, 'padding', 'number', 'options.padding');
      // color
      clean(root, 'color', 'string', 'options.color');
      // scrollbar
      clean(root, 'scrollbar', 'object', 'options.scrollbar');
      if (root.hasOwnProperty('scrollbar')){
        const scroll = permit(root.scrollbar, ['width', 'color', 'border', 'radius']);
        clean(scroll, 'width', 'number', 'scrollbar.width');
        clean(scroll, 'color', 'string', 'scrollbar.color');
        clean(scroll, 'border', 'string', 'scrollbar.border');
        clean(scroll, 'radius', 'number', 'scrollbar.radius');
        clean(scroll, 'margin', 'number', 'scrollbar.margin');
        clean(scroll, 'shadow', 'string', 'scrollbar.shadow');
      }

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
    // parent node style
    const settings = this._settings;
    const pad = `${settings.padding}px`;
    this.node.classList.add('goji-devkit-photogallery-scroll');
    Object.assign(this.node.style, {
      overflow: 'auto',
      display: 'flex',
      flexDirection: settings.direction,
      alignItems: 'center',
      padding: pad,
      boxSizing: 'border-box',
      backgroundColor: settings.color
    });
    // photos style
    const paddingSide = settings.direction == 'column' ? 'marginTop' : 'marginLeft';
    const span = settings.direction == 'column' ? 'width' : 'height';
    const basis = settings.direction == 'column' ? 'height' : 'width';
    this.photos.forEach(photo => {
      Object.assign(photo.style, {
        [span]: '100%',
        flex: '0 0 auto'
      });
    });
    this.photos.slice(1).forEach(photo => {
      photo.style[paddingSide] = pad;
    });
    // add tail div to make up for ignored padding at end of flexbox
    const tail = document.createElement('div');
    tail.innerHTML = '.';
    const basisCap = basis.charAt(0).toUpperCase() + basis.slice(1);
    Object.assign(tail.style, {
      visibility: 'hidden',
      ['min' + basisCap]: pad,
      ['max' + basisCap]: pad,
    });
    this.node.appendChild(tail);
    // scrollbar style
    const scrollTag = '.goji-devkit-photogallery-scroll::-webkit-scrollbar'
    function cssRule(tag, cssObj){
      return tag + ' ' + JSON.stringify(cssObj).replace(/\"/g,'').replace(/,/g,';');
    }
    const scrollbar = cssRule(`${scrollTag}`, {
      width: settings.scrollbar.width + 'px',
      height: settings.scrollbar.width + 'px'
    });
    const scrollbarTrack = cssRule(`${scrollTag}-track`, {
      background: 'transparent',
      margin: settings.scrollbar.margin + 'px',
      ["border-radius"]: settings.scrollbar.radius + 'px',
      ["box-shadow"]: `inset 0 0 15px ${settings.scrollbar.shadow}`
    });
    const scrollbarThumb = cssRule(`${scrollTag}-thumb`, {
      background: settings.scrollbar.color,
      border: `1px solid ${settings.scrollbar.border}`,
      ["border-radius"]: settings.scrollbar.radius + 'px'
    });
    const css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = [
      scrollbar,
      scrollbarTrack,
      scrollbarThumb
    ].join("\n");
    document.head.appendChild(css);
  }
}
