// -moz-user-select:none test.

// by ryan seddon
//https://github.com/Modernizr/Modernizr/issues/25


Modernizr.addTest("userselect",function(){
    return Modernizr.testAllProps("user-select");
});

