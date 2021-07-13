'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let selectedAccount;
let sorted = false;
const displayMovements = (account, sort = false) => {
  const sortedMovements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  containerMovements.innerHTML = '';
  sortedMovements.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const itemHtml = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${movement}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', itemHtml);
  });
}

const calculateDisplayBalance = (account) => {
  const balance = account.movements.reduce(function (acc, movement) {
    return acc + movement;
  }, 0)
  account.balance = balance;
  labelBalance.textContent = `Rs.${balance}`;
}

const createUsername = (accounts) => {
  accounts.forEach((account, i) => {
    account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}

const calculateInAndOut = (account) => {
  const income = account.movements.filter(movement => movement > 0)
    .reduce((acc, movement) => acc + movement);
  const outcome = account.movements.filter(movement => movement < 0)
    .reduce((acc, movement) => acc + movement);
  const interest = account.movements.filter(movement => movement > 0)
    .map(movement => (movement * account.interestRate) / 100)
    .reduce((acc, movement) => acc + movement, 0);
  labelSumIn.textContent = `Rs. ${Math.abs(income)}`;
  labelSumOut.textContent = `Rs. ${Math.abs(outcome)}`;
  labelSumInterest.textContent = `Rs. ${Math.round(interest)}`;
}

const updateAccountDetails = (account) => {
  displayMovements(account);
  calculateDisplayBalance(account);
  calculateInAndOut(account);
}

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  selectedAccount = accounts.find(account => inputLoginUsername.value === account.username);
  if (selectedAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = '100';
    labelWelcome.textContent = `Welcome ${selectedAccount.owner.split(' ')[0]}`;
    updateAccountDetails(selectedAccount);
  } else {
    alert('Account does not exist');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferToAccount = accounts.find(account => inputTransferTo.value === account.username);
  if (amount > 0 &&
    transferToAccount &&
    amount < selectedAccount.balance &&
    selectedAccount.username !== transferToAccount.username) {
    selectedAccount.movements.push(-amount);
    transferToAccount.movements.push(amount);
    updateAccountDetails(selectedAccount);
  } else {
    alert('Please enter valid amount');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(inputCloseUsername.value);
  console.log(inputClosePin.value);
  console.log(selectedAccount.username);
  if (inputCloseUsername.value === selectedAccount.username &&
    Number(inputClosePin.value) === selectedAccount.pin) {
    const index = accounts.findIndex(function (account) {
      return account.username === selectedAccount.username;
    })
    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
  } else {
    alert('Wrong credentials');
  }
});

// other way to sort (witout passing sorted in function)
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   const movements = selectedAccount.movements.sort(function (a, b) {
//     if (sorted) {
//       return b - a;
//     } else {
//       return a - b;
//     }
//   });
//   displayMovements(selectedAccount);
//   sorted = !sorted;
// });

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(selectedAccount, !sorted);
  sorted = !sorted;
});

createUsername(accounts);