const createIndicatorBtn = document.getElementById('create-indicator-btn');
const saveBtn = document.getElementById('save-btn');
const exitBtn = document.getElementById('exit-btn');

createIndicatorBtn.addEventListener('click', () => {
    createIndicator();
});

exitBtn.addEventListener('click', () => {
    const exit = confirm('Esta seguro(a) que quiere salir sin guardar los cambios?');
    if(exit) {
        const classID = document.getElementById('classID');
        window.location.href = `/test/${classID.value}`;
    }
});

saveBtn.addEventListener('click', async () => {
    const container = document.getElementById('indicators-group');
    const indicator_groups = container.querySelectorAll('.indicator-textarea');
    const indicatorValidation = document.getElementById('indicator-validation');

    if(indicator_groups.length <= 0) {
        indicatorValidation.innerText = "Por favor ingrese al menos un indicador.";
        return;
    }

    let canContinue = true;

    indicator_groups.forEach(async (group, index) => {
        if(group.value === "") {
            indicatorValidation.innerText = `Indicador ${index+1} está vacío por favor ponga números separados por comas`;
            canContinue = false;
            return;
        }

        const vals = group.value.split(',');

        for(let i = 0; i < vals.length; i++) {
            if(vals[i] === undefined)
                continue;

            vals[i] = vals[i].replace(' ', '');

            if(isNaN(vals[i])) {
                indicatorValidation.innerText = `Indicador ${index+1} tiene valores no numéricos, solo se aceptan números separados por comas`;
                canContinue = false;
                break;
            }
        }
    });

    if(canContinue) {
        let storedCount = 0;
        let children = 1;

        indicator_groups.forEach(async (group) => {
            const params = {
                values: group.value,
                id: group.parentElement.parentElement.attributes['indexprop'].value
            };

            const update = await updateIndicatorGroup(params);
            if(update.code === 200)
                storedCount++;

            children++;
        });

        // Settings
        let first = document.getElementById('first');
        first = first.value;
        let second = document.getElementById('second');
        second = second.value;
        let third = document.getElementById('third');
        third = third.value;
        let percentage = document.getElementById('percentage');
        percentage = percentage.value;
        let test_points = document.getElementById('test_points');
        test_points = test_points.value;
        let settingID = document.getElementById('settingID');
        settingID = settingID.value;

        const settingsParams = {
            first, second, third, percentage, test_points, settingID
        };

        const updateSettings = await updateIndicatorSettings(settingsParams);
        if(updateSettings.code === 200)
            storedCount++;

        if(storedCount >= children) {
            const classID = document.getElementById('classID');
            window.location.href = `/test/${classID.value}`;
        }
    }
});

async function createIndicator () {
    const indicatorValidation = document.getElementById('indicator-validation');
    const container = document.getElementById('indicators-group');
    const indicator_groups = container.querySelectorAll('.indicator-group');

    let count = 0;
    indicator_groups.forEach(group => {
        count++;
    });

    const settingID = document.getElementById('settingID');

    const params = {
        name: `Indicador ${count+1}`,
        id: settingID.value
    }
    
    const post = await storeIndicatorGroupToDB(params); 

    // Validation
    if(post.code === 500) {
        indicatorValidation.innerText = "Hubo un error al intentar crear el grupo, intente más tarde.";
    }
    else if(post.code === 200) {
        loadIndicators();
    } 
}

async function deleteIndicator (id) {
    const remove = await removeIndicatorGroup(id);

    if(remove.code === 200) 
        loadIndicators();
}

// Called from databases.js
async function loadIndicators () {
    const settingID = document.getElementById('settingID');
    let settings = await getIndicators(settingID.value);
    settings = settings.data.rows[0];

    let indicators = await getIndicatorGroups(settingID.value);
    if(indicators.data.code === 404)
        indicators = [];
    else if(indicators.data.code === 200)
        indicators = indicators.data.rows;

    const container = document.getElementById('indicators-group');
    container.innerHTML = '';
    let finalHtml = '';

    if(indicators.length > 0)
    {
        indicators.forEach(indicator => {
            finalHtml += `
            <div class="w-1/3 m-2 indicator-group" indexprop="${indicator.id}">
                <div class="indicator-title bg-blue-400 w-full font-bold text-lg text-center relative">${indicator.group_name} <button class="h-full w-10 bg-red-500 font-bold text-white absolute top-0 right-0 hover:bg-red-400" onclick="deleteIndicator(${indicator.id})">X</button></div>
                <div class="bg-blue-300 w-full p-2">
                    <textarea class="indicator-textarea w-full bg-transparent text-center focus:outline-none" rows="5">${indicator.value}</textarea>
                </div>
            </div>\n`;
            
        });
        container.innerHTML = finalHtml;
    }
    
    const first = document.getElementById('first');
    const second = document.getElementById('second');
    const third = document.getElementById('third');
    const percentage = document.getElementById('percentage');
    const test_points = document.getElementById('test_points');

    first.value = settings.first;
    second.value = settings.second;
    third.value = settings.third;
    percentage.value = settings.percentage;
    test_points.value = settings.test_points;
}

loadIndicators();