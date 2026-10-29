# HTML5 Canvas Drawing App with Undo/Redo

A crayon / marker / eraser drawing app on an HTML5 canvas. Every drawing action is a command object, so strokes and "Clear" can be undone and redone. See `undo.docx` for the design write-up.

Based on William Malone's tutorial: <http://wmalone.com/draw> (Apache License 2.0, see `LICENSE`).

## Setup and launch

There is nothing to install or build; the app is plain HTML, CSS and JavaScript.

**Option 1 (simplest):** open `html5-canvas-drawing-app.html` in a browser (double-click it, or use File > Open).

**Option 2 (local server):** from this folder run

```
python3 -m http.server 8000
```

then visit <http://localhost:8000/html5-canvas-drawing-app.html>.

## Using the app

- Pick a colour (left), a tool (right: crayon, marker, eraser) and a size (ruler, bottom right), then press and drag inside the drawing area.
- **Undo / Redo / Clear** buttons sit under the canvas. Shortcuts: `Ctrl+Z` undo, `Ctrl+Y` or `Ctrl+Shift+Z` redo (`Cmd` instead of `Ctrl` on a Mac).
- The **Command history** list shows every command in order. Undone commands stay in the list, greyed out and struck through, until a new action discards them.
- Buttons are disabled when there is nothing to undo, redo or clear.

## Browser support

Needs a browser with HTML5 canvas and `KeyboardEvent.key`: current versions of Chrome, Edge, Firefox and Safari. The undo/redo features were checked in Chromium with an automated browser script (strokes, eraser, undo, redo, clear, and discarding redo history after a new stroke). Other browsers were not tested here. Internet Explorer 8 and older is not supported for the new features; the starter's `excanvas.js` fallback is kept but unchanged.

## Changes to the starter code

Starter: the tutorial's canvas app that drew crayon/marker/eraser strokes.

- **Command objects.** Each stroke (`createStrokeCommand`) and Clear (`createClearCommand`) is an object with `execute()`, `undo()` and a `name`.
- **History.** Added `undoStack` and `redoStack`, with `runCommand()`, `undo()` and `redo()`. A new command after an undo clears the redo stack.
- **Stroke data.** Each stroke stores its own tool, colour, size and points, so a replay looks the same even after the tool or colour changes. `redraw()` now rebuilds the canvas by replaying the `drawing` list.
- **Eraser.** Eraser strokes are normal commands, replayed in white and clipped to the drawing area.
- **Drawing area only.** Only presses inside the drawing area start a stroke; clicks on the colour, tool and size panels change settings but add no command.
- **UI.** `html5-canvas-drawing-app.html` gained the Undo, Redo and Clear buttons and the Command history list; `updateHistoryUI()` keeps the list and button states in sync.
- **Keyboard shortcuts** for undo and redo.
