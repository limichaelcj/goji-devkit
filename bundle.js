const show = new Slideshow(document.getElementById('slideshow'), {
  interval: 2000,
  transition: {
    time: 300,
    curve: 'ease'
  },
  effects: {
    fade: false,
    direction: 'bottom'
  }
});

const gallery = new PhotoGallery(document.getElementById('photogallery'), {
  direction: 'row',
  padding: 40,
  color: '#f0f0f0',
  scrollbar: {
    color: '#bbb',
    width: 10,
    radius: 5
  }
});
