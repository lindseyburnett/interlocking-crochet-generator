# Todo

## Bug Fixes
(none atm)


## Tools

### Must have
- Draw line
  - Start with a temporary Canvas and overlay a line
  - Line overlay rendered should only be completely horiz or completely vert
  - Once they mouseup, calculate the start and end of the overlay, and then loop through the row/col to draw it
    - If you can get the pixels, you can divide that by the square size setting to get squares
  - If possible, shift key down switches you to it, and shift key up takes you back to where you were
    - (Careful of bugs with letting go of shift while mouse is still down)
    - react-hotkeys should have a way to restrict hotkey to just keydown

### Nice to have
- Print
  - Format pattern to be underneath grid
- Export grid as image file
- Export pattern text to file


## Settings

### Must have
- Toggle for row/stitch counters

### Nice to have
- Lefty flip
  - Reverse directions for all rows?
  - Also need to reverse stitch numbers (the ones on the top/bottom)
  - Some misc string stuff that needs updating too, like "thread the chain through the far-right hole"
  - Add a message to the top of the pattern as a reminder


## Other Features

### Must have
- Warning for IE and older browsers
  - CSS vars are IE-incompatible, so this def won't work there
- Test other major browsers (especially Mac Safari)
- Styling for smaller resolutions (ideally should be at least usable on mobile, even if it's a little shitty)
- Make border thicker every 10 squares
  - Maybe use outline so it doesn't make the squares any wider?
- "About" modal with contact email for bug reports etc.

### Nice to have
- Collapse toggle for sidebar
- Collapse toggle for grid
- Visual polish on buttons (indicator for being clicked, etc.)
- Make grid position:sticky on desktop