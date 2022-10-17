export function ResizeFrame() {

  var value = $('.iframe-init').data("value");

  if(value == 0){

   $('.iframe-init').css("height", "500px");

   $('.iframe-init').data("value", 1);

  }else{

   $('.iframe-init').css("height", "50px");

   $('.iframe-init').data("value", 0);
   window.parent.postMessage("data");

  }

}
