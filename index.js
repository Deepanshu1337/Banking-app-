// Dummy data
console.log("connected");
const account1 = {
  owner: "Deepanshu Dixit",
  movements: [200, -450, 400, -300, 500, -200, 500, -1000],
  interestRate: 1.2,
  pin: 6342,
};

const account2 = {
  owner: "Raghu Kishore",
  movements: [-100, 300, -500, 400, -200, 1000, -150, 200],
  interestRate: 1.1,
  pin: 7890,
};
const account3 = {
  owner: "Suresh Kumar",
  movements: [1000, -200, 300, -500, 200, -100, 400, -200],
  interestRate: 1.3,
  pin: 1234,
};
const account4 = {
  owner: "Ankita Garg",
  movements: [-100, 200, -300, 400, -500, 100, 200, -100],
  interestRate: 1.15,
  pin: 5678,
};

const accounts = [account1, account2, account3, account4];

// Elements selectors

const lebelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const lebelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const lableSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movement");

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
const inputCloseUsername = document.querySelector(".form__input---user");
const inputClosePin = document.querySelector(".form__input---pin");

const displayMovements = function (account) {
  containerMovements.innerHTML = "";
  account.movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movement__row">
                <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
                <div class="movement__value">${mov} EUR </div>
            </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
displayMovements(account1);


const createUserName = function (accounts) {
  accounts.forEach(function (accs) {
    accs.userName = accs.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);


const calDisplayBalance = function (acc) {
  let balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  lebelBalance.innerText = `${balance} EUR`;
};
calDisplayBalance(account1);


const calDisplaySummary = function (account) {
    const income = account.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => mov + acc,0);
    labelSumIn.innerText = `${income} EUR`


    const out = account.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.innerText = `${out} EUR`;

    const interest = account.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * account.interestRate) / 100)
        .filter(interest => interest > 0)
        .reduce((acc, interest) => acc + interest, 0);
    lableSumInterest.innerText = `${interest.toFixed(2)} EUR`
    
    
}

calDisplaySummary(account1);
