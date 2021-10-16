const databaseURL = 'http://localhost:8080/api';
let database = {};

async function readDatabase () {
    const data = await axios.get(`${databaseURL}/tests`);
    if(data.data)
        database = data.data;
}

function writeToDatabase () {
    const data = JSON.stringify(database);
    axios.post(`${databaseURL}/save`, { payload: data });
}

readDatabase();