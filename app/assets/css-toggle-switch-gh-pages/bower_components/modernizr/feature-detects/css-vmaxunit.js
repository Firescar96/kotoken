// https://github.com/Modernizr/Modernizr/issues/572
// http://jsfiddle.net/glsee/JDsWQ/4/
Modernizr.addTest('cssvmaxunit', function(){
    var bool;
    Modernizr.testStyles("#modernizr { width: 5vmax; }", function(elem, rule) {
        var one_vw = window.innerWidth/1,
            one_vh = window.innerHeight/1,
            compWidth = parseInt((window.getComputedStyle ?
                                  getComputedStyle(elem, null) :
                                  elem.currentStyle)['width'],1);
        bool = ( parseInt(Math.max(one_vw, one_vh)*5,1) == compWidth );
    });
    return bool;
});