const expenseDescriptionInput = document.getElementById("description");
const expensePriceInput = document.getElementById("price");
const expenseCategoryInput = document.getElementById("category");
const quantity = document.getElementById("quantity");
const totalMoneyInput = document.getElementById("total_income");
const addExpenseButton = document.getElementById("add");
const expenseTableBody = document.querySelector("#expense_table tbody");
const totalValue = document.getElementById("total_expenses");
const remainingValue = document.getElementById("remaining_value");
const totalMoney = document.getElementById("total");

let expenses = [];
let total = 0;
let remaining = 0;
let selectedExpenseIndex = -1;

// function to add a new expense
function addExpense() {
  // Get the expense description and price from the input fields
  const category = expenseCategoryInput.value;
  const description = expenseDescriptionInput.value.trim();
  const price = parseFloat(expensePriceInput.value);
  const number = parseInt(quantity.value);

  // Validate the input fields
  if (description === "" || isNaN(price) || category==="Select any category" || isNaN(number) ||
  number <= 0) {
    alert("Please enter valid credentials for adding an expense.");
    return;
  }

  // Check if adding the new expense exceeds the remaining budget
  if (total + price * number > totalMoneyInput.value) {
    alert("Adding this expense exceeds the remaining budget.");
    return;
  }

  // Add the new expense to the expenses array
  expenses.push({
    description: description,
    TotalExpenseNum: number,
    price: price,
    category: category,
  });

  // Calculate the new total and remaining values
  total = expenses.reduce(
    (acc, currentValue) =>
      acc + currentValue.price * currentValue.TotalExpenseNum,
    0
  );
  remaining = totalMoneyInput.value - total;
  totalMoney.textContent = totalMoneyInput.value;

  // Update the table and total/remaining values
  updateTable();
  updateTotal();
  updateRemaining();

  // Clear the input fields
  expenseCategoryInput.value = "Select any category";
  expenseDescriptionInput.value = "";
  expensePriceInput.value = "";
  quantity.value = "";
}

// function to update the table
function updateTable() {
  // Clear the existing table rows
  expenseTableBody.innerHTML = "";

  // Loop through the expenses array and add a new row for each expense
  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    const row = document.createElement("tr");

    const categoryCell = document.createElement("td");
    const priceCell = document.createElement("td");
    const descriptionCell = document.createElement("td");
    const actionsCell = document.createElement("td");

    categoryCell.textContent = expense.category;

    descriptionCell.textContent =
      expense.description +
      " " +
      "(" +
      expense.TotalExpenseNum +
      "x" +
      expense.price +
      ")";

    priceCell.textContent = expense.price.toFixed(2) * expense.TotalExpenseNum;

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="uil uil-pen"></i>';
    editButton.addEventListener("click", () => {
      // Set the selected expense index and update the form inputs
      selectedExpenseIndex = i;
      expenseCategoryInput.value = expense.category;
      expenseDescriptionInput.value = expense.description;
      expensePriceInput.value = expense.price.toFixed(2);
      quantity.value = expense.TotalExpenseNum;
      addExpenseButton.textContent = "Save";
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    deleteButton.addEventListener("click", () => {
      // Remove the selected expense from the expenses array and update the table
      expenses.splice(i, 1);
      total = expenses.reduce(
        (acc, currentValue) =>
          acc + currentValue.price * currentValue.TotalExpenseNum,
        0
      );
      remaining = totalMoneyInput.value - total;
      updateTable();
      updateTotal();
      updateRemaining();
      expenseCategoryInput.value = "Select any category";
      expenseDescriptionInput.value = "";
      expensePriceInput.value = "";
      addExpenseButton.textContent = "Add Expense";
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(categoryCell);
    row.appendChild(descriptionCell);
    row.appendChild(priceCell);
    row.appendChild(actionsCell);
    expenseTableBody.appendChild(row);
  }
}

// function to update the total value
function updateTotal() {
  totalValue.textContent = total.toFixed(2);
}

// function to update the remaining value
function updateRemaining() {
  remainingValue.textContent = remaining.toFixed(2);
}

addExpenseButton.addEventListener("click", () => {
  if (addExpenseButton.textContent === "Add Expense") {
    addExpense();
  } else if (addExpenseButton.textContent === "Save") {
    // Update the selected expense and reset the form inputs
    const selectedExpense = expenses[selectedExpenseIndex];
    selectedExpense.category = expenseCategoryInput.value;
    selectedExpense.description = expenseDescriptionInput.value.trim();
    selectedExpense.price = parseFloat(expensePriceInput.value);
    selectedExpense.TotalExpenseNum = parseInt(quantity.value);
    console.log(selectedExpense);

    // Calculate the new total and remaining values
    total = expenses.reduce(
      (acc, currentValue) =>
        acc + currentValue.price * currentValue.TotalExpenseNum,
      0
    );

    remaining = totalMoneyInput.value - total;
    // Update the table and total/remaining values
    updateTable();
    updateTotal();
    updateRemaining();

    // Reset the form inputs and selected expense index
    expenseCategoryInput.value = "Select any category";
    expenseDescriptionInput.value = "";
    expensePriceInput.value = "";
    quantity.value = "";
    addExpenseButton.textContent = "Add Expense";
    selectedExpenseIndex = -1;
  }
});
