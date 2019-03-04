export default class PhotoGallery {
  constructor(node, options = {}){
    if (!node || !(node instanceof HTMLElement)){
      throw new Error('ArgumentError: Constructor requires argument of type HTMLElement')
    }
    this._node = node;
    this._photos = Array.from(node.querySelectorAll('img')); //images paths in array
    this._settings = {
      direction: 'row',
      padding: 50,
      color: 'white'
    }
    this._style = {
      display: 'flex',

    }
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

  configure(options){
    
  }

  initialize(){

  }
}
