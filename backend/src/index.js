const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const TodoTask = require('./TodoTask');
const Category = require('./Category');

// import MongoClient from './mongodb';
dotenv.config();

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

mongoose.set("useFindAndModify", false);


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
// app.post('/', checkJwt, (req, res) => {
//     const {title, description} = req.body;
//     const newQuestion = {
//         id: questions.length + 1,
//         title,
//         description,
//         answers: [],
//     };
//     questions.push(newQuestion);
//     res.status(200).send();
// })

// app.post('/app', (req, res) => {
//     res.send({test: 'nut'});
//     try {
//         // TodoTask.find({}, (err, tasks) => {
//         //     // res.render("todo.ejs", { todoTasks: tasks });
//         //     res.send({ todoTasks: tasks, test: 'nut' });
//         // });
//         console.log('nuttt');
//     } catch(e) {
//         console.log(e);
//     }
// })


// Inserts new task
app.post('/app/newTask', checkJwt, async (req, res) => {
    const todoTask = new TodoTask({
        // content: req.body.content,
        userId: req.body.userId,
        content: req.body.content,
        dueDate: req.body.dueDate,
        completed: false,
        category: req.body.category,
    });
    try {
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

app.post('/app', checkJwt, (req, res) => {
    TodoTask.find({ userId: req.body.userId }, (err, tasks) => {
        res.send({ todoTasks: tasks });
    })
})

// Returns the categories created by this user.
app.post('/app/getCategories', checkJwt, async (req, res) => {
    Category.findOne({userId: req.body.userId}, (err, user) => {
        if (!user) {
            var user = new Category({
                userId: req.body.userId,
            })
        }
        res.send({categories: user.category});
    });
});

// Adds a new category under a userID.
app.post('/app/addCategory', checkJwt, async (req, res) => {
    Category.findOne({userId: req.body.userId}, (err, user) => {
        if (!user) {
            var user = new Category({
                userId: req.body.userId,
            })
        }
        if (user.category.indexOf(req.body.newCategory) <= -1) {
            user.category.push(req.body.newCategory);
            user.save();
        }
    });
    res.send(200);
});

app.post('/app/removeCategory', checkJwt, (req, res) => {
    Category.findOne({userId: req.body.userId}, (err, user) => {
        const index = user.category.indexOf(req.body.category);
        console.log(index);
        if (index > -1) {
            user.category.splice(index, 1);
            user.save();
        }
    });
    TodoTask.find({category: req.body.category}, (err, tasks) => {
        // task.category = null;
        // task.save();
        for (var i = 0; i < tasks.length; i += 1) {
            tasks[i].category = null;
            tasks[i].save();
        }
    });
    res.status(200).send();
})
// // insert answer to a question
// app.post('/answer/:id', checkJwt, (req, res) => {
//     const {answer} = req.body;

//     const question = questions.filter(q => (q.id === parseInt(req.params.id)));
//     if (question.length > 1) return res.status(500).send();
//     if (question.length === 0) return res.status(404).send();

//     question[0].answers.push({
//         answer,
//     });

//     res.status(200).send();
// })

// Deletes a Task
app.post('/app/deleteTask', checkJwt, (req, res) => {
    TodoTask.findByIdAndDelete(req.body.key, (err, succ) => {});
    res.status(200).send();
})

app.post('/app/completeTask', checkJwt, (req, res) => {
    TodoTask.findById(req.body.key, (err, task) => {
        task.completed = !task.completed;
        task.save();
    });
    res.status(200).send();
})


app.post('/app/editTask', checkJwt, (req, res) => {
    TodoTask.findById(req.body.key, (err, task) => {
        console.log(req.body);
        task.content = req.body.newContent;
        task.category = req.body.newCategory;
        task.dueDate = req.body.newDate;
        task.save();
    });
    res.status(200).send();
})

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    () => {
        console.log("connected yeet");
        app.listen(8081, () => console.log("server up yeet"));
    }
);

// app.listen(8081, () => {
//     console.log('listening on port 8081');
// });