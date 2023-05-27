const express = require('express');
const app = express();
app.use(express.json());

let events = [
  { id: 1, title: 'My family', date: '2023-05-10' },
  { id: 2, title: 'Good health', date: '2023-04-10' },
  { id: 3, title: 'Healthy food', date: '2023-04-15' },
  { id: 4, title: 'Dogs', date: '2023-04-23' },
  { id: 5, title: 'Cats', date: '2023-04-30' },
  { id: 6, title: 'Medicine', date: '2023-04-30' },
  { id: 7, title: 'Therapy', date: '2023-05-20' },
  { id: 8, title: 'Music', date: '2023-05-30'},
  { id: 9, title: 'Arts and Crafts', date: '2023-05-08' },
  { id: 10 ,title: 'Sense of sight', date: '2023-05-09' }
];

const generateId = () => {
  const maxId = events.length > 0
    ? Math.max(...events.map(element => element.id))
    : 0;
  return maxId + 1;
}

app.get('/events', (request, response) => {
  let date = request.query.date;
  if (date === undefined) {
    response.json(events);
  } else {
    const data = events.filter(event => event.date === date);
    if (data.length > 0) {
      response.json(data);
    } else {
      response.status(404).send("Events logged corresponding to that date not found");
    }
  }
});

app.delete('/events/:id', (request, response) => {
  const id = parseInt(request.params.id);
  events = events.filter(event => event.id !== id);
  response.status(204).end();
});

app.post('/events', (request, response) => {
  const body = request.body;

  if (!body.title) {
    return response.status(400).json({
      error: 'Content missing'
    });
  }

  const event = {
    id: generateId(),
    title: body.title,
    date: body.date
  }

  events = events.concat(event);
  response.json(event);
});

app.put('/events/:id', (request, response) => {
  const event = events.find(element => element.id === parseInt(request.params.id));
  const index = events.indexOf(event);
  events[index] = request.body;
  response.json(events[index]);
});

app.patch('/events/:id', (request, response) => {
  const event = events.find(element => element.id === parseInt(request.params.id));
  const index = events.indexOf(event);
  events[index].title = request.body.title;
  response.json(events[index]);
});

app.get('/stats', (request, response) => {
  let count = 0;
  let stats = {};

  for (let i = 0; i < events.length; i++) {
    let date = events[i].date;
    if (date in stats) {
      ++stats[date];
    } else {
      stats[date] = 1;
    }
    count++;
  }
  response.json(stats);
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
