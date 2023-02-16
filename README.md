# Cardle

A [wordle](https://www.nytimes.com/games/wordle/index.html) and [worldle](https://worldle.teuteuf.fr/) inspired game where users try and guess the automobile manufacturer.

Built using Vanilla JS and CSS.

## use

- can be used here: [project-not-hosted-yet](#)

- otherwise feel free to \
   `git clone https://github.com/0xcire/new_cardle.git cardle` \
   `cd cardle` \
   `npm install` \
   `npm run dev`

### remarks

- searched and could not find an api that would be useful here,
  - will create my own
- using this project to solidify some vanilla skills before diving into React, Vue, Qwik... wherever my curiosity takes me
- Future plans are below so this serves more as a scaffold for a more complete package down the line.
  - Still serves as a replayable game in its current state

### future plans

- remake in react!
  - this will also clean up some implementations I am "hacking" around
    - mainly startup load, will make sense in future when I am actually loading potential user data and etc
- create custom api as currently none exist to serve my needs here
- add backend (firebase?) to keep track of user data like score, win streak, etc
- use opencage instead of using openweather's deprecated geocoding api
- map to visualize guesses although this might make it too easy
