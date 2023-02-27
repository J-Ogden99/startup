# My Startup App - Study Buddy
Startup Project for CS 260 - Web Programming

## Specs
This app will eventually house several study helps that I am hoping to develop as part of my portfolio, but to start I
want to create a flashcard interface that makes it relatively simple to create flashcard sets, organize them, etc. The
main advantage I want to have over other flashcard software, however, is the ability to set review frequencies, with a
fibonacci sequence as the default, notifying you to review cards every 3, 5, 8, etc. days. They should be able to set
custom frequencies if they want as well, and set the maximum times a set should be reviewed.
Eventually I would also like to have a reader app that can take text and flash through words individually to enable the
user to speedread something (because theoretically we can increase our reading speed by seeing each word individually
flashed at a quick rate than if we were trying to look at it in the context of a page).

## Notes

- ssh -i [key pair file] ubuntu@recipefinder.click
- ./[name of deploy script] -k [key pair file] -h joshogden.click -s [subdomain]
- Caddy enables us to get free https certificates.
- If I pass a .sh script through a Windows editor, sometimes it will use the wrong endline character and bash won't
  work (it says "$/r" command not found.)
- check my css flex codepen for a basic outline for what my app could look like. Refer to there for a review of how flex
  works. Also remember vh and vw are view height and width.

- It's important to remember with flex that the flex-direction is talking about how the *elements* are arranged, not the
  content inside them, so with row, the elements will look like they are each a column, because they will be arranged
  *in a row*.

- I also need to remember that bootstrap handles color schemes really well, and I should enable dark and light mode by
  defining the theme in one place so I can toggle it.

- Refer here for an example theme: https://github.com/startbootstrap/startbootstrap-sb-admin-2

-  and bottom are a little tricky for header and footer because the body then tucks under them. I need to look
  into that. 

- a scrolling animation for a vertical carousel is possible by manipulating the position, opacity, and scale in css

- 