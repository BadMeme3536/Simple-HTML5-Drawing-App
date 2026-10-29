// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*jslint browser: true */
/*global G_vmlCanvasManager */

var drawingApp = (function () {

	"use strict";

	var canvas,
		context,
		canvasWidth = 490,
		canvasHeight = 220,
		colorPurple = "#cb3594",
		colorGreen = "#659b41",
		colorYellow = "#ffcf33",
		colorBrown = "#986928",
		outlineImage = new Image(),
		crayonImage = new Image(),
		markerImage = new Image(),
		eraserImage = new Image(),
		crayonBackgroundImage = new Image(),
		markerBackgroundImage = new Image(),
		eraserBackgroundImage = new Image(),
		crayonTextureImage = new Image(),
		drawing = [],        // stroke commands currently shown on the canvas
		currentStroke = null, // the stroke being drawn right now, or null
		undoStack = [],      // commands that have been executed, oldest first
		redoStack = [],      // commands that were undone, most recently undone last
		paint = false,
		curColor = colorPurple,
		curTool = "crayon",
		curSize = "normal",
		mediumStartX = 18,
		mediumStartY = 19,
		mediumImageWidth = 93,
		mediumImageHeight = 46,
		drawingAreaX = 111,
		drawingAreaY = 11,
		drawingAreaWidth = 267,
		drawingAreaHeight = 200,
		toolHotspotStartY = 23,
		toolHotspotHeight = 38,
		sizeHotspotStartY = 157,
		sizeHotspotHeight = 36,
		totalLoadResources = 8,
		curLoadResNum = 0,
		sizeHotspotWidthObject = {
			huge: 39,
			large: 25,
			normal: 18,
			small: 16
		},

		// Clears the canvas.
		clearCanvas = function () {

			context.clearRect(0, 0, canvasWidth, canvasHeight);
		},

		// Redraws the canvas.
		redraw = function () {

			var locX,
				locY,
				radius,
				i,
				selected,
				stroke,
				j,

				drawCrayon = function (x, y, color, selected) {

					context.beginPath();
					context.moveTo(x + 41, y + 11);
					context.lineTo(x + 41, y + 35);
					context.lineTo(x + 29, y + 35);
					context.lineTo(x + 29, y + 33);
					context.lineTo(x + 11, y + 27);
					context.lineTo(x + 11, y + 19);
					context.lineTo(x + 29, y + 13);
					context.lineTo(x + 29, y + 11);
					context.lineTo(x + 41, y + 11);
					context.closePath();
					context.fillStyle = color;
					context.fill();

					if (selected) {
						context.drawImage(crayonImage, x, y, mediumImageWidth, mediumImageHeight);
					} else {
						context.drawImage(crayonImage, 0, 0, 59, mediumImageHeight, x, y, 59, mediumImageHeight);
					}
				},

				drawMarker = function (x, y, color, selected) {

					context.beginPath();
					context.moveTo(x + 10, y + 24);
					context.lineTo(x + 10, y + 24);
					context.lineTo(x + 22, y + 16);
					context.lineTo(x + 22, y + 31);
					context.closePath();
					context.fillStyle = color;
					context.fill();

					if (selected) {
						context.drawImage(markerImage, x, y, mediumImageWidth, mediumImageHeight);
					} else {
						context.drawImage(markerImage, 0, 0, 59, mediumImageHeight, x, y, 59, mediumImageHeight);
					}
				};

			// Make sure required resources are loaded before redrawing
			if (curLoadResNum < totalLoadResources) {
				return;
			}

			clearCanvas();

			if (curTool === "crayon") {

				// Draw the crayon tool background
				context.drawImage(crayonBackgroundImage, 0, 0, canvasWidth, canvasHeight);

				// Draw purple crayon
				selected = (curColor === colorPurple);
				locX = selected ? 18 : 52;
				locY = 19;
				drawCrayon(locX, locY, colorPurple, selected);

				// Draw green crayon
				selected = (curColor === colorGreen);
				locX = selected ? 18 : 52;
				locY += 46;
				drawCrayon(locX, locY, colorGreen, selected);

				// Draw yellow crayon
				selected = (curColor === colorYellow);
				locX = selected ? 18 : 52;
				locY += 46;
				drawCrayon(locX, locY, colorYellow, selected);

				// Draw brown crayon
				selected = (curColor === colorBrown);
				locX = selected ? 18 : 52;
				locY += 46;
				drawCrayon(locX, locY, colorBrown, selected);

			} else if (curTool === "marker") {

				// Draw the marker tool background
				context.drawImage(markerBackgroundImage, 0, 0, canvasWidth, canvasHeight);

				// Draw purple marker
				selected = (curColor === colorPurple);
				locX = selected ? 18 : 52;
				locY = 19;
				drawMarker(locX, locY, colorPurple, selected);

				// Draw green marker
				selected = (curColor === colorGreen);
				locX = selected ? 18 : 52;
				locY += 46;
				drawMarker(locX, locY, colorGreen, selected);

				// Draw yellow marker
				selected = (curColor === colorYellow);
				locX = selected ? 18 : 52;
				locY += 46;
				drawMarker(locX, locY, colorYellow, selected);

				// Draw brown marker
				selected = (curColor === colorBrown);
				locX = selected ? 18 : 52;
				locY += 46;
				drawMarker(locX, locY, colorBrown, selected);

			} else if (curTool === "eraser") {

				context.drawImage(eraserBackgroundImage, 0, 0, canvasWidth, canvasHeight);
				context.drawImage(eraserImage, 18, 19, mediumImageWidth, mediumImageHeight);
			}

			// Draw line on ruler to indicate size
			switch (curSize) {
			case "small":
				locX = 467;
				break;
			case "normal":
				locX = 450;
				break;
			case "large":
				locX = 428;
				break;
			case "huge":
				locX = 399;
				break;
			default:
				break;
			}
			locY = 189;
			context.beginPath();
			context.rect(locX, locY, 2, 12);
			context.closePath();
			context.fillStyle = '#333333';
			context.fill();

			// Keep the drawing in the drawing area
			context.save();
			context.beginPath();
			context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
			context.clip();

			// For each stroke command, replay it using the tool, color and size it was drawn with
			for (i = 0; i < drawing.length; i += 1) {
				stroke = drawing[i];

				// Set the drawing radius
				switch (stroke.size) {
				case "small":
					radius = 2;
					break;
				case "normal":
					radius = 5;
					break;
				case "large":
					radius = 10;
					break;
				case "huge":
					radius = 20;
					break;
				default:
					break;
				}

				// Set the drawing color
				if (stroke.tool === "eraser") {
					context.strokeStyle = 'white';
				} else {
					context.strokeStyle = stroke.color;
				}
				context.lineCap = "round";
				context.lineJoin = "round";
				context.lineWidth = radius;

				// For each point in this stroke
				for (j = 0; j < stroke.points.length; j += 1) {
					context.beginPath();
					if (j > 0) {
						// Connect this point to the previous point in the same stroke
						context.moveTo(stroke.points[j - 1].x, stroke.points[j - 1].y);
					} else {
						// The first point of a stroke has no previous point, so offset by
						// one pixel to draw a dot
						context.moveTo(stroke.points[j].x - 1, stroke.points[j].y);
					}
					context.lineTo(stroke.points[j].x, stroke.points[j].y);
					context.stroke();
				}
			}

			context.closePath();
			//context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
			context.restore();

			// Overlay a crayon texture (if the current tool is crayon)
			if (curTool === "crayon") {
				context.globalAlpha = 0.4; // No IE support
				context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);
			}
			context.globalAlpha = 1; // No IE support

			// Draw the outline image
			context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
		},

		// Creates a command for one stroke (press -> drag -> release).
		// The tool, color and size are captured once, so the stroke replays
		// the same way even after the user switches to other settings.
		createStrokeCommand = function (tool, color, size) {
			return {
				tool: tool,
				color: color,
				size: size,
				name: tool + " stroke (" + size + ")",
				points: [],

				// Executing a stroke adds it to the list of visible strokes
				execute: function () {
					drawing.push(this);
				},

				// Reversing a stroke removes it from the visible strokes.
				// Commands are undone in reverse order, so it is always the last one.
				undo: function () {
					drawing.pop();
				}
			};
		},

		// Creates a command that clears the canvas.
		// It keeps the strokes it removed so that undo can restore them.
		createClearCommand = function () {
			return {
				name: "Clear",
				removedStrokes: [],

				// Move every visible stroke into this command, leaving the canvas empty.
				// splice(0) empties the array and returns what it removed.
				execute: function () {
					this.removedStrokes = drawing.splice(0);
				},

				// Put the removed strokes back in their original order.
				// Every command after this clear has already been undone, so the drawing is empty here.
				undo: function () {
					var i;
					for (i = 0; i < this.removedStrokes.length; i += 1) {
						drawing.push(this.removedStrokes[i]);
					}
				}
			};
		},

		// Rebuilds the command history list and enables only the controls that can be used.
		updateHistoryUI = function () {
			var historyList = document.getElementById("historyList"),
				item,
				i;

			historyList.innerHTML = "";

			// Active commands, oldest first
			for (i = 0; i < undoStack.length; i += 1) {
				item = document.createElement("li");
				item.textContent = undoStack[i].name;
				historyList.appendChild(item);
			}

			// Undone commands, shown greyed out in the order redo would restore them.
			// The end of redoStack is the next command to redo, so walk it backwards.
			for (i = redoStack.length - 1; i >= 0; i -= 1) {
				item = document.createElement("li");
				item.textContent = redoStack[i].name + " (undone)";
				item.className = "undone";
				historyList.appendChild(item);
			}

			// Disable a control when there is nothing for it to act on
			document.getElementById("undoButton").disabled = (undoStack.length === 0);
			document.getElementById("redoButton").disabled = (redoStack.length === 0);
			document.getElementById("clearButton").disabled = (drawing.length === 0);
		},

		// Runs a brand-new command and records it in the history.
		// A new command starts a new editing branch, so the redo history is discarded.
		runCommand = function (command) {
			command.execute();
			undoStack.push(command);
			redoStack = [];
			updateHistoryUI();
			redraw();
		},

		// Re-executes the most recently undone command and moves it back onto the undo stack
		redo = function () {
			if (redoStack.length > 0) {
				var command = redoStack.pop();
				command.execute();
				undoStack.push(command);
				updateHistoryUI();
				redraw();
			}
		},

		// Reverses the most recent command and keeps it so redo can restore it
		undo = function () {
			if (undoStack.length > 0) {
				var command = undoStack.pop();
				command.undo();
				redoStack.push(command);
				updateHistoryUI();
				redraw();
			}
		},

		// Clears the drawing as an undoable command.
		clearDrawing = function () {
			if (drawing.length > 0) {
				runCommand(createClearCommand());
			}
		},

		// Add mouse and touch event listeners to the canvas
		createUserEvents = function () {

			var press = function (e) {
				// Mouse down location
				var sizeHotspotStartX,
					mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

				if (mouseX < drawingAreaX) { // Left of the drawing area
					if (mouseX > mediumStartX) {
						if (mouseY > mediumStartY && mouseY < mediumStartY + mediumImageHeight) {
							curColor = colorPurple;
						} else if (mouseY > mediumStartY + mediumImageHeight && mouseY < mediumStartY + mediumImageHeight * 2) {
							curColor = colorGreen;
						} else if (mouseY > mediumStartY + mediumImageHeight * 2 && mouseY < mediumStartY + mediumImageHeight * 3) {
							curColor = colorYellow;
						} else if (mouseY > mediumStartY + mediumImageHeight * 3 && mouseY < mediumStartY + mediumImageHeight * 4) {
							curColor = colorBrown;
						}
					}
				} else if (mouseX > drawingAreaX + drawingAreaWidth) { // Right of the drawing area

					if (mouseY > toolHotspotStartY) {
						if (mouseY > sizeHotspotStartY) {
							sizeHotspotStartX = drawingAreaX + drawingAreaWidth;
							if (mouseY < sizeHotspotStartY + sizeHotspotHeight && mouseX > sizeHotspotStartX) {
								if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.huge) {
									curSize = "huge";
								} else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
									curSize = "large";
								} else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
									curSize = "normal";
								} else if (mouseX < sizeHotspotStartX + sizeHotspotWidthObject.small + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge) {
									curSize = "small";
								}
							}
						} else {
							if (mouseY < toolHotspotStartY + toolHotspotHeight) {
								curTool = "crayon";
							} else if (mouseY < toolHotspotStartY + toolHotspotHeight * 2) {
								curTool = "marker";
							} else if (mouseY < toolHotspotStartY + toolHotspotHeight * 3) {
								curTool = "eraser";
							}
						}
					}
				}
				// Only clicks inside the drawing area start a stroke;
				// clicks on the color, tool and size panels are not commands.
				if (mouseX > drawingAreaX && mouseX < drawingAreaX + drawingAreaWidth &&
						mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight) {
					currentStroke = createStrokeCommand(curTool, curColor, curSize);
					currentStroke.points.push({x: mouseX, y: mouseY});
					runCommand(currentStroke);
					paint = true;
				}
				redraw();
			},

			drag = function (e) {
				
				var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
					mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
				
				if (paint) {
					currentStroke.points.push({x: mouseX, y: mouseY});
					redraw();
				}
				// Prevent the whole page from dragging if on mobile
				e.preventDefault();
			},

			release = function () {
				paint = false;
				currentStroke = null;
				redraw();
			},

			cancel = function () {
				paint = false;
				currentStroke = null;
			};

			// Add mouse event listeners to canvas element
			canvas.addEventListener("mousedown", press, false);
			canvas.addEventListener("mousemove", drag, false);
			canvas.addEventListener("mouseup", release);
			canvas.addEventListener("mouseout", cancel, false);

			// Add touch event listeners to canvas element
			canvas.addEventListener("touchstart", press, false);
			canvas.addEventListener("touchmove", drag, false);
			canvas.addEventListener("touchend", release, false);
			canvas.addEventListener("touchcancel", cancel, false);

			// Undo, redo and clear controls
			document.getElementById("undoButton").addEventListener("click", undo, false);
			document.getElementById("redoButton").addEventListener("click", redo, false);
			document.getElementById("clearButton").addEventListener("click", clearDrawing, false);

			// Keyboard shortcuts: Ctrl+Z = undo, Ctrl+Y or Ctrl+Shift+Z = redo (Cmd on a Mac)
			document.addEventListener("keydown", function (e) {
				var key = e.key.toLowerCase();

				if (!(e.ctrlKey || e.metaKey)) {
					return;
				}
				if (key === "z" && !e.shiftKey) {
					undo();
					e.preventDefault();
				} else if (key === "y" || (key === "z" && e.shiftKey)) {
					redo();
					e.preventDefault();
				}
			}, false);
		},

		// Calls the redraw function after all neccessary resources are loaded.
		resourceLoaded = function () {

			curLoadResNum += 1;
			if (curLoadResNum === totalLoadResources) {
				redraw();
				createUserEvents();
			}
		},

		// Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
		init = function () {

			// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
			canvas = document.createElement('canvas');
			canvas.setAttribute('width', canvasWidth);
			canvas.setAttribute('height', canvasHeight);
			canvas.setAttribute('id', 'canvas');
			document.getElementById('canvasDiv').appendChild(canvas);
			if (typeof G_vmlCanvasManager !== "undefined") {
				canvas = G_vmlCanvasManager.initElement(canvas);
			}
			context = canvas.getContext("2d"); // Grab the 2d canvas context
			// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
			//     context = document.getElementById('canvas').getContext("2d");

			// Load images
			crayonImage.onload = resourceLoaded;
			crayonImage.src = "images/crayon-outline.png";

			markerImage.onload = resourceLoaded;
			markerImage.src = "images/marker-outline.png";

			eraserImage.onload = resourceLoaded;
			eraserImage.src = "images/eraser-outline.png";

			crayonBackgroundImage.onload = resourceLoaded;
			crayonBackgroundImage.src = "images/crayon-background.png";

			markerBackgroundImage.onload = resourceLoaded;
			markerBackgroundImage.src = "images/marker-background.png";

			eraserBackgroundImage.onload = resourceLoaded;
			eraserBackgroundImage.src = "images/eraser-background.png";

			crayonTextureImage.onload = resourceLoaded;
			crayonTextureImage.src = "images/crayon-texture.png";

			outlineImage.onload = resourceLoaded;
			outlineImage.src = "images/watermelon-duck-outline.png";
		};

	return {
		init: init
	};
}());