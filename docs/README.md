# Tactical Warfare

## Overview
2 player turn-based 3D tank game with realistic physics. Each tank spawns with 100hp. Every turn, a player may choose to either move a tank to an adjacent field or fire a projectile. Tank takes damage if hit by a projectile. Game is over when either tank runs out of health.

## Functionality and MVP
#### User Auth
- [ ] User can register for an account
- [ ] User can sign in and sign out
- [ ] User stays signed in if same browser window

#### UI
- [ ] Splash Page (overlay)
- [ ] Register Form (overlay)
- [ ] Sign In Form (overlay)
- [ ] Nav Bar with Register / Sign In / Sign Out button (overlay)

#### Game
- [ ] Demo mode (1 player shooting at a wall of blocks)
- [ ] Two Player functionality (WebSockets)
- [ ] User is assigned a randomly generated name when not signed in
- [ ] Projectile firing functionality and animation
- [ ] Health loss functionality and animation
- [ ] Tank movement functionality and animation
- [ ] Winning functionality/condition and notification

## Technologies
#### Database:
* MongoDB

#### Back End:
* Node.js
* Express.js
* Socket.io (WebSockets)

#### Front End:
* Babylon.js
* Cannon.js

## Things Accomplished Over the Weekend
- [x] Learn Node.js
- [x] Learn MongoDB
- [x] Learn Mongoose
- [x] Learn Express.js
- [ ] Learn Socket.io
- [ ] Learn cannon.js
- [x] Work on Proposal

## Group Members and Work Breakdown
#### Khai Bui:
* Some of back end
* WebSockets (Socket.io)
* UI and styling on front end
* Some of game behavior on front end
* Some of game animation on the front end

#### Adan Marrufo:
* Most of front end
* 3D objects and 3D object rendering
* Physics engine
* Most of game behavior on front end
* Most of game animation on the front end

#### Michael Zhu:
* Most back end
* User auth
* API routing
* Some websockets

## Individual day by day break down

||Khai Bui|Adan Marrufo|Michael Zhu|
|-|-|-|-|
|__Saturday__|Learn Node.js, Express.js, MongoDB|Make 3D models, learn cannon.js, learn babylon.js|Learn Node.js, Express.js, MongoDB|
|__Sunday__|Build basic Express.app, establish git workflow, write proposal, and set up Socket.io|Build basic Express.app, establish git workflow, make wireframes, set up babylon.js and cannon.js|Build basic Express.app, establish git workflow, and set up MongoDB, Mongoose|
|__Monday__|Learn babylon.js, set up babsic UI for game and auth|Work on tank movement interaction/animation|Set up auth (front end and back end)|
|__Tuesday__|Help Adan|Work on tank attack interaction/animation|Polish and debug auth (front end and back end)|
|__Wednesday__|Integrate Socket.io|Integrate Socket.io|Integrate Socket.io|
|__Thursday__|Work on Socket.io health, coordinate, and firing trajectory sync|Polish tank attack and movement interaction/animation|Work on backend models and controllers/routing to store tank movement coordinate, health, etc|
|__Friday__|Integrate turn-based game logic with Socket.io|Work on Tank health loss interaction and animation|Continue to work on backend models and controllers/routing to store tank coordinate, health, etc|
|__Saturday__|Debug, test, polish|Debug, test, polish|Debug, test, polish|
|__Saturday__|Debug, test, polish|Debug, test, polish|Debug, test, polish|

## Plan for getting users and reviews
* Casually challenge friends, family, and recruiters to play a tank game
* Make facebook group
* Make youtube Demo video

## Back up plan
1 player target practice game (with a tank)
