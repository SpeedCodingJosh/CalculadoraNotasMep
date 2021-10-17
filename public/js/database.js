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

async function getTestInfoByID (id) {
    const get = await axios.get(`${databaseURL}/tests/id`, {
        params: {
            id
        }
    });

    if(get.data.code)
    {
        if(get.data.code === 200)
            return get.data.rows[0];  
        else if(get.data.code === 404) 
            return [];
    }

    return [];
}

async function getStudentInfo (id) {
    const get = await axios.get(`${databaseURL}/tests/student`, {
        params: {
            id
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

async function storeStudentToDB (params) {
    const post = await axios.post(`${databaseURL}/tests/create/student`, params);
    return post.data;
}

async function removeStudent (params) {
    const post = await axios.delete(`${databaseURL}/tests/create/student`, params);
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

async function getClassInfoByID (id) {
    const get = await axios.get(`${databaseURL}/class/id`, {
        params: {
            id
        }
    });

    if(get.data.code)
    {
        if(get.data.code === 200)
            return get.data.rows[0];  
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

/*****************
 *  INDICATORS   *
 *****************/

async function getIndicators (id) {
    const getIndicatorSettings = await axios.get(`${databaseURL}/indicators/id`, { 
        params: { id }
    });

    return getIndicatorSettings;
}

async function getIndicatorGroups (settingID) {
    const getIndicators = await axios.get(`${databaseURL}/indicators/`, { 
        params: { settingID }
    });

    return getIndicators;
}

async function storeIndicatorGroupToDB (params) {
    const post = await axios.post(`${databaseURL}/indicators/create`, params);
    return post.data;
}

async function removeIndicatorGroup (id) {
    const deleteRequest = await axios.delete(`${databaseURL}/indicators/remove`, { data: {id} });
    return deleteRequest.data;
}

async function updateIndicatorSettings (params) {
    const updateRequest = await axios.put(`${databaseURL}/indicators/update/`, params);
    return updateRequest.data;
}

async function updateIndicatorGroup (params) {
    const updateRequest = await axios.put(`${databaseURL}/indicators/update/single`, params);
    return updateRequest.data;
}