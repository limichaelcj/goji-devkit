class Slideshow {
  constructor(node, options = {}){
    if (!node || !(node instanceof HTMLElement)){
      throw new Error('ArgumentError: Constructor requires argument of type HTMLElement')
    }
    this._node = node;
    this._slides = Array.from(node.querySelectorAll('img'));
    this._settings = {
      interval: 3000,
      transition: {
        time: 400,
        curve: ''
      },
      effects: {
        fade: true,
        direction: 'left',
        scale: 1,
        rotate: 0
      },
      rotation: [
        {visibility:'hidden'},
        {visibility:'visible'},
        {visibility:'hidden'}
      ]
    }
    this._state = {
      current: 0, // current slide
      intervalInstance: null,
    }
    this.cycle = this.cycle.bind(this);
    this.rotate = this.rotate.bind(this);
    this._configure(options);
  }

  get node() {
    return this._node;
  }
  get slides() {
    return this._slides;
  }
  get current() {
    return this._state.current;
  }
  get interval() {
    return this._settings.interval;
  }
  get intervalInstance() {
    return this._state.intervalInstance;
  }
  get transition() {
    return this._settings.transition;
  }
  get rotation() {
    return this._settings.rotation;
  }
  get effects() {
    return this._settings.effects;
  }

  _configure(options) {
    this._applySettings(options);
    this._initialize();
  }

  _applySettings(options) {
    // apply general settings
    const strongOptions = validate(options);
    Object.assign(this._settings, strongOptions);

    // apply effects settings
    const effects = this.effects;
    const rotation = this._settings.rotation;
    // fade
    if (effects.fade){
      rotation[0].opacity = 0;
      rotation[1].opacity = 1;
      rotation[2].opacity = 0;
    }
    // direction
    switch (effects.direction){
      case 'left':
      case 'right':
      case 'top':
      case 'bottom':
        rotation[0][effects.direction] = '-100%';
        rotation[1][effects.direction] = 0;
        rotation[2][effects.direction] = '100%';
        break;
      default:
    }

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
      const root = permit(options, ['interval', 'transition', 'effects']);
      // interval
      clean(root, 'interval', 'number', 'options.interval');
      // transition
      clean(root, 'transition', 'object', 'options.transition');
      if (root.hasOwnProperty('transition')){
        root.transition = permit(root.transition, ['time', 'curve']);
        const transition = root.transition
        clean(transition, 'time', 'number', 'transition.time');
        clean(transition, 'curve', 'string', 'transition.curve');
      }
      // effects
      clean(root, 'effects', 'object', 'options.effects');
      if (root.hasOwnProperty('effects')){
        root.effects = permit(root.effects, ['fade', 'direction']);
        const effects = root.effects;
        clean(effects, 'fade', 'boolean', 'effects.fade');
        clean(effects, 'direction', 'string', 'effects.direction');
        if (
          effects.hasOwnProperty('direction')
          && !['left', 'right', 'top', 'bottom', 'none'].includes(effects.direction)
        ) {
          delete effects.direction;
        }
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

  _initialize() {
    // change parent node into a pinnable position if not already
    if (['', 'static'].includes(this.node.style.position)) {
      this.node.style.position = 'relative';
    }
    this.node.style.overflow = 'hidden';
    // set default styles for slides
    const oppositeAxis = {
      right: 'top',
      left: 'top',
      top: 'left',
      bottom: 'left'
    };
    this.slides.forEach(slide => {
      Object.assign(slide.style, {
        position: 'absolute',
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        transition: `${this.transition.time}ms ${(this.transition.curve || '')}`
      });
      if (['left', 'right', 'top', 'bottom'].includes(this.effects.direction)){
        slide.style[oppositeAxis[this.effects.direction]];
      } else {
        Object.assign(slide.style, { top: 0, left: 0 });
      }
    });
    // clone images if only two images for smooth transition
    if (this.slides.length == 2) {
      const slideHTML = this.node.innerHTML;
      this.node.innerHTML = slideHTML + slideHTML;
      this._slides = Array.from(this.node.querySelectorAll('img'))
    }
    // set initial rotation position styles
    Object.assign(this.slides[0].style, this.rotation[1]);
    this.slides.slice(1).forEach(slide => {
      Object.assign(slide.style, this.rotation[2]);
    });
    // initialize rotation interval call
    if (this.slides.length > 1) {
      this._state.intervalInstance = setInterval(this.rotate, this.interval);
    }
  }

  cycle(index) {
    let last = this.slides.length - 1;
    return index < 0 ? last : index > last ? 0 : index;
  }

  rotate(next = this.cycle(this.current + 1)) {
    this._state.current = next;
    for(let i=0; i<3; i++){
      Object.assign(
        this.slides[this.cycle(this.current + i - 1)].style,
        this.rotation[i]
      );
    }
  }
}
