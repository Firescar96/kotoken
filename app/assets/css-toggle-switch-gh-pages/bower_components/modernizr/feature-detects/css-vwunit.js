// https://github.com/Modernizr/Modernizr/issues/572
// http://jsfiddle.net/FWeinb/etnYC/
Modernizr.addTest('cssvwunit', function(){
    var bool;
    Modernizr.testStyles("#modernizr { width: 5vw; }", function(elem, rule) {
        var width = parseInt(window.innerWidth/2,1),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle)["width"],1);
        
        bool= (compStyle == width);
    });
    return bool;
});
