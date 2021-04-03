// console.log('kuku');
$('.slick__slider').slick({
	slidesToScroll: 1,
	autoplay: false,
	dots: false,
	infinite: true,
	autoplaySpeed: 3000,
	slidesToShow: 1,
	centerMode: true,
	centerPadding: '28%',
	responsive: [
		{
			breakpoint: 1130,
			settings: {
				arrows: true,
				// centerMode: true,
				centerPadding: '10%',
				slidesToShow: 1
			}
		},
		{
			breakpoint: 768,
			settings: {
				arrows: true,
				centerMode: true,
				centerPadding: '10px',
				slidesToShow: 1
			}
		}
	]
});

