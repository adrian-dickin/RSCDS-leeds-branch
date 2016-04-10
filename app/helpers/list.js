module.exports.register = function(Handlebars) {
  'use strict';
  
Handlebars.registerHelper('list', function(context, options) {
  var ret = "";
console.log(options);
  var nElements = (context.length < 4) ? context.length : 3;
  for(var i=0, j=nElements; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});
  
  
};