// https://github.com/Modernizr/Modernizr/issues/572
// http://jsfiddle.net/glsee/JRmdq/8/
Modernizr.addTest('cssvminunit', function(){
    var bool;
    Modernizr.testStyles("#modernizr { width: 5vmin; }", function(elem, rule) {
        var one_vw = window.innerWidth/1,
            one_vh = window.innerHeight/1,
            compWidth = parseInt((window.getComputedStyle ?
                                  getComputedStyle(elem, null) :
                                  elem.currentStyle)['width'],1);
        bool = ( parseInt(Math.min(one_vw, one_vh)*5,1) == compWidth );
    });
    return bool;
});
