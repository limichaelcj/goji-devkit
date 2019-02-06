/* Dependencies: jQuery */

function setupScrollFade(selector,exclude,className,install=true){
  if (install) $(document).on('scroll', scrollFade);
  else $(document).off('scroll', scrollFade);

  function scrollFade(){
    var pageTop = window.pageYOffset;
    var pageBottom = pageTop + window.innerHeight;
    //don't select first section because it's at the top
    //otherwise it will be opacity:0 until scroll event
    var sections = $(selector).not(exclude);
    for(var i=0; i<sections.length;i++){
      var tag = sections[i];
      if ($(tag).offset().top<pageBottom-100){
        $(tag).addClass(className);
      }
      if($(tag).offset().top > pageBottom){
        $(tag).removeClass(className);
      }
    }
  }
}
