//Everything related to the the camera like zooming and translation

function zoom(factor, event) {
	const canvas = global_canvases[0]; 
	const rect = canvas.getBoundingClientRect();
	const [mouseX, mouseY] = [event.clientX - rect.left, event.clientY - rect.top];

	const previous_zoom_factor = global_zoom_factor;
	global_zoom_factor += factor;

	// Prevent zooming too far out or too far in by setting bounds
    global_zoom_factor = Math.max(0.1, Math.min(global_zoom_factor, 10)); // Zoom bounds

    const scaleFactor = global_zoom_factor / previous_zoom_factor;

    // Prevent negative scale
    if (scaleFactor <= 0) return;

	for (let c of global_canvases) {
		let ctx = c.getContext("2d");
		ctx.translate(mouseX, mouseY);
		ctx.scale(scaleFactor, scaleFactor);
		ctx.translate(-mouseX, -mouseY);
	}

	redrawEntireCanvas();
}

function translateCanvas(pos,relative=false) {
	let [x,y] = pos
	if (relative) {
		for (c of global_canvases) {
			const ctx = c.getContext("2d")
			ctx.translate(x, y);
		}
	} else {
		for (c of global_canvases) {
			const ctx = c.getContext("2d")
			const currentTransform = ctx.getTransform();
			const dx = x - currentTransform.e;
			const dy = y - currentTransform.f;
			ctx.translate(dx, dy);
		}
	}
	redrawEntireCanvas()
}

function resetCamera() {
    for (let c of global_canvases) {
        const ctx = c.getContext("2d")
        ctx.resetTransform()
    }
	global_zoom_factor = 1
    redrawEntireCanvas()
}

function getScalor() {
	const ctx = canvas.getContext("2d")
	const currentTransform = ctx.getTransform();
	return [currentTransform.a, currentTransform.d]
}
