// --------------------------------------------------------------------------------Dummy data--------------------------------------------------------------------------------

let logoutTime = 5 
let logOut = false;
console.log(logoutTime);

const account1 = {
  owner: 'Deepanshu Dixit',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 6342,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2024-06-28T23:36:17.929Z',
    '2024-06-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Ravi Gupta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2024-06-28T23:36:17.929Z',
    '2024-06-27T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// ----------------------------------------------------------------------Elements selectors------------------------------------------------------------------------
const app = document.querySelector('.app');
const lebelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const lebelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movement');

const loginBtns = document.getElementById('login_btns')
const logOutBtn = document.getElementById('logout_btn');
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

//---------------------------------------------------------------------------- UPDATING UI ---------------------------------------------------------------------------------

const updatUi = function (acc) {
  displayTransactions(acc);
  calDisplayBalance(acc);
  calDisplaySummary(acc);
};

//------------------------------------------------------------------------USERNAME CREATION-------------------------------------------------------------------------------------

const createUserName = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
window.onload = createUserName(accounts);
//-----------------------------------------------------------------------FORMATTING FUNCTIONS FOR CURRENCY AND DATE ACCORDING TO LOCALE OF USER---------------------------

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency
  }).format(value)
}

const formatDate = function (value, locale) {
  return new Intl.DateTimeFormat(locale, {
    weekday:"long",
    day: "numeric",
    month: "numeric",
    year:"numeric",
    hours: "numeric",
    minutes: "numeric",
  }).format(value);
};

//----------------------------------------------------------------------  DISPLAY TRANSACTON---------------------------------------------------------------------------------

const displayTransactions = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //------------------------------------------------------------------------
    const transactionDate = new Date(acc.movementsDates[i]);

    const formatMovementDate = function (d) {
      const calculateDaysPassed = (date1, date2) =>
        Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

      const daysPassed = calculateDaysPassed(new Date(), d);

      if (daysPassed === 0) return 'Today';
      if (daysPassed === 1) return 'Yesterday';
      if (daysPassed <= 7) return `${daysPassed} days ago`;
      else {
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const date = `${d.getDate()}`.padStart(2, 0);
        return `${date}/${month}/${year}`;
      }
    };

    const dateCorrect = formatMovementDate(transactionDate);

    //--------------------------------------------------------------------------------
    const html = `<div class="movement__row">
                <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
                <div class="movement__date">${dateCorrect} </div>
                <div class="movement__value">${formatCurrency(mov.toFixed(2),acc.locale,acc.currency)} </div>
            </div>`;
    //${mov.toFixed(2)}€

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



//---------------------------------------------------------------------------DISPLAY TOTAL BALANCE----------------------------------------------------------------------------------

const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  lebelBalance.textContent = formatCurrency(acc.balance.toFixed(2), acc.locale, acc.currency);
};

// -------------------------------------------------------------------------DISPLAY SUMMARY------------------------------------------------------------------------------

const calDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.innerText = formatCurrency(income.toFixed(2),acc.locale,acc.currency);
  

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.innerText =  formatCurrency(out.toFixed(2),acc.locale,acc.currency);
  
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interest => interest > 0)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.innerText = formatCurrency(interest.toFixed(2),acc.locale,acc.currency);;
};
//----------------------------------------------------------------LOGOUT TIMER FUNCTION----------------------------------------------------------------

const startLogoutTimer = function () {
  let time = logoutTime * 60;
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;
    
    time--;
    if (time === 0 || logOut == true) {
      clearInterval(timer);
      logout();
    }
    
  }
  tick();
  const timer = setInterval(tick, 1000);
}
//------------------------------------------------------------------------LOGIN IMPLIMENTATION-----------------------------------------------------------------------------

let currentAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  //date implimentation
  const dateNow = new Date();
  // const year = dateNow.getFullYear();
  // const month = `${dateNow.getMonth() + 1}`.padStart(2, '0');
  // const date = `${dateNow.getDate()}`.padStart(2, 0);
  // const hrs = `${dateNow.getHours()}`.padStart(2, 0);
  // const mins = `${dateNow.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${date}/${month}/${year}, ${hrs}:${mins}`;
labelDate.textContent = formatDate(dateNow,currentAcc.locale)
  if (currentAcc == undefined) {
    console.log('Invalid User');
    inputLoginUsername.value = inputLoginPin.value = '';
    return;
  } else if (currentAcc.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = '';
     inputLoginUsername.disabled = inputLoginPin.disabled = true;
    app.style.opacity = 1;

    lebelWelcome.innerText = `Welcome back, ${currentAcc.owner.split(' ')[0]}😊`;
    logOut = false;
    startLogoutTimer();

    loginBtns.classList.toggle("hide");
    logOutBtn.classList.toggle("hide");
    updatUi(currentAcc);
  }
});

//------------------------------------------------------------------------LOGOUT IMPLIMENTATION-----------------------------------------------------------------------------


//------------------------------------------------------------------------LOGOUT IMPLIMENTATION-----------------------------------------------------------------------------
logOutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  logout();
  loginBtns.classList.toggle('hide');
  logOutBtn.classList.toggle('hide');
  
})
const logout = function () { 
  app.style.opacity = 0;
  currentAcc = null;
  inputLoginUsername.disabled = inputLoginPin.disabled = false;
  lebelWelcome.innerText = 'Log in to get started';
  lebelBalance.textContent = '';
  labelSumIn.textContent = '';
  labelSumOut.textContent = '';
  labelSumInterest.textContent = '';
  inputLoginUsername.value = inputLoginPin.value = '';
  containerMovements.innerHTML = '';
  logOut = true;
}

//-----------------------------------------------------------------------------OPERATIONS LOGIC -----------------------------------------------------------------------------

// transfer money 
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  function transferMoney() {
    const amount = +inputTransferAmount.value;
    const recieverAcc = accounts.find(
      acc => acc.userName === inputTransferTo.value
    );

    if (
      amount > 0 &&
      amount <= currentAcc.balance &&
      recieverAcc &&
      currentAcc.userName !== recieverAcc.userName
    ) {
      inputTransferAmount.value = inputTransferTo.value = '';
      currentAcc.movements.push(-amount);
      recieverAcc.movements.push(amount);
      currentAcc.movementsDates.push(new Date().toISOString());
      recieverAcc.movementsDates.push(new Date().toISOString());
      updatUi(currentAcc);
    }
  }
  setTimeout(transferMoney, 1000);
});

//loan 
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  function loan() {
    if (
      +inputLoanAmount.value > 0 &&
      currentAcc.movements.some(mov => mov >= +inputLoanAmount.value * 0.1)
    ) {
      currentAcc.movements.push(+inputLoanAmount.value);
      currentAcc.movementsDates.push(`${new Date().toISOString()}`);
      updatUi(currentAcc);

      inputLoanAmount.value = '';
    } else {
      console.log('loan is not approved');
    }
  }
  
  setInterval(loan, 2000);
});

//close account 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  function closeAccount() {
    
  if (
    inputCloseUsername.value === currentAcc.userName &&
    +inputClosePin.value === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAcc.userName
    );
    app.style.opacity = 0;
    accounts.splice(index, 1);
    lebelWelcome.innerText = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
  }
   loginBtns.classList.toggle('hide');
   logOutBtn.classList.toggle('hide');
  setTimeout(closeAccount, 2000);
});



