const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://ahujaabhik:WeBygpqh2fDDemdO@cluster0-grsh7.mongodb.net/<dbname>?retryWrites=true&w=majority";

async function main() {
    const uri = 'mongodb://127.0.0.1:27017';

    const dbName = 'test';
    let db;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) return console.log(err);
        
        db = client.db(dbName);
        console.log(`Connected MongoDB: ${url}`);
        console.log(`Database: ${dbName}`);
    });

    try {
        await client.connect();
        await listDatabases(client);
        await addTask(client, {
            name: "Abhik Ahuja",
            task: "do other task"
        })
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function addTask(client, newTask) {
    const result = await client.db('test').collection("tasks").insertOne(newTask);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// function connect() {
//     client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
//     });
// }

main();