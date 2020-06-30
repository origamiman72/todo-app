const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Express app
const app = express();

// temp database
const questions = [];

// adds helmet
app.use(helmet());

// enables json parsing
app.use(bodyParser.json());

// enables cors reqs
app.use(cors());

// logs http reqs
app.use(morgan('combined'));

// Retrieves quesitons
app.get('/', (req, res) => {
    const qs = questions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        answers: q.answers.length,
    }));
    res.send(qs);
});

// gets specific question
app.get('/:id', (req, res) => {
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if (question.length > 1) return res.status(500).send();
    if (question.length === 0) return res.status(404).send();
    res.send(question[0]);
});

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-lzf13zkf.us.auth0.com/.well-known/jwks.json`
    }),

    audience: '2R8ASKiSw9j5Khlw7KloxI51SlsdMLqH',
    issuer: `https://dev-lzf13zkf.us.auth0.com/`,
    algorithms: ['RS256']
});

// Inserts new question
app.post('/', checkJwt, (req, res) => {
    const {title, description} = req.body;
    const newQuestion = {
        id: questions.length + 1,
        title,
        description,
        answers: [],
    };
    questions.push(newQuestion);
    res.status(200).send();
})

// insert answer to a question
app.post('/answer/:id', checkJwt, (req, res) => {
    const {answer} = req.body;

    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if (question.length > 1) return res.status(500).send();
    if (question.length === 0) return res.status(404).send();

    question[0].answers.push({
        answer,
    });

    res.status(200).send();
})

app.listen(8081, () => {
    console.log('listening on port 8081');
});