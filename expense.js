const firebaseConfig = {
    // Firebase congiguration code
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

// ...

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
    database.ref('expenses/' + key).remove();

    // Remove the row from the table
    row.remove();
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

    const rowToRemove = document.querySelector(`tr[data-key="${expenseKey}"]`);
    if (rowToRemove) {
        rowToRemove.remove();
    }
});
