let expenses = [];
let income = [];
const BAR_MAX_HEIGHT = 200;

// EXPENSES
// adding expenses to table
function addExpense() {
  const date = document.getElementById('expense-date').value;
  const name = document.getElementById('expense-name').value;
  const type = document.getElementById('expense-type').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);

  if (!date || !name || !type || isNaN(amount)) return; //input validation
  expenses.push({ date, name, type, amount });
  renderExpenses();
  updateOverview();
  updateExpenseGraph();
  
  document.getElementById('expense-date').value = '';
  document.getElementById('expense-name').value = '';
  document.getElementById('expense-type').value = '';
  document.getElementById('expense-amount').value = '';
}

//rendering expenses table
function renderExpenses() {
  const tbody = document.getElementById('expense-body');
  tbody.innerHTML = ''; //clears table
  expenses.forEach((item,index)=> {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${item.date}</td>
    <td>${item.name}</td>
    <td>${item.type}</td>
    <td>${item.amount.toFixed(2)}</td>
    <td><button onclick="deleteExpense(${index})">Delete</button></td>`;
    tbody.appendChild(row);
  })
}
// delete item
function deleteExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
  updateOverview();
  updateExpenseGraph();
}

//expense graph
const EXPENSE_COLORS ={
  bills: '#FFEEBC',
  necessity: '#F1B781',
  luxury: '#E86161',
  other: '#EC8888',
}

function updateExpenseGraph() {
  const byType = {bills: 0, necessity:0, luxury:0, other:0};
  expenses.forEach(item => {
    byType[item.type] = (byType[item.type] || 0) + item.amount;
  });

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const maxValue = Math.max(...Object.values(byType), 1);

  const bars = ['bills', 'necessity', 'luxury', 'other'];
  bars.forEach(type => {
    const bar = document.querySelector(`.${type}Bar`);
    const amount = byType[type];
    const height = (amount / maxValue) * BAR_MAX_HEIGHT;

    bar.style.height = `${height}px`;
    bar.style.backgroundColor = EXPENSE_COLORS[type];
    bar.setAttribute('data-amount', `$${amount.toFixed(2)}`);
    bar.setAttribute('data-label', type.charAt(0).toUpperCase() + type.slice(1));
  });

  document.querySelector('h2.Expenses').textContent = `Total: $${totalExpenses.toFixed(2)}`;
}


// INCOME - same as expenses
// adding income to table
function addIncome() {
  const date = document.getElementById('income-date').value;
  const name = document.getElementById('income-name').value;
  const type = document.getElementById('income-type').value;
  const amount = parseFloat(document.getElementById('income-amount').value);

  if (!date || !name || !type || isNaN(amount)) return; //input validation
  
  income.push({ date, name, type, amount });
  renderIncome();                             // ← was missing
  updateOverview();
  updateIncomeGraph();

  document.getElementById('income-date').value = '';
  document.getElementById('income-name').value = '';
  document.getElementById('income-type').value = '';
  document.getElementById('income-amount').value = '';
}

//rendering income table
function renderIncome() {
  const tbody = document.getElementById('income-body');
  tbody.innerHTML = ''; //clears table
  income.forEach((item,index)=> {
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${item.date}</td>
    <td>${item.name}</td>
    <td>${item.type}</td>
    <td>${item.amount.toFixed(2)}</td>
    <td><button onclick="deleteIncome(${index})">Delete</button></td>`;
    tbody.appendChild(row);
  })
}
// delete item
function deleteIncome(index) {
  income.splice(index, 1);
  renderIncome();
  updateOverview();
  updateIncomeGraph();
}

//income graph
const INCOME_COLORS ={
  salary: '#62B28A',
  freelance: '#BDFFE3',
  investments: '#8AE2ED',
  benefits: '#618EE8',
  other: '#3D5BF1',
}

function updateIncomeGraph() {
  const byType = {salary: 0, freelance:0, investments:0, benefits: 0, other:0};
  income.forEach(item => {
    byType[item.type] = (byType[item.type] || 0) + item.amount;
  });

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const maxValue = Math.max(...Object.values(byType), 1);

  const bars = ['salary', 'freelance', 'investments', 'benefits', 'other'];
  bars.forEach(type => {
    const bar = document.querySelector(`.${type}Bar`);
    const amount = byType[type];
    const height = (amount / maxValue) * BAR_MAX_HEIGHT;

    bar.style.height = `${height}px`;
    bar.style.backgroundColor = INCOME_COLORS[type];
    bar.setAttribute('data-amount', `$${amount.toFixed(2)}`);
    bar.setAttribute('data-label', type.charAt(0).toUpperCase() + type.slice(1));
  });

  document.querySelector('h2.Income').textContent = `Total: $${totalIncome.toFixed(2)}`;
}


// OVERVIEW

function getTotals() {
  const totalIncome = income.reduce((sum,item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum,item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;
}

//exporting tables to spreadsheet to save for later
function exportData() {
  const wb = XLSX.utils.book_new();
  const expenseSheet = XLSX.utils.json_to_sheet(expenses);
  const incomeSheet = XLSX.utils.json_to_sheet(income);

  XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expenses');
  XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');

  XLSX.writeFile(wb, 'budget.xlsx');
}

//Importing tables from spreadsheet
function importData(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const workbook = XLSX.read(e.target.result, {type: 'array'});

    expenses = XLSX.utils.sheet_to_json(workbook.Sheets['Expenses']);
    income = XLSX.utils.sheet_to_json(workbook.Sheets['Income']);

    renderExpenses();
    renderIncome();
    updateOverview();
    updateExpenseGraph();
    updateIncomeGraph();
  };

  reader.readAsArrayBuffer(file);
}

//overview graph
function getOverviewData() {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  // categorizing expenses
  const byType = {bills:0, necessity: 0, luxury: 0, other: 0};
  expenses.forEach(item => {
    byType[item.type] = (byType[item.type] || 0) + item.amount;
  });

  const leftover = totalIncome - totalExpenses;
  const isOverspent = totalExpenses > totalIncome;

  return { totalIncome, totalExpenses, byType, leftover, isOverspent};
}

const TYPE_COLORS ={
  bills: '#FFEEBC',
  necessity: '#F1B781',
  luxury: '#E86161',
  other: '#EC8888',
}

function updateOverview(){
  const {totalIncome, totalExpenses, byType, leftover, isOverspent} = getOverviewData()

  // -- income circle
  const incomeEl = document.querySelector('.pieIncome');
  incomeEl.textContent = `$${totalIncome.toFixed(2)}`;

  // -- Expense ring
  const expenseEl = document.querySelector('.pieExpenses');
  const cap = isOverspent ? totalIncome : totalExpenses; //caps this ring at income cap
  let gradient = '';
  let cursor = 0;

  for (const [type, amount] of Object.entries(byType)) {
    if (amount <=0) continue;
    const slice = Math.min(amount, cap - cursor); //breaks off overspending for second ring
    if (slice <=0) break;
    const startPct = (cursor / totalIncome) * 100;
    const endPct = ((cursor + slice) / totalIncome) * 100;
    gradient += `${TYPE_COLORS[type]} ${startPct}% ${endPct}%, `;
    cursor += slice;
  }

  // makes unspent part of ring transparent
  gradient += `transparent ${(cursor / totalIncome) * 100}% 100%`;
  expenseEl.style.background = totalIncome > 0
  ? `conic-gradient(${gradient})`
    : 'transparent';
  
  //  -- overspending ring
  const excessEl = document.querySelector('.pieExcess');
  if (isOverspent && totalIncome > 0) {
    const overAmount = totalExpenses - totalIncome;
    const overPct = Math.min((overAmount / totalIncome) * 100, 100); //cap at full
    excessEl.style.background = `conic-gradient(#B60E1F 0% ${overPct}%, transparent ${overPct}% 100%)`;
  } else {
    excessEl.style.background = 'transparent';
  }
  
  // -- remaining label
  const remainingEl = document.querySelector('.remaining');
  remainingEl.textContent = isOverspent
  ? `Overspent: -$${Math.abs(leftover).toFixed(2)}`
    : `Remaining: $${leftover.toFixed(2)}`;
  remainingEl.style.color = isOverspent ? '#B60E1F' : '#62B26B';
}

window.addExpense = addExpense;
window.addIncome = addIncome;
window.deleteExpense = deleteExpense;
window.deleteIncome = deleteIncome;
window.exportData = exportData;
window.importData = importData;
