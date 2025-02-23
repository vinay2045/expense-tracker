const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const chartIcon = document.querySelector(".ri-pie-chart-line");
const chartContainer = document.querySelector('.chart-container');
const clearAllTransactions = document.getElementById('clear-all-transactions');
const barChartIcon = document.querySelector('.ri-bar-chart-line');
const timePeriodSelect = document.getElementById('time-period');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChartInstance;

// Initialize the app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Function to format numbers as currency
function formatCurrency(num) {
  if (num === null || num === undefined) {
    return '₹0.00';
  }
  return '₹' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Function to add transaction

// Function to add transaction
function addTransaction(e) {
  e.preventDefault();

  const incomeValue = income.value.trim();
  const expenseValue = expense.value.trim();

  if (text.value.trim() === '' || (incomeValue === '' && expenseValue === '')) {
    alert('Please add text and amount');
    return;
  }

  let transactionsToAdd = [];

  // If income is entered
  if (incomeValue !== '') {
    const incomeTransaction = {
      id: generateID(),
      text: text.value  ,
      amount: +incomeValue,
      date: getFormattedDateTime()
    };
    transactionsToAdd.push(incomeTransaction);
  }

  // If expense is entered
  if (expenseValue !== '') {
    const expenseTransaction = {
      id: generateID(),
      text: text.value ,
      amount: -expenseValue,
      date: getFormattedDateTime()
    };
    transactionsToAdd.push(expenseTransaction);
  }

  // Check if new balance is valid
  const totalNewAmount = transactionsToAdd.reduce((sum, transaction) => sum + transaction.amount, 0);
  const newBalance = calculateNewBalance(totalNewAmount);

  if (newBalance < 0) {


    alert('Insufficient balance to add these transactions');
    return;
  }

  // Add all transactions
  transactions.push(...transactionsToAdd);
  transactionsToAdd.forEach(addTransactionDOM);

  updateValues();
  updateLocalStorage();

  // Clear input fields
  text.value = '';
  income.value = '';
  expense.value = '';
}


// Function to get formatted date
function getFormattedDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();
  
  return ` ${day} | ${month} | ${year}`;
}


// Function to calculate new balance after a transaction
function calculateNewBalance(amount) {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0);
  return total + amount ;
}

// Function to generate ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Function to add transactions to DOM list
function addTransactionDOM(transaction) {
  const item = document.createElement('li');
  item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');

  // Determine color based on transaction type
  const amountColor = transaction.amount > 0 ? "#2ecc71" : " #c0392b";

  item.innerHTML = `
    <div class="transaction-info">
      <span class="t1name">${transaction.text}</span> 
      <span class="time">${transaction.date}</span>
      <span class="t1amount" style="color: ${amountColor};">${formatCurrency(Math.abs(transaction.amount))}</span>
    </div>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.insertBefore(item, list.firstChild);
}


// Function to update balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);
  

  balance.innerText = `|₹${total }|`;
  money_plus.innerText = `₹${income}`;
  money_minus.innerText = `₹${expense}`;
}

// Function to remove transaction by ID
// tracker/static/tracker/script.js
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Function to update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


// // Function to update the bar chart based on the selected time period
// function updateBarChart(timePeriod) {
 
//   const ctx = document.getElementById('transactionChart').getContext('2d');
  
//   if (myChartInstance) {
//     myChartInstance.destroy();
//   }

//   let labels = [];
//   let data = [];

//   if (timePeriod === 'daily') {
//     const dailyTransactions = groupTransactionsByDay(transactions);
//     labels = Object.keys(dailyTransactions);
//     data = Object.values(dailyTransactions);
//   } else if (timePeriod === 'monthly') {
//     const monthlyTransactions = groupTransactionsByMonth(transactions);
//     labels = Object.keys(monthlyTransactions);
//     data = Object.values(monthlyTransactions);
//   } else if (timePeriod === 'yearly') {
//     const yearlyTransactions = groupTransactionsByYear(transactions);
//     labels = Object.keys(yearlyTransactions);
//     data = Object.values(yearlyTransactions);
//   }

//   myChartInstance = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Transactions',
//         data: data,
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });
// }

// // Function to group transactions by day
// function groupTransactionsByDay(transactions) {
//   const dailyTransactions = {};

//   transactions.forEach(transaction => {
//     const date = transaction.date.split(' ')[0];
//     if (!dailyTransactions[date]) {
//       dailyTransactions[date] = 0;
//     }
//     dailyTransactions[date] += transaction.amount;
//   });

//   return dailyTransactions;
// }

// // Function to group transactions by month
// function groupTransactionsByMonth(transactions) {
//   const monthlyTransactions = {};

//   transactions.forEach(transaction => {
//     const [day, month, year] = transaction.date.split(' ')[0].split('/');
//     const monthYear = `${month}-${year}`;
//     if (!monthlyTransactions[monthYear]) {
//       monthlyTransactions[monthYear] = 0;
//     }
//     monthlyTransactions[monthYear] += transaction.amount;
//   });

//   return monthlyTransactions;
// }

// // Function to group transactions by year
// function groupTransactionsByYear(transactions) {
//   const yearlyTransactions = {};

//   transactions.forEach(transaction => {
//     const year = transaction.date.split(' ')[0].split('/')[2];
//     if (!yearlyTransactions[year]) {
//       yearlyTransactions[year] = 0;
//     }
//     yearlyTransactions[year] += transaction.amount;
//   });

//   return yearlyTransactions;
// }

// Function to clear all transactions
function clearAllTransactionsFunc() {
  transactions = [];
  updateLocalStorage();
  init();
}

clearAllTransactions.addEventListener('click', () => {
  const confirmed = confirm('Are you sure you want to clear all transactions?');
  if (confirmed) {
    clearAllTransactionsFunc();
  }
});

// Event listeners
form.addEventListener('submit', addTransaction);


init();
