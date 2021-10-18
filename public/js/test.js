const createGroupBtn = document.getElementById('create-group-btn');
const createPDFBtn = document.getElementById('create-pdf-btn');
let deleteGroupButtons = [];
let addStudentButtons = [];
let indicator_settings = {};
let indicators = [];

createGroupBtn.addEventListener('click', () => {
    createGroup();
});

createPDFBtn.addEventListener('click', async () => {
    const divEl = document.createElement('div');
    divEl.classList.add('test-dates', 'w-full', 'p-10', 'flex', 'flex-wrap', 'flex-column', 'justify-center');
    divEl.setAttribute('id', 'groups');
    const classID = document.getElementById('classID');
    const groups = await getTestsGroups(classID.value);

    let finalHtml = '';
    
    if(groups.length > 0)
    {
        groups.forEach((group) => {
            // Set Group
            finalHtml += `
            <div class="w-full mb-10 group">
            <div style="border: 1px solid black" class="group-title bg-blue-300 w-full font-bold text-lg text-center">${group.group_name}</div>
            <div id="students">
                <table class="w-full" border="2" style="border: 1px solid black">
                    <thead>
                        <tr class="border-black" style="border: 1px solid black">
                            <th style="border: 1px solid black" class="border-black">Nombre del estudiante</th>
                            <th style="border: 1px solid black; width: 35%;" class="border-black">Respuestas erróneas</th>
                            <th style="border: 1px solid black; width: 10%;" class="border-black text-center">Pts Ob</th>
                            <th style="border: 1px solid black; width: 10%;" class="border-black text-center">Nota</th>
                            <th style="border: 1px solid black; width: 10%;" class="border-black text-center">%</th>
                        </tr>
                    </thead>
                    <tbody indexprop="${group.id}">
                    </tbody>
                </table>
            </div>
            </div>\n`;
        });
        divEl.innerHTML = finalHtml;
    }

    const tbodies = divEl.querySelectorAll('tbody');
    tbodies.forEach(async (body) => {
        // Get Student Info
        const test_data = await getStudentInfo(body.attributes['indexprop'].value);
        let studentsInfo = '';

        test_data.forEach((data, idx) => {
            studentsInfo += `
            <tr style="border: 1px solid black" class="border-black">
                <td style="border: 1px solid black" class="border-black font-bold pl-1">${idx+1}. ${data.student} </td>
                <td style="border: 1px solid black" class="border-black font-bold pl-1"> ${data.wrong_answers.replaceAll(',', '-')} </td>
                <td style="border: 1px solid black" class="border-black student-points text-center font-bold">${data.points}</td>
                <td style="border: 1px solid black" class="border-black student-note text-center font-bold">${data.note}</td>
                <td style="border: 1px solid black" class="border-black student-percentage text-center font-bold">${data.percentage}</td>
            </tr>`;
        });

        body.innerHTML = studentsInfo;
    });

    // Change title of the class
    const classInfo = await getClassInfoByID(classID.value);
    const groupsName = divEl.querySelectorAll('.group-title');
    groupsName.forEach(group => {
        group.innerText = `${classInfo.class_name} --- ${group.innerText}`;
    });

    const examDate = await getTestInfoByID(classInfo.test_id);
    const newDate = new Date(examDate.date);
    const dateName = `${newDate.getDate()}-${newDate.getMonth()+1}-${newDate.getFullYear()}`;
    const opt = {
        margin: 0,
        filename: `Examen_${dateName}_clase_${classInfo.class_name}`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(divEl).save();
});


async function deleteStudent(id) {
    const removeConfirm = confirm("Esta seguro(a) que quiere eliminar este estudiante de la base de datos?");
    
    if(removeConfirm) {
        const remove = await removeStudent({ data: { id } });
        if(remove.code === 200)
            loadGroups();
    }
}

async function storeStudent(id) {
    const post = await storeStudentToDB({ id });

    if(post.code === 200)
        loadGroups();
}

async function createGroup () {
    const input = document.getElementById('group-create');
    const groupValidation = document.getElementById('group-validation');
    const classID = document.getElementById('classID');

    if(input.value) {
        groupValidation.innerText = "";

        const params = {
            name: input.value,
            classID: classID.value
        }

        // Check if group already exist
        const container = document.getElementById('groups');
        const classes = container.querySelectorAll('.group-title');

        let alreadyExist = false;
        classes.forEach(item => {
            if(item.innerText.toLowerCase() === input.value.toLowerCase()) {
                alreadyExist = true;
            }
        });

        if(!alreadyExist) {
            const post = await storeGroupToDB(params); 

            // Validation
            if(post.code === 500) {
                groupValidation.innerText = "Hubo un error al intentar crear el grupo, intente más tarde.";
            }
            else if(post.code === 200) {
                input.value = '';
                loadGroups();
            } 
        }
        else {
            groupValidation.innerText = "Este grupo ya existe, por favor indique otro.";
        }
    }
    else {
        groupValidation.innerText = "Ingrese un nombre para el grupo por favor.";
    }
}



// Called from databases.js
async function loadGroups () {
    const classID = document.getElementById('classID');
    const groups = await getTestsGroups(classID.value);

    const container = document.getElementById('groups');
    container.innerHTML = '';
    let finalHtml = '';
    
    if(groups.length > 0)
    {
        groups.forEach((group) => {
            // Set Group
            finalHtml += `
            <div class="w-full mb-10 group">
            <div class="group-title bg-blue-300 w-full font-bold text-lg">${group.group_name}</div>
            <div id="students">
                <table class="w-full">
                    <thead>
                        <tr class="border-2 border-black">
                            <th class="border-2 border-black">Nombre del estudiante</th>
                            <th class="border-2 border-black">Respuestas erróneas</th>
                            <th class="border-2 border-black">Pts obtenidos</th>
                            <th class="border-2 border-black">Nota</th>
                            <th class="border-2 border-black" colspan="2">Porcentaje %</th>
                        </tr>
                    </thead>
                    <tbody indexprop="${group.id}">
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end">
                <button indexprop="${group.id}" class="remove-group bg-red-300 mt-2 p-2 hover:bg-red-400">Eliminar grupo</button>
                <button class="add-student bg-green-300 mt-2 p-2 hover:bg-green-400" onclick="storeStudent(${group.id})">Añadir estudiante</button>
            </div>
            </div>\n`;
        });
        container.innerHTML = finalHtml;
    }

    const tbodies = container.querySelectorAll('tbody');
    tbodies.forEach(async (body) => {
        // Get Student Info
        const test_data = await getStudentInfo(body.attributes['indexprop'].value);
        let studentsInfo = '';

        test_data.forEach(data => {
            studentsInfo += `
            <tr class="border-2 border-black">
                <td class="border-2 border-black"><input type="text" class="w-full bg-transparent focus:outline-none text-right student-name" inputindex="${data.id}" value="${data.student}" /></td>
                <td class="border-2 border-black"><input type="text" class="w-full bg-transparent focus:outline-none text-right student-value" inputindex="${data.id}" value="${data.wrong_answers}" /></td>
                <td class="border-2 border-black student-points">${data.points}</td>
                <td class="border-2 border-black student-note">${data.note}</td>
                <td class="border-2 border-black student-percentage">${data.percentage}</td>
                <td class="border-2 border-black"><button onclick="deleteStudent(${data.id})" class="w-full h-full font-bold bg-red-300 hover:bg-red-400">X</button></td>
            </tr>`;
        });

        body.innerHTML = studentsInfo;
    });

    setTimeout(() => {
        const studentInputs = container.querySelectorAll('.student-name');
        studentInputs.forEach(student => {
            student.addEventListener('blur', async (e) => {
                e.preventDefault();

                const saveName = await updateStudentName({ 
                    studentName: e.target.value, 
                    id: student.attributes['inputindex'].value
                });

                if(saveName.code === 200)
                    loadGroups();
            });
        });

        const studentValuesInput = container.querySelectorAll('.student-value');
        studentValuesInput.forEach(student => {
            student.addEventListener('blur', async (e) => {
                e.preventDefault();
                let wrongAnswer = student.value.split(',');

                let myFinalPoints = 0;
                indicators.forEach((indicator, idx) => {
                    let wrongPoints = 0;
                    let values = indicator.value.split(',');
                    wrongAnswer.forEach(answer => {
                        values.forEach(val => {
                            if(val.replace(' ', '') === answer.replace(' ', '')) {
                                wrongPoints+=1;
                            }
                        })
                    });

                    if(wrongPoints >= 4)
                        myFinalPoints += indicator_settings.third;
                    else if(wrongPoints === 2 || wrongPoints === 3)
                        myFinalPoints += indicator_settings.second;
                    else if(wrongPoints <= 1)
                        myFinalPoints += indicator_settings.first;
                });

                const points = student.parentElement.parentElement.querySelector('.student-points');
                const note = student.parentElement.parentElement.querySelector('.student-note');
                const percentage = student.parentElement.parentElement.querySelector('.student-percentage');

                points.innerText = myFinalPoints;
                note.innerText = +points.innerText / +indicator_settings.test_points * 100;
                percentage.innerText = +note.innerText * indicator_settings.percentage;

                const saveName = await updateStudentValues({ 
                    studentValues: student.value, 
                    points: +points.innerText,
                    note: +note.innerText,
                    percentage: +percentage.innerText,
                    id: +student.attributes['inputindex'].value
                });

                if(saveName.code === 200)
                    loadGroups();
            });
        });
    }, 100);   

    // Change title of the class
    const classInfo = await getClassInfoByID(classID.value);
    const title = document.getElementById('class-name');
    title.innerText = `Calculadora de notas: ${classInfo.class_name}`;

    // Get class and test info
    const testID = document.getElementById('testID');
    testID.value = classInfo.test_id;
    const testInfo = await getTestInfoByID(classInfo.test_id);
    const backButton = document.getElementById('backBtn');
    const date = new Date(testInfo.date);
    const correctDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    backButton.setAttribute('href', `/class/${correctDate}`);

    // Get indicators settings
    indicator_settings = await getIndicators(classInfo.test_id);
    indicator_settings = indicator_settings.data.rows[0];

    indicators = await getIndicatorGroups(indicator_settings.id);
    if(indicators.data.code === 404)
        indicators = [];
    else if(indicators.data.code === 200)
        indicators = indicators.data.rows;

    if(indicators.length <= 0) {
        const groupValidation = document.getElementById('group-validation');
        groupValidation.innerText = "No existen indicadores, por favor, asegúrese de configurarlos.";
    }

    const indicatorsBtn = document.getElementById('change-indicators');
    indicatorsBtn.setAttribute('href', `/indicators/${classID.value}/${indicator_settings.id}`);

    // Delete group
    deleteGroupButtons = container.querySelectorAll('.remove-group');
    deleteGroupButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const remove = await removeGroup(btn.attributes['indexprop'].value);
            if(remove.code === 500) {
                groupValidation.innerText = "Error al eliminar el grupo, codigo(500)";
            }
            else (remove.code === 200)
                loadGroups();
        });
    });

    // Add student
    addStudentButtons = container.querySelectorAll('.add-student');
    addStudentButtons.forEach(btn => {
        const parent = btn.parentNode.parentNode;
        const tbody = parent.querySelector('tbody');

        btn.addEventListener('click', () => {
            if(indicators.length <= 0) {
                const groupValidation = document.getElementById('group-validation');
                groupValidation.innerText = "No existen indicadores, por favor, asegúrese de configurarlos.";

                return;
            }
        });
        // tbody.innerHTML +=
    });
}

loadGroups();