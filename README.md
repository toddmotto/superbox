# Superbox
## The lightbox, reimagined

**Copyright 2013 Todd Motto <http://www.toddmotto.com>**   
**Copyright 2013 Adam Merrifield <http://seydesign.com>**

SuperBox is a new jQuery plugin I've been composing over the last few days. SuperBox takes the whole 'image' and 'lightbox' one step further, reducing the JavaScript and image load dependence to make lightboxing a thing of the past! Using HTML5 data-* attributes, responsive layouts and jQuery, here's SuperBox.

SuperBox works wonders as a static image gallery, which you can click to reveal a full version of the image. Each image in the demo is the same size, but SuperBox supports any image size.

### Demo

You can view the 2.0 [demo here](http://seydoggy.com/demo/superbox/), at least until the Todd merges my branch anyhow.

### Instructions

1. Include jQuery in your page (likely just before the body tag).

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	```

1. Include the superbox plugin just after the call to jQuery.

	```html
	<script src="js/superbox.js"></script>
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
	xColor : '#CCC', // Close icon color. Default: #FFF
	xShadow : 'embed' // Close icon shadow. Default: none
});
```

### Technology notes

#### HTML5 data-* attributes

SuperBox feeds off the data-img custom attribute I've added to display the full image, this means we don't have to rely on more markup as it dynamically appends the data-img source for you.

#### CSS

The 'expander' if you'd like to call it that, which expands and displays the current image you've clicked on uses a float, which allows it to fill up the entire row of divs using some clever CSS trickery.

The CSS for each 'box' looks like so, which you can see includes the *display:inline; hack for IE7 fixing:

```css
.superbox-active
{
	letter-spacing: 0;
	word-spacing: 0;
	font-size: 0;
}
.superbox-active > div
{
	display:inline-block;
	width:12.5%;
	zoom:1;
}
```

Each image uses a maximum and auto width property as well, so that it responds fluidly to the width of the viewport.

```css
.superbox-active > div img
{
	max-width:100%;
	width:100%;
	vertical-align:bottom;
	cursor:pointer;
}
```

#### Responsive

SuperBox is also responsive, allowing you to use it across any device. The media queries are really basic so you can build and expand upon it to fit within your project.

#### jQuery

The jQuery is pretty simple stuff, and at the minute it's a pretty simple lightweight plugin.

#### Browser support

I've tested SuperBox on all modern browsers, IE7, IE8, IE9 and IE10 and it works perfectly. The sizing is a little different in IE7 as by default the plugin is shipped with box-sizing:border-box; which changes the CSS box model for the better. Read up on it if you're unsure about box-sizing.

### Extending SuperBox

At the minute SuperBox is pretty flexible and a perfect platform to build upon. I do plan on updating it to include more features in the near future. Should you have ideas for future plugin additions, feel free to get involved and comment, fork or update it.