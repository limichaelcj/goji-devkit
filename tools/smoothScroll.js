/* Requires jQuery */

export default function setupSmoothScroll(tag,exclude,className,removal=false){
  $("a").on('click', function(e){
    if (this.hash !== ''){
      e.preventDefault();
      var hash = this.hash;
      $(tag).not(exclude).addClass(className);
      setTimeout(()=>{
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 700, function(){
          window.location.hash = hash;
          if(removal){ //option to remove added class
            $(tag).not(exclude).removeClass(className);
          }
        });
      }, 200);
    }
  });
}
