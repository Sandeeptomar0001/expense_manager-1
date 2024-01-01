const firebaseConfig = {
    apiKey: "AIzaSyAJWWMin83yl1f-pVVEs-EkV25v1M9M2eg",
    authDomain: "expensemanagepro.firebaseapp.com",
    projectId: "expensemanagepro",
    storageBucket: "expensemanagepro.appspot.com",
    messagingSenderId: "43376825391",
    appId: "1:43376825391:web:66731bf4e7c729f55f62da",
    measurementId: "G-DZEGHRW9CQ"
  };
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function addData() {
    const typeSelect = document.querySelector('select[name="type"]');
    const nameInput = document.querySelector('input[name="name"]');
    const friendInput = document.querySelector('input[name="friend"]');
    const dateInput = document.querySelector('input[name="date"]');
    const currSelect = document.querySelector('select[name="curr"]');
    const amtInput = document.querySelector('input[name="amt"]');

    const tableBody = document.getElementById('expenseTableBody');

    // Push data to Firebase
    const newDataRef = database.ref('expenses').push();
    const newExpense = {
        type: typeSelect.value,
        name: nameInput.value,
        friend: friendInput.value,
        date: dateInput.value,
        curr: currSelect.value,
        amt: amtInput.value
    };
    newDataRef.set(newExpense);

    // Create a new row for the table
    const newRow = createTableRow(newExpense, newDataRef.key);
    tableBody.appendChild(newRow);
    console.log(newExpense);

    // Reset input fields
    typeSelect.value = '--choose one';
    nameInput.value = '';
    friendInput.value = '';
    dateInput.value = '';
    currSelect.value = '--choose one';
    amtInput.value = '';
}

function createTableRow(expense, key) {
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-key', key);

    const typeCell = createTableCell(expense.type);
    const nameCell = createTableCell(expense.name);
    const friendCell = createTableCell(expense.friend);
    const dateCell = createTableCell(expense.date);
    const currCell = createTableCell(expense.curr);
    const amtCell = createTableCell(expense.amt);

    newRow.appendChild(typeCell);
    newRow.appendChild(nameCell);
    newRow.appendChild(friendCell);
    newRow.appendChild(dateCell);
    newRow.appendChild(currCell);
    newRow.appendChild(amtCell);

    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'btn btn-warning';
    editButton.onclick = function () {
        editExpense(newRow, key);
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.onclick = function () {
        deleteExpense(newRow, key);
    };

    editCell.appendChild(editButton);
    editCell.appendChild(deleteButton);

    newRow.appendChild(editCell);

    return newRow;
}

function createTableCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}

// ... (your existing code)

function fetchData() {
    const dataRef = database.ref('expenses');

    // Fetch initial data and listen for subsequent changes
    dataRef.once('value', (snapshot) => {
        const data = snapshot.val();

        if (data) {
            const records = Object.entries(data).map(([id, values]) => ({
                id,
                ...values,
            }));

            // Render the initial data in the table
            renderTable(records);

            // Store initial data in localStorage
            updateLocalStorage(records);
        } else {
            // Handle case when there is no data in Firebase
            // Check if there's data in localStorage
            const storedData = localStorage.getItem('expensesData');
            if (storedData) {
                const records = JSON.parse(storedData);
                renderTable(records);
            } else {
                console.log('No data found.');
            }
        }
    }, (error) => {
        console.error('Error fetching data from Firebase:', error);
    });

    // Listen for value changes to update the table in real-time
    dataRef.on('child_changed', (snapshot) => {
        const updatedExpense = snapshot.val();
        const expenseKey = snapshot.key;

        updateTableRow(expenseKey, updatedExpense);
        updateLocalStorage(getCurrentDataFromTable());
    });

    // Listen for child removal to update the table in real-time
    dataRef.on('child_removed', (snapshot) => {
        const expenseKey = snapshot.key;
        removeTableRow(expenseKey);
        updateLocalStorage(getCurrentDataFromTable());
    });
}

function renderTable(data) {
    const tableBody = document.getElementById('expenseTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach((expense) => {
        const newRow = createTableRow(expense, expense.id);
        tableBody.appendChild(newRow);
    });
}

function getCurrentDataFromTable() {
    const tableBody = document.getElementById('expenseTableBody');
    const rows = tableBody.querySelectorAll('tr');

    const currentData = Array.from(rows).map((row) => {
        const key = row.getAttribute('data-key');
        const cells = row.querySelectorAll('td');
        return {
            id: key,
            type: cells[0].textContent,
            name: cells[1].textContent,
            friend: cells[2].textContent,
            date: cells[3].textContent,
            curr: cells[4].textContent,
            amt: cells[5].textContent,
        };
    });

    return currentData;
}

function updateLocalStorage(data) {
    localStorage.setItem('expensesData', JSON.stringify(data));
}

// Call the fetchData function to initiate data fetching
fetchData();



function editExpense(row, key) {
    const cells = row.querySelectorAll('td');

    // Populate the input fields with existing data
    const typeInput = document.querySelector('select[name="type"]');
    typeInput.value = cells[0].textContent;

    const nameInput = document.querySelector('input[name="name"]');
    nameInput.value = cells[1].textContent;

    const friendInput = document.querySelector('input[name="friend"]');
    friendInput.value = cells[2].textContent;

    const dateInput = document.querySelector('input[name="date"]');
    dateInput.value = cells[3].textContent;

    const currInput = document.querySelector('select[name="curr"]');
    currInput.value = cells[4].textContent;

    const amtInput = document.querySelector('input[name="amt"]');
    amtInput.value = cells[5].textContent;

    // Change the button text to "Update Expense"
    const addButton = document.querySelector('.btn-outline-light');
    addButton.textContent = 'Update Expense';
    addButton.onclick = function () {
        updateExpense(key);
    };
}


function updateExpense(key) {
    const typeInput = document.querySelector('select[name="type"]');
    const nameInput = document.querySelector('input[name="name"]');
    const friendInput = document.querySelector('input[name="friend"]');
    const dateInput = document.querySelector('input[name="date"]');
    const currInput = document.querySelector('select[name="curr"]');
    const amtInput = document.querySelector('input[name="amt"]');

    // Get the updated values
    const updatedExpense = {
        type: typeInput.value,
        name: nameInput.value,
        friend: friendInput.value,
        date: dateInput.value,
        curr: currInput.value,
        amt: amtInput.value
    };

    // Update data in Firebase
    database.ref('expenses/' + key).update(updatedExpense);

    // Update the corresponding table row with the new values
    updateTableRow(key, updatedExpense);


    // Update data in Firebase
    database.ref('expenses/' + key).update(updatedExpense);

    function updateTableRow(key, updatedExpense) {
        const rowToUpdate = document.querySelector(`tr[data-key="${key}"]`);
    
        if (rowToUpdate) {
            const cells = rowToUpdate.querySelectorAll('td');
            cells[0].textContent = updatedExpense.type;
            cells[1].textContent = updatedExpense.name;
            cells[2].textContent = updatedExpense.friend;
            cells[3].textContent = updatedExpense.date;
            cells[4].textContent = updatedExpense.curr;
            cells[5].textContent = updatedExpense.amt;
        }
    }
    
    function removeTableRow(key) {
        const rowToRemove = document.querySelector(`tr[data-key="${key}"]`);
    
        if (rowToRemove) {
            rowToRemove.remove();
        }
    }
    
    // Clear input fields
    typeInput.value = '--choose one';
    nameInput.value = '';
    friendInput.value = '';
    dateInput.value = '';
    currInput.value = '--choose one';
    amtInput.value = '';

    // Change the button text back to "Add New Expense"
    const addButton = document.querySelector('.btn-outline-light');
    addButton.textContent = 'Add New Expense';
    addButton.onclick = function () {
        addData();
    };
}

function deleteExpense(row, key) {
    // Delete data from Firebase
    database.ref('expenses/' + key).remove()
        .then(() => {
            // Remove the row from the table
            removeTableRow(key);
        })
        .catch((error) => {
            console.error('Error deleting data from Firebase:', error);
        });
}

function removeTableRow(key) {
    const rowToRemove = document.querySelector(`tr[data-key="${key}"]`);

    if (rowToRemove) {
        rowToRemove.remove();
    }
}



// Listen for changes in Firebase and update the table
database.ref('expenses').on('child_changed', function (snapshot) {
    const updatedExpense = snapshot.val();
    const expenseKey = snapshot.key;

    const rowToUpdate = document.querySelector(`tr[data-key="${expenseKey}"]`);
    if (rowToUpdate) {
        const cells = rowToUpdate.querySelectorAll('td');
        cells[0].textContent = updatedExpense.type;
        cells[1].textContent = updatedExpense.name;
        cells[2].textContent = updatedExpense.friend;
        cells[3].textContent = updatedExpense.date;
        cells[4].textContent = updatedExpense.curr;
        cells[5].textContent = updatedExpense.amt;
    }
});

database.ref('expenses').on('child_removed', function (snapshot) {
    const expenseKey = snapshot.key;

    function removeTableRow(key) {
        const rowToRemove = document.querySelector(`tr[data-key="${key}"]`);
    
        if (rowToRemove) {
            rowToRemove.remove();
        }
    }
});
// Call the fetchData function to initiate data fetching
fetchData();