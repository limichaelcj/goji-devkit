# Goji Devkit
###### Flexible Web Development Components and Tools

## Contents
*Web Components*
- **Slideshow.js**: Display images in a customizable slideshow.
- **PhotoGallery.js**: A customizable photo reel.
- **ModalGallery.js**: Click on images in a set of html image nodes to bring up a modal for a closer look.
- **GridLayout.js**: Organize page elements in a customized grid.

*UI Components*
- **tri-spinner.css**: CSS-only spinner, easily injected into HTML with a single `<div>`.

*UX Tools*
- **assetLoader.js**: Load large assets with a UX-friendly spinner before displaying them on page.
- **dragElement.js**: Select specific DOM elements to inject draggable code.
- **scrollFade.js**: Select items to fade in when scrolling through a web page.
- **parallaxSync.js**: Allow HTML elements of varying lengths to scroll at different speeds to sync their tops and bottoms.

*Data Library*
- **permit.js**: Permits only specified keys to be used in an object. Designed for data sanitation of an options object to be passed to a function.
- **sanitize.js**: Sanitizes target keys in an object by deleting the key-value pair if the value does not pass a given test function.
- **pickFrom.js**: Pick one item randomly from an array. Allows weighted picks.
- **EventListenerManifest.js**: An interface to add, remove, and track event listeners on the client browser.

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

#### ModalGallery:
Create a new instance of ModalGallery, then link it to a css selector that matches the group of images you want to include in the modal gallery.
```js
const mg = new ModalGallery({ theme: 'light' });
mg.link('.images');
```
Each `.images` element will open the modal gallery with all `img` children elements within. Clicking on the `#img1` element will open up the modal gallery with both `#img1` and `#img2` elements in the gallery reel.
```html
<div class="images">
  <img id="img1">
  <img id="img2">
</div>
<div class="images">
  <img id="3">
  <img id="4">
</div>
```
##### ModalGallery options:
* `reel`: Height of the photo reel, where photos can be selected for viewing (`%`/`px`/`vh`, default: `20%`)
* `view`: Height of the image relative to the view space, above the reel. View space is calculated from remaining space after reel height. (`%`, default: `90`)(e.g. If the reel is 20vh, the view space will be 80vh and the view image will be 90% of 80vh)
* `theme`: `'light'` or `'dark'`. (default: `'dark'`)
* `highlight`: Highlighting color of current image. (default: `#2196F3`)

## _UX Tools_

#### assetLoader

**Usage:** assetLoader(_options_ [Object])

```js
const assetLoader = require('goji-devkit').ux.assetLoader;

const options = {
  scope: document.querySelector('.container'),
  selector: ['img', 'iframe'],
  spinner: '<div class="my-spinner"></div>'
}

assetLoader(options);
```
##### assetLoader options:
* `scope`: The HTML element in which to search for assets. (default: `document.body`)
* `selector`: An array of CSS selector strings to target within the scope. (default: `['img']`)
* `spinner`: HTML string that defines the HTMl structure of the spinner you want to use. (default: `'<div class="spinner"></div>'`)
* `logs`: Determines whether to keep logs of asset load times. (default: `false`)
* `timeout`: Sets the max time in milliseconds to allow asset loading before displaying them. (default: `5000`)

#### dragElement

**Usage:** dragElement(_element_ [HTML Element])

```js
const dragElement = require('goji-devkit').ux.dragElement;

const draggableElement = document.querySelector('.draggable');
dragElement(draggableElement);
```

#### parallaxSync

**Usage:** parallaxSync(_selector_ [String])

```js
const parallaxSync = require('goji-devkit').ux.parallaxSync;

// smaller elements will be set to position:sticky and change their
// top values based on the scroll position of the tallest element
parallaxSync('parallax');
```

[Demo](https://codepen.io/mykolodon/pen/NWKZprb?editors=0010)

## _Data Library_

#### permit

**Usage:** permit(_params_ [Object], _permitted keys_ [Array of strings])

```js
const permit = require('goji-devkit').data.permit;

const params = {
  goodKey: true,
  anotherGoodKey: 2,
  badKey: 'potentially harmful data'
}
const strongParams = permit(params, ['goodKey', 'anotherGoodKey']);
// strongParams = { goodKey: true, anotherGoodKey: 2 }
```

#### sanitize

**Usage:** sanitize(_params_ [Object], _key to sanitize_ [String], _test function_ [Function]); `

```js
const sanitize = require('goji-devkit').data.sanitize;

const params = {
  goodKey: 12,
  badKey: '45'
}
sanitize(params, 'badKey', (val) => {
  return typeof val === 'number'
});
// params = { goodKey: 12 }
```
#### pickFrom

**Usage:** pickFrom([Array])

```js
const pickFrom = require('goji-devkit').data.pickFrom
```
Unweighted pick:
```js
const anyValues = [3, 'hello world', true, (n) => n*n]
// pickFrom will choose one of the items at random
const picked = pickFrom(anyValues);
```
Weighted pick:
```js
const weightedValues = [
    { value: 3, weight: 10 },
    { value: 'hello world', weight: 2.1}
    { value: true, weight: 84}
]
// if the array values are objects with value and weight keys, pickFrom will apply a weighted pick based on the weight number. The higher the weight number, the higher the chance of getting picked.
const picked = pickFrom(weightedValues);
// picked probably equals true
```
