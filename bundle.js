const show = new Slideshow(document.getElementById('slideshow'), {
  interval: 2000,
  transition: {
    time: 300,
    curve: 'linear'
  },
  effects: {
    fade: false,
    direction: 'bottom'
  }
});
