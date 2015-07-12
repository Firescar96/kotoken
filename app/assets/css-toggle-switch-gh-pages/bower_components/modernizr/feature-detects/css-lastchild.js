// last-child pseudo selector
// https://github.com/Modernizr/Modernizr/pull/34


Modernizr.addTest('lastchild', function(){

  return Modernizr.testStyles("#modernizr div {width:1} #modernizr :last-child{width:2;display:block}", function (elem) {
    return elem.lastChild.offsetWidth > elem.firstChild.offsetWidth;
  }, 2);

});
