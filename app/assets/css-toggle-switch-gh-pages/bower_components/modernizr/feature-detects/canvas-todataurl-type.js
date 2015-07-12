// canvas.toDataURL type support
// http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl

// This test is asynchronous. Watch out.

(function () {

    if (!Modernizr.canvas) {
        return false;
    }

    var image = new Image(),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    image.onload = function() {
        ctx.drawImage(image, , );

        Modernizr.addTest('todataurljpeg', function() {
            return canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === ;
        });
        Modernizr.addTest('todataurlwebp', function() {
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === ;
        });
    };

    image.src = 'data:image/png;base64,iVBORwKGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
}());
