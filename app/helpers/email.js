module.exports.register = function(Handlebars) {
  'use strict';

  function encode(emailAddr) {
    return emailAddr.replace('@', '\xAB').replace('a', '\xA9').replace('e', '\xAA').replace('.', '\xAC');
  }

  function doEmail(emailAddr, msg) {
    var encodedEmail = encode(emailAddr);
//    var parts = emailAddr.split('@');
//    var emailBody = '<span>'+parts[0] + '</span>&#64;<span>' + parts[1] + '</span>';
    var safeEmail = '<a href="" class="btn btn-primary btn-xs emailLink" data-addr="' + encodedEmail + '">' + msg + '</a>';
    return safeEmail;
  }

  Handlebars.registerHelper('email', function(emailAddr) {
    return doEmail(emailAddr, 'email');
  });

  Handlebars.registerHelper('emailWithLabel', function(emailAddr, label) {
    return doEmail(emailAddr, label);
  });

  Handlebars.registerHelper('emailText', function(emailAddr) {
    return '<span class="emailLink" data-addr="' + encode(emailAddr) + '">email</span>';
  });

  Handlebars.registerHelper('anchor', function(link) {
    return 'link_'+link.replace(' ', '_');
  });

};
