module.exports.register = function(Handlebars) {
  'use strict';
  
  Handlebars.registerHelper('email', function(emailAddr) {
	var encodeEmail = emailAddr.replace('@', '\xAB').replace('a', '\xA9').replace('e', '\xAA').replace('.', '\xAC');
    var parts = emailAddr.split('@');
    var emailBody = '<span>'+parts[0] + '</span>&#64;<span>' + parts[1] + '</span>';
  //  var safeEmail = '<a href="" class="emailLink" data-addr="' + encodeEmail + '">' + emailBody + '</a>';
    var safeEmail = '<a href="" class="emailLink" data-addr="' + encodeEmail + '">email</a>';
    return safeEmail;
  });
};