const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// TODO
const bodyParser = require('body-parser');
const users = [];
const exercises = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/users", (req, res) => {
  let userIndex = null;
  for (let index in users) {
    if (users[index].username == req.body.username) {
      userIndex = index;
    }
  }

  let user = {
    username: '',
    _id: 0
  }
  if (userIndex == null) {
    user.username = req.body.username;
    user._id =  (users.length + 1).toString();
    users.push(user);
    res.json(user);
  } else {
    res.json(users[userIndex]);
  }
});


app.get("/api/users", (req, res) => {
  res.json(users);
})


app.post("/api/users/:_id/exercises", (req, res) => {
  const inputDescription = req.body.description;
  const inputDuration = parseInt(req.body.duration);
  const id = req.params._id;
  let inputDate;
  
  if (req.body.date) {
    inputDate = new Date(req.body.date).toDateString();
  } else {
    inputDate = new Date().toDateString();
  }

  let exercise = {
    username: users[parseInt(id) - 1].username,
    description: inputDescription,
    duration: inputDuration,
    date: inputDate,
    _id: req.params._id
  }
  exercises.push(exercise);
  res.json(exercise);  
})


app.get("/api/users/:_id/logs", (req, res) => {
  let log = [];
  let logWind = [];
  let count = 0;
  let from;
  if (req.query.from) {
    from = new Date(req.query.from);
  };
  let to;
  if (req.query.to) {
    to = new Date(req.query.to);
  };
  

  
  for (let index in exercises) {
    if (exercises[index]._id == req.params._id) {
      // if (from && to) {
      //   let dateCheck = new Date(exercises[index].date);
      //   if (dateCheck.getTime() >= from.getTime() && dateCheck.getTime() <= to.getTime()) {
      //     logWind.push({
      //       description: exercises[index].description,
      //       duration: exercises[index].duration,
      //       date: exercises[index].date
      //     });
      //   };
      // };
      
      log.push({
        description: exercises[index].description,
        duration: exercises[index].duration,
        date: exercises[index].date
      });
      count++;
    };
  };
  let limit = req.query.limit ? parseInt(req.query.limit) : count;
  res.json({
    username: users[parseInt(req.params._id) - 1].username,
    count: count,
    _id: req.params._id,
    // log: (from && to) ? logWind.slice(0, limit) : log.slice(0, limit)
    log: log.slice(0, limit)
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
