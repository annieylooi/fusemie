function pageTransition() {
	var tl = gsap.timeline();

	tl.to(".transition li", {
		duration: 0.5,
		scaleY: 1,
		transformOrigin: "bottom left",
		stagger: 0.2,
	});

	tl.to(".transition li", {
		duration: 0.5,
		scaleY: 0,
		transformOrigin: "bottom left",
		stagger: 0.1,
		delay: 0.1,
	});
}

function contentAnimation() {
	var tl = gsap.timeline();

	tl.fromTo("img.animate", {
		clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0)",
	}, 
	{
		clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
	},"0.5");

	tl.from(".move-up", {
		duration: 1.5,
		translateY: 50,
		opacity: 0,
	});
}

function delay(n) {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n);
	});
}

barba.init({
	sync: true,

	transitions: [
		{
			async leave(data) {
				const done = this.async();

				pageTransition();
				await delay(1500);
				done();
			},

			async enter(data) {
				contentAnimation();
			},

			async once(data) {
				contentAnimation();
			},
		},
	],
});