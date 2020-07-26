# Todo

## Bug Fixes
(none atm)

## Pattern Display!
- Every other row is flipped, both LTR vs. RTL *and* front vs. back stitches

## Tools

### Must have
- Save/Load
- Undo/Redo
  - Keep record of grid states, similar to the tic-tac-toe project
  - Create a new entry on mouse *up*
  - Make sure to cap the number of entries in the history!
- Shift everything in any direction
  - Ex: when shifting right, grab the last column and copy it to the beginning

### Nice to have
- Print
  - Format pattern to be underneath grid
- Draw line
- Random
  - Just go through all the line squares and randomize their values
  - Add a confirmation dialog


## Settings

### Must have
(none atm)

### Nice to have
- Flip for working in the round
  - Might just be not flipping anything for the WS?
- Lefty flip
  - Reverse directions for all rows?


## Other Features

### Must have
- Warning for IE and older browsers
  - CSS vars are IE-incompatible, so this def won't work there
- Warning when leaving the page
- Proper site title and favicon
- Toolbar tooltips
- Styling for smaller resolutions (ideally should be at least usable on mobile, even if it's a little shitty)

### Nice to have
- Collapse toggle for sidebar
- Toolbar hotkeys
- "About" modal with contact email for bug reports etc.
- Refactor everything to use a 1D array for the grid if possible
  - Lets you avoid having to deep clone the grid every time you need to update, for better efficiency
  - Will likely need to pass numCols into most functions
  - Might be easier to think about certain things if you turn the 1D array into a 2D array temporarily, then collapse it back before returning
    - Although this might not be any more efficient than deep cloning...