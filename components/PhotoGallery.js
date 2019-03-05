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
      color: 'white'
    }
    this._configure(options);
  }
  get node() {
  	return this._node;
  }
  get photos() {
    return this._photos;
  }
  get style(){
    return this._style;
  }

  _configure(options) {
    this._applySettings(options);
    this._initialize();
  }

  _applySettings(options){
    // apply general settings
    const strongOptions = validate(options);
    Object.assign(this._settings, strongOptions);
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
      const root = permit(options, ['direction', 'padding', 'color']);
      // direction
      if (root.hasOwnProperty('direction') && !['row', 'column'].includes(root.direction)) {
        delete root.direction;
        console.error('options.direction must equal one of the following strings: row, column')
      }
      // padding
      if (root.hasOwnProperty('padding')){
        clean(root, 'padding', 'number', 'options.padding');
      }
      // color
      if (root.hasOwnProperty('color')){
        clean(root, 'color', 'string', 'options.color');
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
    Object.assign(this.node.style, {
      overflow: 'auto',
      display: 'flex',
      flexDirection: settings.direction,
      alignItems: 'center',
      padding: `${settings.padding}px`,
      boxSizing: 'border-box',
      backgroundColor: settings.color
    });
    // photos style
    const paddingSide = settings.direction == 'column' ? 'marginTop' : 'marginLeft';
    const shortSide = settings.direction == 'column' ? 'width' : 'height';
    const longSide = settings.direction == 'column' ? 'height' : 'width';
    this.photos.forEach(photo => {
      Object.assign(photo.style, {
        [shortSide]: '100%',
        [longSide]: 'auto',
      });
    });
    this.photos.slice(1).forEach(photo => {
      photo.style[paddingSide] = `${settings.padding}px`;
    });
  }
}
