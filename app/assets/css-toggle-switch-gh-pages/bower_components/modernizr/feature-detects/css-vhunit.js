// https://github.com/Modernizr/Modernizr/issues/572
// Similar to http://jsfiddle.net/FWeinb/etnYC/
Modernizr.addTest('cssvhunit', function() {
    var bool;
    Modernizr.testStyles("#modernizr { height: 5vh; }", function(elem, rule) {   
        var height = parseInt(window.innerHeight/2,1),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle)["height"],1);
        
        bool= (compStyle == height);
    });
    return bool;
});