const databaseURL = 'http://localhost:8080/api';

/************
 *  TESTS   *
 ************/

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

async function getTestIDByDate (date) {
    const get = await axios.get(`${databaseURL}/tests/date`, {
        params: {
            date
        }
    });

    if(get.data.code)
    {
        if(get.data.code === 200)
            return get.data.rows[0].id;  
        else if(get.data.code === 404) 
            return [];
    }

    return [];
}

async function storeTestToDB (params) {
    const post = await axios.post(`${databaseURL}/tests/create`, params);
    return post.data;
}

/************
 *  CLASS   *
 ************/

async function getClasses (date) {
    const get = await axios.get(`${databaseURL}/class`, {
        params: {
            testDate: date
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

async function getClassNameByID (id) {
    const get = await axios.get(`${databaseURL}/class/id`, {
        params: {
            id
        }
    });

    if(get.data.code)
    {
        if(get.data.code === 200)
            return get.data.rows[0].class_name;  
        else if(get.data.code === 404) 
            return [];
    }

    return [];
}

async function storeClassToDB (params) {
    const post = await axios.post(`${databaseURL}/class/create`, params);
    return post.data;
}

/*************
 *  GROUPS   *
 *************/

 async function getTestsGroups (classID) {
    const get = await axios.get(`${databaseURL}/groups`, {
        params: {
            classID
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

async function storeGroupToDB (params) {
    const post = await axios.post(`${databaseURL}/groups/create`, params);
    return post.data;
}

async function removeGroup (id) {
    const deleteRequest = await axios.delete(`${databaseURL}/groups/remove`, { data: {id} });
    return deleteRequest.data;
}