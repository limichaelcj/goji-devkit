module.exports = function(anchorSelector, linkSelector){
  const anchor = document.querySelector(anchorSelector);
  const links = Array.from(document.querySelectorAll(linkSelector));
  links.forEach(el => Object.assign(el.style, {
    position: 'sticky',
    top: 0
  }));
  window.addEventListener('scroll', e => {
    const rect = anchor.getBoundingClientRect();
    // check if the element is above the client's viewport
    if (rect.top < 0){
      const ratio = rect.top / rect.height * -1;
      const percent = ratio > 1 ? 1 : ratio;
      links.forEach(link => {
        const linkRect = link.getBoundingClientRect();
        if (window.innerHeight < linkRect.height){
          const relativeHeight = linkRect.height - window.innerHeight;
          const offset = ratio * relativeHeight;
          link.style.top = `-${offset}px`
        } else {
          link.style.top = '1em'
        }
      })
    }
  })
}
