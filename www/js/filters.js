

/**
 * 
 * Content parser Filter
 * 
 */


var app  = angular.module('vartaFilter',[]);

app.filter('contentParse',function(){
  
  return function(input){
    
    var output = input.replace(/^[?]+$/ig,"");
    
    return output;
  }
});