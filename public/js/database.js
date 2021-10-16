const databaseURL = 'http://localhost:8080/api';

async function getTests () {
    const get = await axios.get(`${databaseURL}/tests`, {
        params: {
            userID: 1
        }
    });

    if(get.data.code)
    {
        if(get.data.code === 200)
            return get.data.rows;  
        else if(get.data.code === 404) 
            return [];
    }

    return [];
}

async function storeTestToDB (params) {
    const post = await axios.post(`${databaseURL}/tests/create`, params);
    return post.data;
}