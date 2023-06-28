const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const router = require('./router');
const app = express();
const port = 3030;
var humanChat = false;


const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'chatbot',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

app.engine('html',require('express-art-template'));
app.use(router);
app.use(express.static("public"));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/chat', (req, res) => {
  const message = req.body.message;
  console.log(message);
  const query = `SELECT response FROM chatbot WHERE message like '%${message}%'`;
  //const query = `SELECT response FROM chatbot ORDER BY rand() LIMIT 5`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.length === 0) {
      res.send('我不太了解您的意思，如需轉接人工客服請點選“人工客服”');

      return;
    }




    const response = results[0].response;
    res.send(response);

  });
});

app.post('/chathuman', (req, res) => {
  //var clock = setInterval(test, 200);
  const message = req.body.message;
  console.log(message);
  const query = `INSERT INTO chat_front (id, message) VALUES ('${message}', 'client')`;
  const query2 = `SELECT id FROM chat_online ORDER BY rand() LIMIT 5`;
  const query3 = `DELETE FROM chat_front WHERE id='${message}'`
  connection.query(query2, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.status(500).send('Internal server error');
      return;
    }
    if (results.length === 0) {
      res.send("客服均在忙線中，請稍候再試");
      connection.query(query3, (err, results) => {

      });

      return;
    }
    console.log(results);
    const response = "編號："+results[0].id + "客服人員很高興為您服務";
    res.send(response);


  });
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.status(500).send('Internal server error');
      return;
    }

    // const response = "連線中";
    // res.send(response);

  });
});

app.post('/chathumanchat', (req, res) => {
  const msgs = req.body.msgs;
  const message = req.body.message;
  console.log(msgs);
  console.log(message);
  const query = `INSERT INTO chat_front (id, message) VALUES ('${msgs}', '${message}')`;
  //const query = `SELECT response FROM chatbot ORDER BY rand() LIMIT 5`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.length === 0) {
      res.send('我不太了解您的意思，如需轉接人工客服請點選“人工客服”');

      return;
    }



  });
});

app.post('/fetchchat', (req, res) => {
  const message = req.body.message;
  console.log(message);
  const query = `SELECT response FROM chatbot WHERE id = '%${message}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.status(500).send('Internal server error');
      return;
    }

    




    const response = results[0].response;
    res.send(response);

  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

