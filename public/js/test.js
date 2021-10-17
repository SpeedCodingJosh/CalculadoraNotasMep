const createGroupBtn = document.getElementById('create-group-btn');
let deleteGroupButtons = [];

createGroupBtn.addEventListener('click', () => {
    createGroup();
});

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
                console.log(post.error);
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

    const className = await getClassNameByID(classID.value);
    const title = document.getElementById('class-name');
    title.innerText = `Calculadora de notas: ${className}`;

    const container = document.getElementById('groups');
    container.innerHTML = '';
    let finalHtml = '';
    
    if(groups.length > 0)
    {
        groups.forEach(group => {
            finalHtml += `
            <div class="w-full mb-10 group">
            <div class="group-title bg-blue-300 w-full font-bold text-lg">${group.group_name}</div>
            <div id="students">
                <table class="w-full">
                    <thead>
                        <tr class="border-2 border-black">
                            <th class="border-2 border-black">Nombre del estudiante</th>
                            <th class="border-2 border-black">Respuestas erroneas</th>
                            <th class="border-2 border-black">Pts obtenidos</th>
                            <th class="border-2 border-black">Nota</th>
                            <th class="border-2 border-black" colspan="2">Porcentage %</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end">
                <button indexprop="${group.id}" class="remove-group bg-red-300 mt-2 p-2 hover:bg-red-400">Eliminar grupo</button>
                <button class="add-student bg-green-300 mt-2 p-2 hover:bg-green-400">Añadir estudiante</button>
            </div>
            </div>\n`;
        });
        container.innerHTML = finalHtml;
    }

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
}

loadGroups();