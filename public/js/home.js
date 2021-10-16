const createTestBtn = document.getElementById('create-test-btn');

createTestBtn.addEventListener('click', () => {
    createTest();
});

function createTest () {
    const input = document.getElementById('test-create');
    const date = new Date(input.value);
    const name = `${date.getDate()+1}-${date.getMonth()+1}-${date.getFullYear()}`;
    // writeToDatabase();
}