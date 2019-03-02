class Slideshow {
  constructor(node, options = {}){
    if (!node || !(node instanceof HTMLElement)){
      throw new Error('Invalid constructor')
    }
    this._node = node;
    this._slides = Array.from(node.querySelectorAll('img'));
    this._current = 0; // current slide
    this._interval = 3000;
    this._intervalInstance; // value returned from setInterval
    this._transition = {
      time: 400,
      curve: ''
    }
    this._rotation = [
      {
        left: '-100%',
        opacity: 0
      },
      {
        left: 0,
        opacity: 1
      },
      {
        left: '100%',
        opacity: 0
      }
    ];
    this.cycle = this.cycle.bind(this);
    this.rotate = this.rotate.bind(this);
    this.configure(options);
    this.initialize();
  }

  get node() {
    return this._node;
  }
  get slides() {
    return this._slides;
  }
  get current() {
    return this._current;
  }
  get interval() {
    return this._interval;
  }
  get intervalInstance() {
    return this._intervalInstance;
  }
  get transition() {
    return this._transition;
  }
  get rotation() {
    return this._rotation;
  }

  configure(options) {
    if (options.interval) this._interval = options.interval;
    if (options.transition) {
      const trans = permit(options.transition, ['time', 'curve']);
      Object.assign(this._transition, permit(options.transition, ['time', 'curve']));
    }
    // helper function
    function permit(obj, allowed){
      const newObj = {};
      for(let key in obj) {
        if (allowed.includes(key)) {
          if (obj[key] instanceof Object) {
            newObj[key] = Object.assign({}, obj[key]);
          } else {
            newObj[key] = obj[key]
          }
        }
      }
      return newObj;
    }
  }

  initialize() {
    // change parent node into a pinnable position if not
    if (['', 'static'].includes(this.node.style.position)) {
      this.node.style.position = 'relative';
    }
    this.node.style.overflow = 'hidden';
    // set default styles for slides
    this.slides.forEach(slide => {
      Object.assign(slide.style, {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        objectFit: 'cover',
        transition: `${this.transition.time}ms ${this.transition.curve}`
      });
    });
    // clone images if only two images for smooth transition
    if (this.slides.length == 2) {
      for(let i=0;i<2;i++){
        var clone = this.slides[i].cloneNode();
        this.slides.push(clone);
      }
    }
    // set initial rotation position styles
    Object.assign(this.slides[0].style, this.rotation[1]);
    this.slides.slice(1).forEach(slide => {
      Object.assign(slide.style, this.rotation[2]);
    });
    // initialize rotation interval call
    this._intervalInstance = setInterval(this.rotate, this.interval);
  }

  cycle(index) {
    let last = this.slides.length - 1;
    return index < 0 ? last : index > last ? 0 : index;
  }

  rotate(next = this.cycle(this.current + 1)) {
    this._current = next;
    for(let i=0; i<3; i++){
      Object.assign(
        this.slides[this.cycle(this.current + i - 1)].style,
        this.rotation[i]
      );
    }
  }
}
