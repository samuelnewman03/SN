/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

})(jQuery);


let startX;
let currentTab = 'tab1';  // Initialize currentTab to the ID of the initial tab

document.addEventListener('DOMContentLoaded', function() {
	// Set up click event listeners for tabs
	var tabButton1 = document.getElementById('tabButton1');
	if (tabButton1) {
		tabButton1.addEventListener('click', function() { switchTab('tab1', this); });
	}

	var tabButton2 = document.getElementById('tabButton2');
	if (tabButton2) {
		tabButton2.addEventListener('click', function() { switchTab('tab2', this); });
	}

	var tabButton3 = document.getElementById('tabButton3');
	if (tabButton3) {
		tabButton3.addEventListener('click', function() { switchTab('tab3', this); });
	}

	// Set up touch event listeners for swiping
	var tabArea = document.querySelector('.tab');
	if (tabArea) {
		tabArea.addEventListener('touchstart', handleTouchStart, false);
		tabArea.addEventListener('touchmove', handleTouchMove, false);
	}

	// Initialize the first tab
	openTab('tab1');
	highlightTab('tabButton1'); // Highlight the first tab
});

function openTab(newTabId) {
	var tabcontents = document.getElementsByClassName('main');

	// Fade out current tab content
	// for (var i = 0; i < tabcontents.length; i++) {
	// 	if (tabcontents[i].id === currentTab) {
	// 		tabcontents[i].classList.add('fadeOut');
	// 	}
	// }

	// Wait for fade-out to complete before displaying new tab
	// setTimeout(function() {
		for (var i = 0; i < tabcontents.length; i++) {
			tabcontents[i].style.display = 'none';
			tabcontents[i].classList.remove('fadeIn', 'fadeOut');
		}

		// Show the new tab with fade-in animation
		var tabcontent = document.getElementById(newTabId);
		tabcontent.style.display = 'block';
		tabcontent.classList.add('fadeIn');

		// Update the current tab
		currentTab = newTabId;
	// }, 500); // Duration of fade-out animation
}

function switchTab(newTabId, tabButton) {
	if (newTabId === currentTab) return;

	// Remove active class from all tab buttons
	var tabButtons = document.getElementsByClassName('tab-button');
	for (var i = 0; i < tabButtons.length; i++) {
		tabButtons[i].classList.remove('active');
	}

	// Add active class to the clicked tab button
	tabButton.classList.add('active');

	openTab(newTabId);
}

function highlightTab(tabButtonId) {
	// Remove active class from all tab buttons
	var tabButtons = document.getElementsByClassName('tab-button');
	for (var i = 0; i < tabButtons.length; i++) {
		tabButtons[i].classList.remove('active');
	}

	// Add active class to the specified tab button
	document.getElementById(tabButtonId).classList.add('active');
}

function handleTouchStart(evt) {
	startX = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
	if (!startX) {
		return;
	}

	let endX = evt.touches[0].clientX;
	let diffX = startX - endX;

	if (diffX > 50) {
		// Swipe left
		swipeToNextTab('left');
	} else if (diffX < -50) {
		// Swipe right
		swipeToNextTab('right');
	}
}

function swipeToNextTab(direction) {
	const order = ['tab1', 'tab2', 'tab3'];
	let currentIndex = order.indexOf(currentTab);
	let newIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1;

	// Boundaries check
	if (newIndex >= 0 && newIndex < order.length) {
		let nextTabId = order[newIndex];
		let nextTabElement = document.getElementById('tabButton' + (newIndex + 1));
		switchTab(nextTabId, nextTabElement);
	}
}

