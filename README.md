# Todo

## Bug Fixes
(none)


## Tools

### Must have
- Fill tool
  - If they click on a non-line square, find the closest one and start there instead
  - Recurse outwards in each of the cardinal directions, stopping at invalid, filled, or edge squares

### Nice to have
- Print
  - Format pattern to be underneath grid
- Export grid as image file
- Export pattern text to file
- Share as URL
  - Convert save string to base 64 as URL param
  - When the param is detected (probably when App is first mounted), pass it to the load handler


## Settings

### Must have
(none)

### Nice to have
(none)

## Other Features

### Must have
- Styling/functionality for smaller resolutions (ideally should be at least usable on mobile, even if it's a little shitty)
  - Test out all the tools
- "About" modal with contact email for bug reports etc.
- Add list of settings to exclude from saving, and instead store locally
  - Pretty much all the checkboxes?

### Nice to have
- Collapse toggle for sidebar
- Collapse toggle for grid
- Visual polish on buttons (indicator for being clicked, etc.)
- Make grid position:sticky on desktop
- Better cursor icon for line tool