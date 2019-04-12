// requires babel-polyfill for clientside usage of promises

function assetLoader(options = {}){
  // set options
  const settings = {
    container: options.scope || document.body,
    selector: options.selector || ['img'],
    spinner: options.spinner || '<div class="spinner"></div>',
    logs: options.logs || false,
    timeout: options.timeout || 10000,
    _containerSizeChange: false
  }
  // get html elements
  if (typeof settings.selector === 'string') settings.selector = [settings.selector];
  const assets = [];
  settings.selector.forEach(tag => {
    assets.concat(Array.from(container.querySelectorAll(tag)));
  })
  const container = settings.container;
  const children = Array.from(container.children);
  // remove children from display
  const originalDisplays = children.map(elem => elem.style.display);
  children.forEach(elem => elem.style.display = 'none');
  // test if container size is dependent upon children
  const container = settings.container;
  const containerComputed = window.getComputedStyle(container);
  const containerSize = {
    height: pxToNum(containerComputed.height),
    width: pxToNum(containerComputed.width),
    min: pxToNum(containerComputed.fontSize) * 5
  }
  // create style change object if size change is needed
  if (containerSize.height < containerSize.min || containerSize.width < containerSize.min) {
    settings._containerSizeChange = {
      original: {
        height: container.style.height || 'auto',
        width: container.style.width || 'auto'
      },
      loading: {
        height: containerSize.min + 'px',
        width: containerSize.min + 'px'
      }
    }
  }
  // set container size changes if changes object exists
  if (settings._containerSizeChange) {
    Object.assign(container.style, settings._containerSizeChange.loading);
  }
  // prepare container for loading spinner

  const originalOpacity = container.style.opacity || 1;
  const originalTransition = container.style.transition || 'all 0 ease 0';
  container.style.transition = 'all 0 ease 0';
  container.style.opacity = 1;
  // create spinner div and move into container
  const spinner = document.createElement('div');
  Object.assign(spinner.style, {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  })
  spinner.innerHTML = settings.spinner;
  container.append(spinner);
  // for logging
  const startTime = Date.now();
  // promises to keep track on each image element's onload completion
  const promises = assets.map((asset,index,arr) => new Promise((resolve, reject) => {
    if (asset.complete) {
      if (settings.logs) console.log(`%c Image loaded [${index+1}/${arr.length}] (${Date.now() - startTime}ms)`, 'color: #4CAF50');
      resolve(true);
    } else {
      let loadTimeout = setTimeout(()=>{
        if (settings.logs) console.warn(`Image timeout [${index+1}/${arr.length}] (${settings.timeout}ms)`);
        resolve(false);
      }, settings.timeout);
      asset.onload = () => {
        if (settings.logs) console.log(`%c Image loaded [${index+1}/${arr.length}] (${Date.now() - startTime}ms)`, 'color: #4CAF50');
        clearTimeout(loadTimeout);
        resolve(true);
      }
    }
  }));
  // returns a thenable promise after all assets loaded
  return Promise.all(promises).then(async (results)=>{
    if (settings.logs) {
      let numLoaded = results.filter(loaded => loaded === true).length;
      let loadTime = results.every(loaded => loaded === true)
        ? Date.now() - startTime
        : `timeout: ${settings.timeout}`;
      let message = `[${numLoaded}/${results.length}] loaded (${loadTime}ms)`;
      console.log('%c ' + message, 'color: #2196F3')
    }
    // fade out spinner
    spinner.style.transition = '500ms cubic-bezier(.5,-1,.8,0)';
    spinner.style.opacity = 0;
    spinner.style.transform = 'scale(0)'
    await sleep(500);
    spinner.remove();
    // hide container, add contents, fade in
    container.style.opacity = 0;
    await sleep(10);
    // revert container size changes
    if (settings._containerSizeChange) {
      Object.assign(container.style, settings._containerSizeChange.original);
    }
    // return children contents to container
    children.forEach((elem,index) => {
      elem.style.display = originalDisplays[index];
    });
    await sleep(10);
    container.style.transition = '1s';
    container.style.opacity = originalOpacity;
    await sleep(1000);
    container.style.transition = originalTransition;
    return 200;
  });
  // helper
  function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  function pxToNum(pxStr){
    return parseFloat(pxStr.replace('px', ''), 10);
  }
}

module.exports = assetLoader;
