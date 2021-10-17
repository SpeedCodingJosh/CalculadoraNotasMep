const createClassBtn = document.getElementById('create-class-btn');

createClassBtn.addEventListener('click', () => {
    createClass();
});

async function createClass () {
    const input = document.getElementById('class-create');
    const classValidation = document.getElementById('class-validation');
    const testID = document.getElementById('testID');

    if(input.value) {
        classValidation.innerText = "";

        const params = {
            name: input.value,
            testID: testID.value
        }

        // Check if group already exist
        const container = document.getElementById('class_container');
        const classes = container.querySelectorAll('.class-link');

        let alreadyExist = false;
        classes.forEach(item => {
            if(item.innerText === input.value) {
                alreadyExist = true;
            }
        });

        if(!alreadyExist) {
            const post = await storeClassToDB(params); 

            // Validation
            if(post.code === 500) {
                classValidation.innerText = "Hubo un error al intentar crear el grupo, intente más tarde.";
            }
            else if(post.code === 200) {
                input.value = '';
                loadClasses();
            } 
        }
        else {
            classValidation.innerText = "Esta clase ya existe, por favor indique otro.";
        }
    }
    else {
        classValidation.innerText = "Ingrese un nombre para la clase por favor.";
    }
}

// Called from databases.js
async function loadClasses () {
    const testDate = document.getElementById('testDate');

    const testID = await getTestIDByDate(testDate.value);
    const testIdEl = document.getElementById('testID');
    testIdEl.value = testID;

    const classes = await getClasses(testDate.value);

    if(classes.length > 0)
    {
        const container = document.getElementById('class_container');
        container.innerHTML = '';
        let finalHtml = '';

        classes.forEach(item => {
            finalHtml += `<a href="/test/${item.id}" class="w-1/3 h-full font-bold hover:bg-blue-300 rounded-xl mb-5 class-link">${item.class_name}</a>\n`;
        });
        container.innerHTML = finalHtml;
    }
}

loadClasses();