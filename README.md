

# David Sharff Demos
Note: this is an Nx workspace. Run each nx command below at the root of the project.

**IMPORTANT: server expects an out-of-source auth.json file containing a Mongo URI (I used Atlas).**

To run the server without Mongo, rollback before [PR#3](https://github.com/davidsharff/david-sharff-demos/pull/3).


## Chess as a Service

![Demo](https://github.com/davidsharff/david-sharff-demos/blob/main/chess.gif)

### Server
`npx nx serve caas-api`

### API Sandbox UI

`npx nx serve caas-demo`
