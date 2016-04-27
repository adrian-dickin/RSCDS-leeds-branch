module.exports.register = function(Handlebars) {
  'use strict';
  
var extend =  function(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

var createFrame = function(object) {
  var obj = {};
  extend(obj, object);
  return obj;
};

Handlebars.registerHelper('list', function(context, options) {
  var ret = "", data;
  if (options.data) {
      data = createFrame(options.data);
    }
  var nElements = (context.length < 4) ? context.length : 3;
  for(var i=0, j=nElements; i<j; i++) {
  	if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === j - 1);
	}
    ret = ret + options.fn(context[i], {data: data});
  }

  return ret;
});
  
  
};