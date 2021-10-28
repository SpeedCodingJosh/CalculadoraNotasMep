const createTestBtn = document.getElementById('create-test-btn');

createTestBtn.addEventListener('click', () => {
    createTest();
});

async function createTest () {
    const input = document.getElementById('test-create');
    const testValidation = document.getElementById('test-validation');

    if(input.value) {
        testValidation.innerText = "";

        const params = {
            date: input.value,
            id: 1
        }

        const post = await storeTestToDB(params); 

        // Validation
        if(post.code === 500)
            testValidation.innerText = "Hubo un error al intentar crear el grupo, intente más tarde.";
        else if(post.code === 1062)
           testValidation.innerText = "Esta fecha ya existe, por favor elija otra.";
        else if(post.code === 200)
            loadTests();
    }
    else {
        testValidation.innerText = "Ingrese una fecha antes de crear un examen por favor.";
    }
}

// Called from databases.js
async function loadTests () {
    const tests = await getTests();

    if(tests.length > 0)
    {
        const container = document.getElementById('test_dates');
        container.innerHTML = '';
        let finalHtml = '';

        tests.forEach(test => {
            const parseDate = new Date(test.date);
            const correctDate = `${(parseDate.getDate()+1).toString().padStart(2, '0')}/${(parseDate.getMonth()+1).toString().padStart(2, '0')}/${parseDate.getFullYear()}`;

            finalHtml += `<a href="/class/${parseDate.getFullYear()}-${parseDate.getMonth()+1}-${parseDate.getDate()+1}" class="w-1/2 h-full font-bold hover:bg-blue-300 rounded-xl mb-10">Examen ${correctDate}</a>\n`;
        });
        container.innerHTML = finalHtml;
    }
}

loadTests();