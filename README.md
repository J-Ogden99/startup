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

### UX Plan
- When the user enters the app, they will need to log in so they can access their cards stored in the database. After
  that, they will see the home page which displays the most recently created cards, cards up for review, and a direct
  link to start filling out new cards for today.
- When they enter the "create" page, they are greeted with a the card creation module on the left that includes a blank
  where they can enter both sides of the card (potentially add pictures to the template later), and on the left is the
  vertically scrolling carousel showing all the previously created sets. There should also be a "plus" button at the top
  of the carousel allowing them to create a new set, and then a save button on the card being created that brings up the 
  modal where they choose which set to save to, or create a new set. When they click edit on a set, the main screen also
  becomes a carousel (probably hides the card creation and reveals the carousel which is filled with the cards in the 
  set.
  - When the sets carousel dissapears for profile orientation, instead have a button that brings up the sets modal,
    from which they can select sets to edit.
- The most important thing to focus on first is the learning page which has a shuffle button, and displays cards one
  after the other. They click reveal, then they click whether they got it or not. Eventually there should be a grading
  system on their mastery of a set and of individual cards, but for now I'll just have them click next. This page will
  be distinct from review in that it will be where they look at cards they haven't seen before, which then get put in
  in the review circuit.
- The review page is where they choose sets to review from, and are served the cards that have been through "learn" that
  are due to be reviewed. To avoid them piling up, I may want to have it only track days that they log in for the review
  frequency, so if they leave for a week they don't have a week's worth. There should also be a "review all" button to
  serve up all the cards in rotation. In learn there will also be a "view all" for a set where they can view the cards
  on a carousel.
  - I'm thinking the default should actually be to serve up all cards that need reviewing, and let them filter by set if
    they want.
  - The review frequency sidebar could just be for show right now, maybe move to creation? Well, they need to be able to
    see where a given card is in the cycle.

### Javascript Notes
- the carousel functionality needs to be some kind of packaged element or class that can be reused, as does the card,
  obviously.
- The card class will include some information to be stored in the database, including its current place in the review
  cycle (which will have a special value if it hasn't been learned yet). And the date that it was created.
- I need to implement a clock which will keep track of the date, and some way to keep track of how many days they've
  visited the app so the appropriate review cards can be served up.
- To start, there just needs to be a way to store the cards, serve them up, and the carousel needs to be implemented.

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

- and bottom are a little tricky for header and footer because the body then tucks under them. I need to look
  into that.

- a scrolling animation for a vertical carousel is possible by manipulating the position, opacity, and scale in css

- reduce() on a JavaScript array applies a function to the whole array to reduce it to a single value, like sum or
  average for example.

- objects can have functions as a value, which can be called like a member function of a class, but a class would be
  used for something that's going to be reused a lot, whereas an object that has functions would be more of a one-off
  thing because it's easier to define key-value pairs than to set member variables in a class constructor (although
  objects can have a constructor too.

- for the Simon Javascript assignment, I decided to stretch myself by adding functionality to map certain keys to each
  button, because using my trackpad was getting annoying, so I had to learn about the "keydown" event, which has a 
  "code" attribute that allows a conditional to be made that triggers certain events based on keys, which can be mapped
  in an Object.
  
- I should also refer back to the simon code to learn how to work with Audio files in JavaScript

- npm init -y

- npm install [package]

- app.use(express.json());

- const something = express.router();

- something.get('url', (_req, res) => {})

- mongodb uses JSON objects as entries in the database

- I need to restart pm2 whenever I update environment variables in the production environment:
  -pm2 restart all --update-env
  -pm2 save
