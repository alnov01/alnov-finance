import "./style.css";

const accounts = [
  ["BCA 029",4964028],["BLU 908",1936056],["BLU 927",5560073],["BNI 834",305701],
  ["BNI 198",129879],["BSI 072",17467267],["BSI 115",13145909],["BTN 160",0],
  ["DANA 444",237950],["DANA 111",17472],["JAGO 100",9792],["MANDIRI 138",100000],
  ["MANDIRI 146",354576],["CASH",0]
];

const pots = [
  ["Big Purchases",16000000,5245909],
  ["Education",1500000,650000],
  ["Eid",3500000,1197700],
  ["Emergency Fund",48000000,1936056],
  ["Healthcare",15000000,5674015],
  ["House",100000000,4923436],
  ["Ibadah",3500000,1475930],
  ["Kids",536000000,11067901],
  ["Pension",0,0],
  ["Tax & Services",3000000,2246363],
  ["Travel",50000000,7900000],
  ["Gold",50,10],
  ["SBN",0,20000000],
  ["SGD",0,92],
  ["KRW",0,150000],
  ["Other Investment",0,0]
];

const categories = [
  "Admin & Bank Fees",
  "Eid & Seasonal",
  "Education",
  "Giving & Religious",
  "Groceries",
  "Healthcare",
  "Household & Utilities",
  "Kids",
  "Lifestyle & Sport",
  "Loan",
  "Meals & Drinks",
  "Others",
  "Parents & Family",
  "Personal Care",
  "Shopping",
  "Subscription & Digital",
  "Tax & Service",
  "Travel",
  "Vehicles",
  "Formal Salary",
  "Other Variable Income",
  "Consulting / Project"
];

/* =========================================================
   DATA JANUARI - AGUSTUS
   Angka di bawah berasal dari workbook ALNOV FINANCE 2026.
   Untuk mengganti angka real nanti, bagian ini yang diedit.
   ========================================================= */

const dummyTransactions = [

  // ================= JANUARY =================

  {date:"2026-01-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:7970000,member:"Household",account:""},
  {date:"2026-01-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:1410387,member:"Household",account:""},

  {date:"2026-01-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:35151,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Eid & Seasonal",category:"Eid & Seasonal",amount:1245000,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:51000,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Groceries",category:"Groceries",amount:1170590,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Healthcare",category:"Healthcare",amount:745000,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:634480,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Kids",category:"Kids",amount:250000,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:85000,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:2319120,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Others",category:"Others",amount:9032910,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:281840,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Shopping",category:"Shopping",amount:1089480,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Subscription & Digital",category:"Subscription & Digital",amount:46000,member:"Household",account:""},
  {date:"2026-01-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:2704940,member:"Household",account:""},

  {date:"2026-01-01",type:"Allocation",description:"Saving",category:"Saving",amount:3800000,member:"Household",account:""},


  // ================= FEBRUARY =================

  {date:"2026-02-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:7381800,member:"Household",account:""},
  {date:"2026-02-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:2946187,member:"Household",account:""},

  {date:"2026-02-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:50335,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Eid & Seasonal",category:"Eid & Seasonal",amount:750000,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:82000,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Groceries",category:"Groceries",amount:174800,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Healthcare",category:"Healthcare",amount:4948650,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:596000,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Kids",category:"Kids",amount:10843500,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:1170000,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:1262500,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Others",category:"Others",amount:1851380,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:170000,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Shopping",category:"Shopping",amount:1278960,member:"Household",account:""},
  {date:"2026-02-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:550000,member:"Household",account:""},


  // ================= MARCH =================

  {date:"2026-03-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:13557000,member:"Household",account:""},
  {date:"2026-03-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:7221247,member:"Household",account:""},

  {date:"2026-03-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:44500,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Eid & Seasonal",category:"Eid & Seasonal",amount:625000,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:653112,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Groceries",category:"Groceries",amount:140000,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Healthcare",category:"Healthcare",amount:1090430,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:1720598,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Kids",category:"Kids",amount:1472230,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:100000,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Loan",category:"Loan",amount:1950000,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:2531300,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Others",category:"Others",amount:4947050,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:319000,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Shopping",category:"Shopping",amount:260679,member:"Household",account:""},
  {date:"2026-03-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:550000,member:"Household",account:""},

  {date:"2026-03-01",type:"Allocation",description:"Saving",category:"Saving",amount:2244000,member:"Household",account:""},


  // ================= APRIL =================

  {date:"2026-04-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:11270000,member:"Household",account:""},
  {date:"2026-04-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:1483137,member:"Household",account:""},

  {date:"2026-04-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:38000,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Eid & Seasonal",category:"Eid & Seasonal",amount:634399,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Education",category:"Education",amount:1000000,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Groceries",category:"Groceries",amount:1102500,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Healthcare",category:"Healthcare",amount:118044,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:669965,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Kids",category:"Kids",amount:34900,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:393400,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Loan",category:"Loan",amount:1900000,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:2546400,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Others",category:"Others",amount:1393400,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:280000,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Shopping",category:"Shopping",amount:1393120,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Travel",category:"Travel",amount:40000,member:"Household",account:""},
  {date:"2026-04-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:2525000,member:"Household",account:""},

  {date:"2026-04-01",type:"Allocation",description:"Saving",category:"Saving",amount:8113044,member:"Household",account:""},


  // ================= MAY =================

  {date:"2026-05-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:16960750,member:"Household",account:""},

  {date:"2026-05-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:62000,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:9886000,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:861630,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Kids",category:"Kids",amount:751461,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:315000,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Loan",category:"Loan",amount:1720000,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:1896520,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Others",category:"Others",amount:4287220,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:200000,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Shopping",category:"Shopping",amount:834055,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Travel",category:"Travel",amount:200000,member:"Household",account:""},
  {date:"2026-05-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:2157000,member:"Household",account:""},

  {date:"2026-05-01",type:"Allocation",description:"Saving",category:"Saving",amount:118400,member:"Household",account:""},


  // ================= JUNE =================

  {date:"2026-06-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:15327800,member:"Household",account:""},
  {date:"2026-06-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:12859710,member:"Household",account:""},

  {date:"2026-06-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:73000,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Education",category:"Education",amount:175000,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:8376540,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Groceries",category:"Groceries",amount:773300,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:1065706,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Kids",category:"Kids",amount:701000,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:365100,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Loan",category:"Loan",amount:1950000,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:3348800,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Others",category:"Others",amount:694068,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:1554900,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Shopping",category:"Shopping",amount:1667000,member:"Household",account:""},
  {date:"2026-06-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:4866400,member:"Household",account:""},

  {date:"2026-06-01",type:"Allocation",description:"Saving",category:"Saving",amount:11600000,member:"Household",account:""},


  // ================= JULY =================

  {date:"2026-07-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:10447600,member:"Household",account:""},
  {date:"2026-07-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:12413240,member:"Household",account:""},

  {date:"2026-07-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:1500,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:344000,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Groceries",category:"Groceries",amount:1300500,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Healthcare",category:"Healthcare",amount:266037,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:1060430,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Kids",category:"Kids",amount:1291670,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:50000,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Loan",category:"Loan",amount:1950000,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:2350370,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Others",category:"Others",amount:50000,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:1299000,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Shopping",category:"Shopping",amount:563629,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Tax & Service",category:"Tax & Service",amount:45000,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Travel",category:"Travel",amount:1088680,member:"Household",account:""},
  {date:"2026-07-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:4142250,member:"Household",account:""},

  {date:"2026-07-01",type:"Allocation",description:"Saving",category:"Saving",amount:11891187,member:"Household",account:""},


  // ================= AUGUST =================

  {date:"2026-08-01",type:"Income",description:"Formal Salary",category:"Formal Salary",amount:10005560,member:"Household",account:""},
  {date:"2026-08-01",type:"Income",description:"Variable Income",category:"Other Variable Income",amount:6504075,member:"Household",account:""},

  {date:"2026-08-01",type:"Expense",description:"Admin & Bank Fees",category:"Admin & Bank Fees",amount:52000,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Giving & Religious",category:"Giving & Religious",amount:150000,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Groceries",category:"Groceries",amount:343600,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Household & Utilities",category:"Household & Utilities",amount:2182280,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Kids",category:"Kids",amount:94924,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Lifestyle & Sport",category:"Lifestyle & Sport",amount:27000,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Loan",category:"Loan",amount:1950000,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Meals & Drinks",category:"Meals & Drinks",amount:2474900,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Others",category:"Others",amount:3246000,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Personal Care",category:"Personal Care",amount:458000,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Shopping",category:"Shopping",amount:2744420,member:"Household",account:""},
  {date:"2026-08-01",type:"Expense",description:"Vehicles",category:"Vehicles",amount:1766000,member:"Household",account:""},

  {date:"2026-08-01",type:"Allocation",description:"Saving",category:"Saving",amount:8083899,member:"Household",account:""},


  // ================= SEPTEMBER =================
  // Data September yang sebelumnya sudah ada

  {date:"2026-09-01",type:"Income",description:"UNTAN",category:"Formal Salary",amount:3952600,member:"Novia",account:"BNI 198"},
  {date:"2026-09-01",type:"Expense",description:"Botol Susu Avent PPSU 260",category:"Kids",amount:287310,member:"Novia",account:"BNI 198"},
  {date:"2026-09-02",type:"Expense",description:"Groceries",category:"Groceries",amount:420000,member:"Ali",account:"BCA 029"},
  {date:"2026-09-03",type:"Expense",description:"Electricity & utilities",category:"Household & Utilities",amount:560000,member:"Ali",account:"BLU 908"},
  {date:"2026-09-05",type:"Income",description:"Consulting Project",category:"Consulting / Project",amount:2100000,member:"Novia",account:"MANDIRI 138"},
  {date:"2026-09-06",type:"Expense",description:"Family meal",category:"Meals & Drinks",amount:350000,member:"Ali",account:"CASH"},
  {date:"2026-09-08",type:"Expense",description:"Healthcare",category:"Healthcare",amount:275000,member:"Novia",account:"BSI 072"},
  {date:"2026-09-10",type:"Expense",description:"Subscription",category:"Subscription & Digital",amount:99000,member:"Ali",account:"DANA 444"}
];


/* ========================================================= */

let state = {
  user:null,
  month:"September",
  year:2026,
  transactions:[...dummyTransactions],
  page:"dashboard"
};

const money = n =>
  new Intl.NumberFormat("id-ID",{
    style:"currency",
    currency:"IDR",
    maximumFractionDigits:0
  }).format(n);

const monthNum = {
  January:1,
  February:2,
  March:3,
  April:4,
  May:5,
  June:6,
  July:7,
  August:8,
  September:9,
  October:10,
  November:11,
  December:12
};

function metrics(){

  const tx = state.transactions.filter(t =>
    t.date.startsWith(
      `${state.year}-${String(monthNum[state.month]).padStart(2,"0")}`
    )
  );

  const income = tx
    .filter(t=>t.type==="Income")
    .reduce((a,t)=>a+t.amount,0);

  const expense = tx
    .filter(t=>t.type==="Expense")
    .reduce((a,t)=>a+t.amount,0);

  const allocation = tx
    .filter(t=>t.type==="Allocation")
    .reduce((a,t)=>a+t.amount,0);

  const net = income-expense-allocation;

  const savings = income
    ? Math.round((net/income)*100)
    : 0;

  let health =
    50 +
    (net>=0 ? 20 : 0) +
    (savings>=20 ? 20 : savings>=10 ? 10 : 0);

  return {
    tx,
    income,
    expense,
    allocation,
    net,
    savings,
    health:Math.max(0,Math.min(100,health))
  };
}

function groupByCategory(tx,type){

  const m={};

  tx
    .filter(t=>t.type===type)
    .forEach(t=>{
      const key=t.category || t.description || "Others";
      m[key]=(m[key]||0)+t.amount;
    });

  return Object
    .entries(m)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);
}

function card(title,value,sub=""){

  return `
    <div class="stat">
      <div class="stat-title">${title}</div>
      <div class="stat-value">${value}</div>
      <div class="stat-sub">${sub}</div>
    </div>
  `;
}

function app(){

  if(!state.user)
    return login();

  document.querySelector("#root").innerHTML=`

    <div class="shell">

      <aside class="sidebar">

        <div class="brand">
          <div class="logo">♡</div>
          <div>
            <b>ALNOV</b>
            <span>Household Finance</span>
          </div>
        </div>

        <button
          class="nav ${state.page==="dashboard"?"active":""}"
          data-page="dashboard">
          ⌂ <span>Dashboard</span>
        </button>

        <button
          class="nav ${state.page==="transactions"?"active":""}"
          data-page="transactions">
          ↕ <span>Transactions</span>
        </button>

        <button
          class="nav ${state.page==="pots"?"active":""}"
          data-page="pots">
          ♡ <span>Saving Pots</span>
        </button>

        <button
          class="nav ${state.page==="accounts"?"active":""}"
          data-page="accounts">
          ▣ <span>Accounts</span>
        </button>

        <div class="sidebar-bottom">

          <div class="member">
            <span class="avatar">${state.user[0]}</span>

            <div>
              <b>${state.user}</b>
              <small>Household member</small>
            </div>
          </div>

          <button id="logout" class="logout">
            Log out
          </button>

        </div>

      </aside>

      <main class="main">

        <header>

          <div>

            <p class="eyebrow">
              GOOD MORNING, ${state.user.toUpperCase()} ♡
            </p>

            <h1>
              ${
                state.page==="dashboard"
                ? "Your money, made calmer."
                : state.page[0].toUpperCase()+state.page.slice(1)
              }
            </h1>

          </div>

          <button class="add" id="add">
            ＋ Add transaction
          </button>

        </header>

        ${
          state.page==="dashboard"
          ? dashboard()
          : state.page==="transactions"
          ? transactions()
          : state.page==="pots"
          ? potsPage()
          : accountsPage()
        }

      </main>

    </div>
  `;

  bind();
}

function login(){

  document.querySelector("#root").innerHTML=`

    <div class="login-wrap">

      <div class="login-card">

        <div class="logo big">♡</div>

        <p class="eyebrow">
          ALNOV FINANCE
        </p>

        <h1>
          Welcome home.
        </h1>

        <p class="muted">
          A calm, private space for Ali & Novia
          to manage household money.
        </p>

        <div class="login-buttons">

          <button data-login="Ali">
            Continue as Ali
          </button>

          <button data-login="Novia">
            Continue as Novia
          </button>

        </div>

        <p class="demo">
          Demo mode · workbook data
        </p>

      </div>

    </div>
  `;

  document
    .querySelectorAll("[data-login]")
    .forEach(b=>{
      b.onclick=()=>{
        state.user=b.dataset.login;
        app();
      };
    });
}

function dashboard(){

  const m=metrics();

  const spend=groupByCategory(m.tx,"Expense");
  const inc=groupByCategory(m.tx,"Income");

  return `

    <section class="monthbar">

      <div>

        <span>MONTH</span>

        <select id="month">

          ${
            Object.keys(monthNum)
              .map(x=>
                `<option ${
                  x===state.month
                  ?"selected"
                  :""
                }>${x}</option>`
              )
              .join("")
          }

        </select>

        <select id="year">
          <option>2026</option>
        </select>

      </div>

      <div class="pill">
        ● Workbook data
      </div>

    </section>


    <div class="stats">

      ${card(
        "Income",
        money(m.income),
        "This month"
      )}

      ${card(
        "Net expense",
        money(m.expense),
        "After essential spending"
      )}

      ${card(
        "Net cash flow",
        money(m.net),
        m.net>=0
        ? "You are in the green"
        : "Needs attention"
      )}

      ${card(
        "Savings rate",
        m.savings+"%",
        "Target: 20%+"
      )}

    </div>


    <div class="grid">

      <div class="panel health">

        <div class="panel-head">

          <div>

            <span class="label">
              FINANCIAL HEALTH
            </span>

            <h2>
              ${m.health}
              <small>/100</small>
            </h2>

          </div>

          <div
            class="health-ring"
            style="--p:${m.health*3.6}deg">
          </div>

        </div>

        <p>

          ${
            m.health>=80
            ? "Looking healthy. Your money has breathing room."
            : m.health>=60
            ? "Pretty steady. There is room to strengthen your buffer."
            : "Let's create a little more breathing room this month."
          }

        </p>

        <div class="progress">
          <i style="width:${m.health}%"></i>
        </div>

      </div>


      <div class="panel">

        <div class="panel-head">

          <div>

            <span class="label">
              MONTHLY VIEW
            </span>

            <h3>
              ${state.month} 2026
            </h3>

          </div>

          <span class="trend">
            Household
          </span>

        </div>

        <div class="compare">

          <div>

            <span>Income</span>

            <b>
              ${money(m.income)}
            </b>

            <i
              style="width:${Math.min(
                100,
                m.income/(m.income+m.expense||1)*100
              )}%">
            </i>

          </div>

          <div>

            <span>Expense</span>

            <b>
              ${money(m.expense)}
            </b>

            <i
              style="width:${Math.min(
                100,
                m.expense/(m.income+m.expense||1)*100
              )}%">
            </i>

          </div>

        </div>

      </div>

    </div>


    <div class="grid three">

      ${listPanel("Top spending",spend)}

      ${listPanel("Top income",inc)}


      <div class="panel">

        <div class="panel-head">

          <div>

            <span class="label">
              ALLOCATIONS
            </span>

            <h3>
              This month
            </h3>

          </div>

        </div>

        <div class="mini-row">

          <span>
            Saving / investment
          </span>

          <b>
            ${money(m.allocation)}
          </b>

        </div>

        <div class="mini-row">

          <span>
            Net cash flow
          </span>

          <b>
            ${money(m.net)}
          </b>

        </div>

      </div>

    </div>


    <div class="panel">

      <div class="panel-head">

        <div>

          <span class="label">
            SAVING POTS
          </span>

          <h3>
            Goals in progress
          </h3>

        </div>

        <button
          class="text-btn"
          data-page="pots">
          See all →
        </button>

      </div>


      <div class="pots">

        ${
          pots
            .slice(0,5)
            .map(p=>`

              <div class="pot">

                <div class="pot-icon">
                  ♡
                </div>

                <div class="pot-info">

                  <div>

                    <b>
                      ${p[0]}
                    </b>

                    <span>
                      ${money(p[2])}
                      /
                      ${money(p[1])}
                    </span>

                  </div>

                  <div class="progress">

                    <i
                      style="width:${
                        p[1]
                        ? Math.min(
                            100,
                            p[2]/p[1]*100
                          )
                        : 0
                      }%">
                    </i>

                  </div>

                </div>

              </div>

            `)
            .join("")
        }

      </div>

    </div>

  `;
}

function listPanel(title,items){

  return `

    <div class="panel">

      <div class="panel-head">

        <div>

          <span class="label">
            ${title.toUpperCase()}
          </span>

          <h3>
            By category
          </h3>

        </div>

      </div>

      ${
        items
          .map(([k,v])=>`

            <div class="rank">

              <span class="dot"></span>

              <div>

                <b>
                  ${k}
                </b>

                <small>
                  ${money(v)}
                </small>

              </div>

              <em>
                ${
                  Math.round(
                    v/(items[0]?.[1]||1)*100
                  )
                }%
              </em>

            </div>

          `)
          .join("")
          ||
          `<p class="muted">
            No data yet.
          </p>`
      }

    </div>

  `;
}

function transactions(){

  const m=metrics();

  return `

    <div class="panel">

      <div class="panel-head">

        <div>

          <span class="label">
            TRANSACTION DATABASE
          </span>

          <h3>
            ${m.tx.length} transactions
          </h3>

        </div>

        <button
          class="add small"
          id="add2">
          ＋ Add
        </button>

      </div>


      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Category</th>
              <th>Member</th>
              <th>Amount</th>
            </tr>

          </thead>

          <tbody>

            ${
              m.tx
                .map(t=>`

                  <tr>

                    <td>
                      ${t.date}
                    </td>

                    <td>

                      <span
                        class="type ${t.type.toLowerCase()}">
                        ${t.type}
                      </span>

                    </td>

                    <td>
                      ${t.description}
                    </td>

                    <td>
                      ${t.category||"—"}
                    </td>

                    <td>
                      ${t.member}
                    </td>

                    <td
                      class="${
                        t.type==="Expense"
                        ? "negative"
                        : "positive"
                      }">

                      ${
                        t.type==="Expense"
                        ? "−"
                        : "+"
                      }${money(t.amount)}

                    </td>

                  </tr>

                `)
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>

  `;
}

function potsPage(){

  return `

    <div class="panel">

      <div class="panel-head">

        <div>

          <span class="label">
            SAVING & INVESTMENT POTS
          </span>

          <h3>
            Goals & reserves
          </h3>

        </div>

      </div>


      <div class="pots-grid">

        ${
          pots
            .map(p=>`

              <div class="goal">

                <div class="pot-icon">
                  ♡
                </div>

                <b>
                  ${p[0]}
                </b>

                <strong>
                  ${money(p[2])}
                </strong>

                <small>
                  Target ${
                    p[1]
                    ? money(p[1])
                    : "—"
                  }
                </small>

                <div class="progress">

                  <i
                    style="width:${
                      p[1]
                      ? Math.min(
                          100,
                          p[2]/p[1]*100
                        )
                      : 0
                    }%">
                  </i>

                </div>

              </div>

            `)
            .join("")
        }

      </div>

    </div>

  `;
}

function accountsPage(){

  return `

    <div class="panel">

      <div class="panel-head">

        <div>

          <span class="label">
            ACCOUNTS
          </span>

          <h3>
            ${accounts.length} accounts
          </h3>

        </div>

      </div>


      <div class="account-grid">

        ${
          accounts
            .map(a=>`

              <div class="account">

                <span>
                  ▣
                </span>

                <div>

                  <b>
                    ${a[0]}
                  </b>

                  <small>
                    System balance
                  </small>

                </div>

                <strong>
                  ${money(a[1])}
                </strong>

              </div>

            `)
            .join("")
        }

      </div>

    </div>

  `;
}

function modal(){

  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        class="modal-bg"
        id="modal">

        <form class="modal">

          <button
            type="button"
            class="close"
            id="close">
            ×
          </button>

          <span class="label">
            NEW TRANSACTION
          </span>

          <h2>
            Add to your household
          </h2>

          <label>
            Type

            <select name="type">

              <option>
                Expense
              </option>

              <option>
                Income
              </option>

              <option>
                Allocation
              </option>

            </select>

          </label>


          <label>
            Date

            <input
              name="date"
              type="date"
              value="2026-09-12">
          </label>


          <label>
            Amount

            <input
              name="amount"
              type="number"
              placeholder="0"
              required>
          </label>


          <label>
            Description

            <input
              name="description"
              placeholder="e.g. Groceries"
              required>
          </label>


          <label>
            Category

            <select name="category">

              ${
                categories
                  .map(c=>
                    `<option>${c}</option>`
                  )
                  .join("")
              }

            </select>

          </label>


          <label>
            Account

            <select name="account">

              ${
                accounts
                  .map(a=>
                    `<option>${a[0]}</option>`
                  )
                  .join("")
              }

            </select>

          </label>


          <label>
            Member

            <select name="member">

              <option>
                Ali
              </option>

              <option>
                Novia
              </option>

            </select>

          </label>


          <button
            class="save"
            type="submit">
            Save transaction
          </button>

          <p class="demo">
            Saved locally in this demo.
          </p>

        </form>

      </div>

    `
  );

  document
    .querySelector("#close")
    .onclick=()=>{
      document
        .querySelector("#modal")
        .remove();
    };


  document
    .querySelector("#modal form")
    .onsubmit=e=>{

      e.preventDefault();

      const f=new FormData(e.target);

      const obj=Object.fromEntries(f.entries());

      obj.amount=Number(obj.amount);

      state.transactions.unshift(obj);

      document
        .querySelector("#modal")
        .remove();

      app();
    };
}

function bind(){

  document
    .querySelectorAll("[data-page]")
    .forEach(b=>{
      b.onclick=()=>{
        state.page=b.dataset.page;
        app();
      };
    });


  document
    .querySelector("#logout")
    ?.addEventListener(
      "click",
      ()=>{
        state.user=null;
        app();
      }
    );


  document
    .querySelector("#add")
    ?.addEventListener(
      "click",
      modal
    );


  document
    .querySelector("#add2")
    ?.addEventListener(
      "click",
      modal
    );


  document
    .querySelector("#month")
    ?.addEventListener(
      "change",
      e=>{
        state.month=e.target.value;
        app();
      }
    );

}

app();
