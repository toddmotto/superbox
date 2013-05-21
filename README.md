# Superbox
## The lightbox, reimagined

SuperBox takes the whole 'image' and 'lightbox' one step further, reducing the JavaScript and image load dependence to make lightboxing a thing of the past! Using HTML5 data-* attributes, responsive layouts and jQuery, here's SuperBox.

SuperBox works wonders as a static image gallery, which you can click to reveal a full version of the image. Each image in the demo is the same size, but SuperBox supports any image size.

### Demo

You can view the v3 [demo here](http://seydoggy.github.io/superbox/).

### Instructions

1. Include jQuery in your page (likely just before the body tag).

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	```

1. Include the superbox plugin just after the call to jQuery.

	```html
	<script src="js/jquery.superbox.js"></script>
	```

1. Include the other superbox assets (css, images, etc...) accordingly.
	
	```html
	<link href="css/superbox.css" rel="stylesheet">
	````

1. Add a div to your markup with a class or id that suits your needs. For example:

	```html
	<div class="MyGalley">
	</div>
	```

1. Inside the div you created in step 1, add div and image pairs that contain your thumbnail images (square are best, but whatever the case be sure to make them all the same size and orientation). For example:

	```html
	<div>
	    <img src="img/thumb-1.jpg" data-img="img/full-1.jpg" alt="">
	</div>
	```

	Add as many of these as your gallery requires, one after the other. All together it should look like this:

	```html
	<div class="MyGalley">
		<div>
		    <img src="img/thumb-1.jpg" data-img="img/full-1.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-2.jpg" data-img="img/full-2.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-3.jpg" data-img="img/full-3.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-4.jpg" data-img="img/full-4.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-5.jpg" data-img="img/full-5.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-6.jpg" data-img="img/full-6.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-7.jpg" data-img="img/full-7.jpg" alt="">
		</div>
		<div>
		    <img src="img/thumb-8.jpg" data-img="img/full-8.jpg" alt="">
		</div>
	</div>
	```	

1. Invoke superbox on the gallery div. It's best to do this on document ready or some such handler. For example:

	```html
	<script>
	$(function() {
    	$('.MyGallery').SuperBox();
    });
    </script>
	```

### Options

```js
$.SuperBox({
	background : '#FF0000', // Full image background color. Default: #333
	border : 'white', // Full image border color. Default: #222
	height : 600, // Maximum full image height. Default: 400
	view : 'landscape|square|portrait', // Sets ratio on smaller viewports. Default: landscape
	xColor : '#CCC', // Close icon color. Default: #FFF
	xShadow : 'embed' // Close icon shadow. Default: none
});
```

### HTML5 data-* attributes

SuperBox feeds off the data-img custom attribute I've added to display the full image, this means we don't have to rely on more markup as it dynamically appends the data-img source for you.

### Responsive

SuperBox is also responsive, allowing you to use it across any device. The media queries are really basic so you can build and expand upon it to fit within your project.

### Keyboard navigation

Superbox allows your viewers to arrow through your image gallery.

### Browser support

Works on all modern browsers, IE8 and above.