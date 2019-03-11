# Goji Devkit
###### Flexible Web Development Components and Tools

## Contents
*Web Components*
- **Slideshow.js**: Display images in a customizable slideshow.
- **PhotoGallery.js**: A customizable photo reel.
- **ModalGallery.js**: Click on images in a set of html image nodes to bring up a modal for a closer look.
- **GridLayout.js**: Organize page elements in a customized grid.

*UX Tools*
- **dragElement.js**: Select specific DOM elements to inject draggable code.
- **scrollFade.js**: Select items to fade in when scrolling through a web page.
- **smoothScroll.js**: Clicking on a page link will send the viewport smoothly to the target.

*UI Components*
- **tri-spinner.css**: CSS-only spinner, easily injected into HTML with a single `<div>`.

## Usage
Using Node, require the package to create an object holding all package contents:
```js
const goji = require('goji-devkit')
```
Access the individual package contents via object notation:
```js
const Slideshow = goji.components.Slideshow
```
_NOTE: Package contents cannot be accessed by front-end scripts unless bundled with a module bundler (e.g. [webpack](https://webpack.js.org/))._
## _Web Components_
```js
const Slideshow = goji.components.Slideshow
const PhotoGallery = goji.components.PhotoGallery
const ModalGallery = goji.components.ModalGallery
```
Create a new component instance and pass it an existing DOM node:
```js
const ss = document.querySelector('#ss');
new Slideshow(ss);
```
_**IMPORTANT:** Goji web components require an existing DOM node to be passed to its constructor. Make sure DOM elements are loaded before running the script_

Default options will be set unless an options object is also passed to the constructor:
```js
new Slideshow(ss, {
  interval: 5000,
  transition: {
    time: 250,
    curve: 'linear'
  },
  effects: {
    direction: 'bottom'
  }
});
```
#### Customizable Options
##### Slideshow:
* `interval`: Time interval in between image transitions (`ms`, default: `3000`).
* `transition`: Transition timing
  - `time`: How long the transition animation takes (`ms`, default: `400`).
  - `curve`: Transition timing function.
    - `ease`: Slow start and end. (default)
    - `linear`: Linear speed from start to end.
    - `ease-in`: Starts slow, speeds up.
    - `ease-out`: Starts fast, slows down.
    - `cubic-bezier(x1, y1, x2, y2)`: Custom curve function.
* `effects`: Transition effects
  - `fade`: Images fade in and out upon transition (`boolean`, default: `true`).
  - `direction`: Direction in which images moves into the frame.
    - `left` (default, will move into the frame from the right to left)
    - `right`
    - `top`
    - `bottom`
  - `scale`: Change the scale of the image when out of frame (`ratio`, default: `1`).
  - `rotate`: Change the rotation of the image when out of frame (`degrees`, default: `0`).
  
##### PhotoGallery:
* `direction`: `'row'` (default) or `'column'`
* `padding`: Spacing between images and border (`px`, default: `40`)
* `color`: Background color behind the images (default: `white`)
* `scrollBar`: Customize the scrollbar appearance
  - `width`: Thickness of scrollbar (`px`, default: `16`)
  - `color`: Color of scrollbar handle (default: `#222`)
  - `border`: Color of scrollbar handle's border (default: `#aaa`)
  - `radius`: Roundess of scrollbar handle (`px`, default: `0`)
  - `margin`: Offset distance between scrollbar ends and border (`px`, default: `0`)
  - `shadow`: Scrollbar's shadow color (default: `transparent`)

##### ModalGallery:
* `reel`: Height of the photo reel, where photos can be selected for viewing (`%`/`px`/`vh`, default: `20%`)
* `view`: Height of the view space, above the reel. Calculated from remaining space after reel height. (`%`, default: `90`)
* `color`: Background color of the modal element (default: `rgba(0,0,0,0.8)`)
* `highlight`: Color of image border of selected image in the reel (default: `rgba(210,210,210,0.8`)
