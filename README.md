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
1. Include the superbox plugin just after the call to jQuery.
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

	```js
	$(function() {
    	$('.MyGallery').SuperBox();
    });
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
.superbox-active > div
{
	position:relative;
	left:4px;
	display:inline-block;
	margin-left:-4px;
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

The jQuery is pretty simple stuff, and at the minute it's a pretty simple lightweight plugin:

```js
;(function($) {

	$.fn.SuperBox = function(options) {

		var settings = $.extend({
			background : null,
			border : null,
			xColor : null,
			xShadow : 'none'
		}, options);

		var sbShow = $('<div class="superbox-show superbox-X"/>'),
			sbImg = $('<img src="" class="superbox-current-img"/>'),
			sbClose = $('<a href="#" class="superbox-close">&#215;</a>'),
			sbFloat = $('<div class="superbox-float"/>'),
			sbList = this.find('>div');

		sbShow.append(sbImg).append(sbClose).insertAfter(sbList);

		sbFloat.appendTo(this);

		this.addClass('superbox-active');

		if (settings.background !== null) {
			sbList
				.next()
					.css({
						'background-color': settings.background
					});
		}

		if (settings.border !== null) {
			sbList
				.next()
					.find('img.superbox-current-img')
						.css({
							'border-color': settings.border
						});
		}

		if (settings.xColor !== null) {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'color': settings.xColor
						});
		}

		if (settings.xShadow == 'emboss') {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'text-shadow': '0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(250,250,250,0.2)'
						});
		} else if (settings.xShadow == 'embed') {
			sbList
				.next()
					.find('a.superbox-close')
						.css({
							'text-shadow': '0 -1px 0 rgba(0,0,0,0.4), 0 1px 0 rgba(250,250,250,0.5)'
						});
		}

		sbList.each(function(){
			var imageData = $(this).find('img').data('img');

			$(this)
				.next()
					.find('img.superbox-current-img')
						.attr('src',imageData);

			$(this).on('click',function(){

				sbList
					.next('.superbox-O')
						.removeClass('superbox-O')
						.addClass('superbox-X')
						.find('img.superbox-current-img, div.superbox-close')
							.animate({opacity:0},100)
						.end()
							.slideUp();
				$(this)
					.next()
						.removeClass('superbox-X')
						.addClass('superbox-O')
						.slideDown(function(){
							$('html,body').animate({
									scrollTop: ($('.superbox-O').offset().top) - (($(window).height() - $('.superbox-O').height())/2)
							}, 'fast');
						})
						.find('img.superbox-current-img, div.superbox-close')
							.animate({opacity:1},1000);

			});

		});

		$('.superbox-close')
			.on('click',function(event){
				event.preventDefault();
				$(this).add($(this).siblings())
					.animate({opacity:0},100)
					.parent().slideUp();
			});

		return this;
	};
})(jQuery);
```

#### Browser support

I've tested SuperBox on all modern browsers, IE7, IE8, IE9 and IE10 and it works perfectly. The sizing is a little different in IE7 as by default the plugin is shipped with box-sizing:border-box; which changes the CSS box model for the better. Read up on it if you're unsure about box-sizing.

### Extending SuperBox

At the minute SuperBox is pretty flexible and a perfect platform to build upon. I do plan on updating it to include more features in the near future. Should you have ideas for future plugin additions, feel free to get involved and comment, fork or update it.