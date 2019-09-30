module.exports = function(selector){
  
  // get selected elements and sort descending by height
  const elements = [...document.querySelectorAll(selector)];
  const descHeight = elements.sort((a,b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height);
  
  // anchor, the tallest element, will scroll normally
  // links, all other elements, will scroll slower
  const [ anchor, ...links ] = descHeight;
  
  // this function's css transforms leverage position and top rules
  links.forEach(el => {
    Object.assign(el.style, {
      position: 'sticky',
      top: 0,
    })
  })
  
  // add window scroll listener
  window.addEventListener('scroll', e => {
    
    const anchorRect = anchor.getBoundingClientRect();
    
    // if anchor top is above viewport, apply parallax sync
    if (anchorRect.height > window.innerHeight && anchorRect.top < 0){
      
      // the ratio of pixels that the client is below the anchor's top
      // will be used to calculate the offset of every link's top
      const ratio = anchorRect.top / anchorRect.height;
      
      // iterate each link that is smaller than the anchor
      links.forEach(link => {
        const linkRect = link.getBoundingClientRect();
        
        // only apply parallax if the height is greater than the viewport
        // and the link's bottom is below the viewport bottom
        if (linkRect.height > window.innerHeight && window.innerHeight < linkRect.bottom){
          
          // apply ratio to the link height - viewport height,
          // matching the link's bottom to anchor's bottom
          const diff = linkRect.height - window.innerHeight;
          const offset = ratio * diff;
          
          // apply the css transform which will be a negative px value
          link.style.top = `${offset}px`;
        }
      })
    }
  });
}
