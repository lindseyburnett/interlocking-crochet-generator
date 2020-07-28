# Todo

## Bug Fixes
(none atm)

## Pattern Display!
- Every other row is flipped, both LTR vs. RTL *and* front vs. back stitches

## Tools

### Must have
(none atm)

### Nice to have
- Print
  - Format pattern to be underneath grid
- Draw line
  - Start with a temporary Canvas and overlay a line
  - Line overlay rendered should only be completely horiz or completely vert
  - Once they mouseup, calculate the start and end of the overlay, and then loop through the row/col to draw it
    - If you can get the pixels, you can divide that by the square size setting to get squares
- Random
  - Just go through all the line squares and randomize their values
  - Add a confirmation dialog


## Settings

### Must have
- Toggle for row/stitch counters

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
- Toolbar tooltips
- Test other major browsers (especially Mac Safari)
- Styling for smaller resolutions (ideally should be at least usable on mobile, even if it's a little shitty)

### Nice to have
- Collapse toggle for sidebar
- Toolbar hotkeys
  - If you can get the line tool working, shift key down switches you to it, and shift key up takes you back to where you were
  - (Careful of bugs with letting go of shift while mouse is still down)
- "About" modal with contact email for bug reports etc.
- Refactor everything to use a 1D array for the grid if possible
  - Lets you avoid having to deep clone the grid every time you need to update, for better efficiency
  - Will likely need to pass numCols into most functions
  - Might be easier to think about certain things if you turn the 1D array into a 2D array temporarily, then collapse it back before returning
    - Although this might not be any more efficient than deep cloning...