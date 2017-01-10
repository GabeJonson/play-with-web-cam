const video  = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx 	 = canvas.getContext('2d');
const strip  = document.querySelector('.strip');
const snap 	 = document.querySelector('.snap');

function getVideo() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(localMediaStream => {
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
		})
		.catch(err => {
			console.log(err)
		});
}

function paintToCanvas() {
	return setInterval(() => {
		ctx.drawImage(video, 0, 0, 800, 600);

		// take the pixels out
		let pixels = ctx.getImageData(0, 0, 800, 600);

		// mess with them
		// pixels = redEffect(pixels);

		// split pixels
		pixels = rgbSplit(pixels);
		// play with alpha
		ctx.globalAlpha = 0.6;

		// chroma effect
		// why this is dosn't work?!
		// pixels = greenScreen(pixels);

		// put theme back
		ctx.putImageData(pixels, 0, 0);
	}, 16);
}

function takePhoto() {
	snap.currentTime = 0;
	snap.play();

	const data = canvas.toDataURL('image/image');
	const link = document.createElement('a');

	link.href = data;
	link.setAttribute('download', 'handsome');
	link.innerHTML = `<img src="${data}" alt="handsome" />`;

	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
	for(let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; // r
		pixels.data[i + 1] = pixels.data[i + 1] - 50; // g
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // b
	}

	return pixels;
}

function rgbSplit(pixels) {
	for(let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0] + 100; // r
		pixels.data[i + 500] = pixels.data[i + 1] - 50; // g
		pixels.data[i - 600] = pixels.data[i + 2] * 0.5; // b
	}

	return pixels;
}

function greenScreen(pixels) {
	const levels = {};

	let inp = document.querySelectorAll('.rgb input');

	inp.forEach((input) => {
		levels[input.name] = input.value;
	});

	for(i = 0; i < pixels.data.length; i += 4) {
		red   = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue  = pixels.data[i + 2];
		alpha = pixels.data[i + 3];
	}

	if(
		red >= levels.rmin && green >= levels.gmin && blue >= bmin
		&& red <= levels.rmax && green <= gmax && blue <= bmax
		) {
		pixels.data[i + 3] = 0;
	}

	return pixels;
}

getVideo();

video.addEventListener('camplay', paintToCanvas());