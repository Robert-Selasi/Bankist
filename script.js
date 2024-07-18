"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2024-07-17T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2024-07-16T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2024-07-14T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2024-07-15T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2024-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// state values
let currentAccount, timer;
let sorted = false;
// create Usernames for each account
accounts.forEach((acc) => {
  acc.username = acc.owner
    .split(" ")
    .map((n) => n.slice(0, 1).toLowerCase())
    .join("");
});

// Dates and time function
let now = new Date();
// current date format
const currentDateDisplay = function (locale) {
  labelDate.textContent = Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    minute: "numeric",
    hour: "numeric",
  }).format(new Date());
};

// movements date format function
const formatMovementDate = function (dateValue, locale) {
  const date = new Date(dateValue);
  const days = Math.trunc((now - date) / (1000 * 60 * 60 * 24));
  if (days === 0) return `Today`;
  if (days === 1) return `Yesterday`;
  if (days < 7) return `${days} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

// Number format
const formatCurrency = function (number, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(number);
};
// RENDER & DISPLAY MOVEMENTS
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice(0).sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const flag = mov > 0 ? "deposit" : "withdrawal";
    let html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${flag}">${
      i + 1
    } ${flag}</div>
          <div class="movements__date">${formatMovementDate(
            acc.movementsDates[i],
            acc.locale
          )}</div>
          <div class="movements__value">${formatCurrency(
            mov,
            acc.locale,
            acc.currency
          )} </div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// calculate And Display Balance function
const calcAndDisplayBalance = function (acc) {
  const totalBalance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(
    totalBalance,
    acc.locale,
    acc.currency
  )}`;
  return totalBalance;
};

// calculate and display summary
const calcDisplaySummary = function (acc) {
  const depositSum = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, dep) => dep + acc, 0);

  const withdrawalSum = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, withdrawal) => withdrawal + acc, 0);

  //  // interest on deposit must be greater or equal to 1
  const interestSum = acc.movements
    .filter((mov) => mov > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((int, acc) => int + acc, 0);

  labelSumIn.textContent = `${formatCurrency(
    depositSum,
    acc.locale,
    acc.currency
  )}`;
  labelSumOut.textContent = `${formatCurrency(
    withdrawalSum,
    acc.locale,
    acc.currency
  )}`;
  labelSumInterest.textContent = `${formatCurrency(
    interestSum,
    acc.locale,
    acc.currency
  )}`;
};

const updateUI = function (acc) {
  displayMovements(acc, sorted);
  calcAndDisplayBalance(acc);
  calcDisplaySummary(acc);
  currentDateDisplay(acc.locale);
};
// start logout timer function
const startLogOutTimer = function () {
  let time = 120;

  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timeCounter);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = "0";
      document.querySelector(".info").style.opacity = "1";
    }
    time--;
  };

  tick();
  const timeCounter = setInterval(tick, 1000);
  return timeCounter;
};
// Login button event handler
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    containerApp.style.opacity = "1";
    document.querySelector(".info").style.opacity = "0";
  }
});

// user transferring money button event handler
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const totalBalance = calcAndDisplayBalance(currentAccount);
  const transerAccount = accounts.find(
    (acc) => acc.username === `${inputTransferTo.value.toLowerCase()}`
  );

  if (
    transerAccount?.username !== currentAccount.username &&
    amount <= totalBalance &&
    amount > 0
  ) {
    // push amounts into movement arrays
    transerAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
    // create a date and convert to the iso stamp then push to respective movement date arrays
    const dateIso = new Date().toISOString();
    transerAccount.movementsDates.push(dateIso);
    currentAccount.movementsDates.push(dateIso);
    updateUI(currentAccount);
    // clear input fields
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
    // reset counter
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// USER REQUEST LOAN BUTTON EVENT HANDLER
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    currentAccount.movements.some((mov) => mov > loanAmount * 0.1) &&
    loanAmount > 0
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);
      const dateIso = new Date().toISOString();
      currentAccount.movementsDates.push(dateIso);
      updateUI(currentAccount);
    }, 2500);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// CLOSE USER ACCOUNT
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    accounts.splice(
      accounts.findIndex((acc) => acc.username === inputCloseUsername.value)
    );
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = "";
    labelWelcome.textContent = "Log in to get started";
    inputLoginPin.blur();
  }
});

// SORT BUTTON
btnSort.addEventListener("click", function (e) {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
