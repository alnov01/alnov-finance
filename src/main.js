import "./style.css";

/* =========================================================
   ALNOV HOUSEHOLD FINANCE
   Supabase database-connected version
   ========================================================= */

const SUPABASE_URL =
  "https://orukpqlpqbjwdsvwrrcy.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X1oq32vSXVyMFjCAmbOkcw_i4lhIxSh";

const HOUSEHOLD_ID =
  "fed7fe83-4f2c-4a6b-bf1f-cbb1329a764c";

/* =========================================================
   SUPABASE REST HELPER
   ========================================================= */

let authToken = localStorage.getItem("alnov_access_token") || null;
let currentUser = JSON.parse(
  localStorage.getItem("alnov_user") || "null"
);

async function supabaseFetch(path, options = {}) {

  const headers = {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(
    `${SUPABASE_URL}${path}`,
    {
      ...options,
      headers
    }
  );

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {

    const message =
      data?.message ||
      data?.error_description ||
      data?.hint ||
      data?.error ||
      text ||
      "Supabase request failed";

    throw new Error(message);
  }

  return data;
}


/* =========================================================
   AUTH
   ========================================================= */

const LOGIN_EMAILS = {
  Ali: "ali@alnov.finance",
  Novia: "novia@alnov.finance"
};

async function loginUser(member, password) {

  const email = LOGIN_EMAILS[member];

  if (!email) {
    throw new Error("User login tidak ditemukan.");
  }

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data?.error_description ||
      data?.msg ||
      "Email atau password salah."
    );
  }

  authToken = data.access_token;

  currentUser = {
    id: data.user.id,
    email: data.user.email,
    name: member
  };

  localStorage.setItem(
    "alnov_access_token",
    authToken
  );

  localStorage.setItem(
    "alnov_user",
    JSON.stringify(currentUser)
  );

  state.user = member;
}


function logoutUser() {

  authToken = null;
  currentUser = null;

  localStorage.removeItem("alnov_access_token");
  localStorage.removeItem("alnov_user");

  state.user = null;

  app();
}


/* =========================================================
   MASTER DATA
   ========================================================= */

let accounts = [];
let categories = [];
let pots = [];


/* =========================================================
   LOAD MASTER DATA
   ========================================================= */

async function loadAccounts() {

  const data = await supabaseFetch(
    `/rest/v1/accounts?household_id=eq.${HOUSEHOLD_ID}&select=*`
  );

  accounts = data || [];
}


async function loadCategories() {

  const data = await supabaseFetch(
    `/rest/v1/categories?select=*`
  );

  categories = data || [];
}


async function loadPots() {

  const data = await supabaseFetch(
    `/rest/v1/saving_pots?household_id=eq.${HOUSEHOLD_ID}&select=*`
  ).catch(() => []);

  pots = data || [];
}


/* =========================================================
   TRANSACTIONS
   ========================================================= */

async function loadTransactions() {

  if (!authToken) {
    state.transactions = [];
    return;
  }

  const data = await supabaseFetch(
    `/rest/v1/transactions?household_id=eq.${HOUSEHOLD_ID}&select=*&order=transaction_date.desc,created_at.desc`
  );

  state.transactions = (data || []).map(normalizeTransaction);
}


function normalizeTransaction(t) {

  return {
    id: t.id,

    date:
      t.transaction_date ||
      "",

    type:
      t.transaction_type ||
      "Expense",

    description:
      t.description ||
      "",

    category:
      t.category_name ||
      t.category ||
      "",

    category_id:
      t.category_id ||
      null,

    member:
      t.member_name ||
      "Household",

    account:
      t.account_name ||
      "",

    account_id:
      t.account_id ||
      null,

    amount:
      Number(t.amount || 0),

    notes:
      t.notes ||
      "",

    is_reimbursement:
      Boolean(t.is_reimbursement),

    reimbursement_amount:
      Number(t.reimbursement_amount || 0),

    route_to_account_id:
      t.route_to_account_id ||
      null,

    route_to_pot_id:
      t.route_to_pot_id ||
      null,

    created_at:
      t.created_at ||
      ""
  };
}


/* =========================================================
   INSERT TRANSACTION
   ========================================================= */

async function saveTransaction(obj) {

  if (!authToken) {
    throw new Error("Session login tidak ditemukan.");
  }

  let categoryId = obj.category_id || null;
  let accountId = obj.account_id || null;

  /* Find category by name if needed */

  if (!categoryId && obj.category) {

    const foundCategory = categories.find(
      c =>
        c.name === obj.category ||
        c.category_name === obj.category
    );

    if (foundCategory) {
      categoryId = foundCategory.id;
    }
  }


  /* Find account by name if needed */

  if (!accountId && obj.account) {

    const foundAccount = accounts.find(
      a =>
        a.name === obj.account ||
        a.account_name === obj.account ||
        a.display_name === obj.account
    );

    if (foundAccount) {
      accountId = foundAccount.id;
    }
  }


  const payload = {

    household_id:
      HOUSEHOLD_ID,

    entered_by:
      currentUser?.id || null,

    transaction_date:
      obj.date,

    amount:
      Number(obj.amount),

    transaction_type:
      obj.type,

    category_id:
      categoryId,

    description:
      obj.description,

    account_id:
      accountId,

    member_name:
      obj.member,

    is_reimbursement:
      Boolean(obj.is_reimbursement),

    reimbursement_amount:
      Number(obj.reimbursement_amount || 0),

    notes:
      obj.notes || null,

    route_to_account_id:
      obj.route_to_account_id || null,

    route_to_pot_id:
      obj.route_to_pot_id || null
  };


  const data = await supabaseFetch(
    `/rest/v1/transactions`,
    {
      method: "POST",
      headers: {
        Prefer: "return=representation"
      },
      body: JSON.stringify(payload)
    }
  );

  return data?.[0] || null;
}


/* =========================================================
   DELETE TRANSACTION
   ========================================================= */

async function deleteTransaction(id) {

  await supabaseFetch(
    `/rest/v1/transactions?id=eq.${id}`,
    {
      method: "DELETE"
    }
  );

  await loadTransactions();
  app();
}


/* =========================================================
   STATE
   ========================================================= */

let state = {

  user:
    currentUser?.name ||
    null,

  month:
    new Date().getMonth() + 1,

  year:
    new Date().getFullYear(),

  transactions:
    [],

  page:
    "dashboard",

  loading:
    false
};


/* =========================================================
   MONEY
   ========================================================= */

const money = n =>
  new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(Number(n || 0));


const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


/* =========================================================
   METRICS
   ========================================================= */

function metrics() {

  const prefix =
    `${state.year}-${String(state.month).padStart(2, "0")}`;

  const tx =
    state.transactions.filter(
      t =>
        t.date &&
        t.date.startsWith(prefix)
    );

  const income =
    tx
      .filter(t => t.type === "Income")
      .reduce(
        (a, t) => a + Number(t.amount || 0),
        0
      );

  const expense =
    tx
      .filter(t => t.type === "Expense")
      .reduce(
        (a, t) => a + Number(t.amount || 0),
        0
      );

  const allocation =
    tx
      .filter(t => t.type === "Allocation")
      .reduce(
        (a, t) => a + Number(t.amount || 0),
        0
      );

  const net =
    income - expense - allocation;

  const savings =
    income > 0
      ? Math.round((net / income) * 100)
      : 0;

  let health =
    50 +
    (net >= 0 ? 20 : 0) +
    (
      savings >= 20
        ? 20
        : savings >= 10
        ? 10
        : 0
    );

  return {

    tx,

    income,

    expense,

    allocation,

    net,

    savings,

    health:
      Math.max(
        0,
        Math.min(100, health)
      )
  };
}


/* =========================================================
   GROUP CATEGORY
   ========================================================= */

function groupByCategory(tx, type) {

  const m = {};

  tx
    .filter(t => t.type === type)
    .forEach(t => {

      const key =
        t.category ||
        t.description ||
        "Others";

      m[key] =
        (m[key] || 0) +
        Number(t.amount || 0);

    });

  return Object
    .entries(m)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}


/* =========================================================
   CARD
   ========================================================= */

function card(title, value, sub = "") {

  return `
    <div class="stat">
      <div class="stat-title">
        ${title}
      </div>

      <div class="stat-value">
        ${value}
      </div>

      <div class="stat-sub">
        ${sub}
      </div>
    </div>
  `;
}


/* =========================================================
   LOGIN
   ========================================================= */

function login() {

  document.querySelector("#root").innerHTML = `

    <div class="login-wrap">

      <div class="login-card">

        <div class="logo big">
          ♡
        </div>

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

          <button
            data-login="Ali">
            Continue as Ali
          </button>

          <button
            data-login="Novia">
            Continue as Novia
          </button>

        </div>


        <div
          id="password-box"
          style="display:none; margin-top:20px;">

          <label
            style="display:block;text-align:left;">

            Password

            <input
              id="login-password"
              type="password"
              placeholder="Enter password"
              autocomplete="current-password"
              style="width:100%;margin-top:8px;"
            >

          </label>

          <button
            id="login-submit"
            class="save"
            style="width:100%;margin-top:14px;">

            Login

          </button>

          <p
            id="login-error"
            style="display:none;color:#b42318;margin-top:10px;">
          </p>

        </div>


        <p class="demo">
          Secure database login
        </p>

      </div>

    </div>
  `;


  let selectedMember = null;


  document
    .querySelectorAll("[data-login]")
    .forEach(button => {

      button.onclick = () => {

        selectedMember =
          button.dataset.login;

        document
          .querySelector("#password-box")
          .style.display = "block";

        document
          .querySelector("#login-password")
          .focus();

      };

    });


  document
    .querySelector("#login-submit")
    .onclick = async () => {

      const password =
        document
          .querySelector("#login-password")
          .value;

      const error =
        document.querySelector("#login-error");


      if (!password) {

        error.textContent =
          "Masukkan password.";

        error.style.display =
          "block";

        return;
      }


      try {

        error.style.display =
          "none";

        document
          .querySelector("#login-submit")
          .disabled = true;

        document
          .querySelector("#login-submit")
          .textContent =
          "Logging in...";


        await loginUser(
          selectedMember,
          password
        );


        await initializeData();

      } catch (e) {

        error.textContent =
          e.message;

        error.style.display =
          "block";

        document
          .querySelector("#login-submit")
          .disabled = false;

        document
          .querySelector("#login-submit")
          .textContent =
          "Login";

      }

    };


  document
    .querySelector("#login-password")
    .addEventListener(
      "keydown",
      e => {

        if (e.key === "Enter") {

          document
            .querySelector("#login-submit")
            .click();

        }

      }
    );
}


/* =========================================================
   APP
   ========================================================= */

async function app() {

  if (!state.user) {

    login();
    return;

  }


  if (state.loading) {

    document.querySelector("#root").innerHTML = `

      <div class="login-wrap">

        <div class="login-card">

          <div class="logo big">
            ♡
          </div>

          <h2>
            Loading your household...
          </h2>

          <p class="muted">
            Connecting to the database.
          </p>

        </div>

      </div>
    `;

    return;
  }


  document.querySelector("#root").innerHTML = `

    <div class="shell">

      <aside class="sidebar">

        <div class="brand">

          <div class="logo">
            ♡
          </div>

          <div>

            <b>
              ALNOV
            </b>

            <span>
              Household Finance
            </span>

          </div>

        </div>


        <button
          class="nav ${state.page === "dashboard" ? "active" : ""}"
          data-page="dashboard">

          ⌂

          <span>
            Dashboard
          </span>

        </button>


        <button
          class="nav ${state.page === "transactions" ? "active" : ""}"
          data-page="transactions">

          ↕
          
          <span>
            Transactions
          </span>

        </button>


        <button
          class="nav ${state.page === "pots" ? "active" : ""}"
          data-page="pots">

          ♡

          <span>
            Saving Pots
          </span>

        </button>


        <button
          class="nav ${state.page === "accounts" ? "active" : ""}"
          data-page="accounts">

          ▣

          <span>
            Accounts
          </span>

        </button>


        <div class="sidebar-bottom">

          <div class="member">

            <span class="avatar">
              ${state.user[0]}
            </span>

            <div>

              <b>
                ${state.user}
              </b>

              <small>
                Household member
              </small>

            </div>

          </div>


          <button
            id="logout"
            class="logout">

            Log out

          </button>

        </div>

      </aside>


      <main class="main">

        <header>

          <div>

            <p class="eyebrow">

              GOOD MORNING,
              ${state.user.toUpperCase()}
              ♡

            </p>

            <h1>

              ${
                state.page === "dashboard"
                  ? "Your money, made calmer."
                  : state.page[0].toUpperCase() +
                    state.page.slice(1)
              }

            </h1>

          </div>


          <button
            class="add"
            id="add">

            ＋ Add transaction

          </button>

        </header>


        ${
          state.page === "dashboard"
            ? dashboard()
            : state.page === "transactions"
            ? transactions()
            : state.page === "pots"
            ? potsPage()
            : accountsPage()
        }

      </main>

    </div>
  `;


  bind();
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function dashboard() {

  const m = metrics();

  const spend =
    groupByCategory(
      m.tx,
      "Expense"
    );

  const inc =
    groupByCategory(
      m.tx,
      "Income"
    );


  return `

    <section class="monthbar">

      <div>

        <span>
          MONTH
        </span>

        <select id="month">

          ${
            monthNames
              .slice(1)
              .map(
                (name, index) => `
                  <option
                    value="${index + 1}"
                    ${
                      index + 1 === state.month
                        ? "selected"
                        : ""
                    }>
                    ${name}
                  </option>
                `
              )
              .join("")
          }

        </select>


        <select id="year">

          <option selected>
            2026
          </option>

        </select>

      </div>


      <div class="pill">
        ● Live database
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
        "Household spending"
      )}

      ${card(
        "Net cash flow",
        money(m.net),
        m.net >= 0
          ? "You are in the green"
          : "Needs attention"
      )}

      ${card(
        "Savings rate",
        m.savings + "%",
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
            style="--p:${m.health * 3.6}deg">
          </div>

        </div>


        <p>

          ${
            m.health >= 80
              ? "Looking healthy. Your money has breathing room."
              : m.health >= 60
              ? "Pretty steady. There is room to strengthen your buffer."
              : "Let's create a little more breathing room this month."
          }

        </p>


        <div class="progress">

          <i
            style="width:${m.health}%">
          </i>

        </div>

      </div>


      <div class="panel">

        <div class="panel-head">

          <div>

            <span class="label">
              MONTHLY VIEW
            </span>

            <h3>
              ${monthNames[state.month]} ${state.year}
            </h3>

          </div>

          <span class="trend">
            Household
          </span>

        </div>


        <div class="compare">

          <div>

            <span>
              Income
            </span>

            <b>
              ${money(m.income)}
            </b>

            <i
              style="width:${Math.min(
                100,
                m.income /
                  ((m.income + m.expense) || 1) *
                  100
              )}%">
            </i>

          </div>


          <div>

            <span>
              Expense
            </span>

            <b>
              ${money(m.expense)}
            </b>

            <i
              style="width:${Math.min(
                100,
                m.expense /
                  ((m.income + m.expense) || 1) *
                  100
              )}%">
            </i>

          </div>

        </div>

      </div>

    </div>


    <div class="grid three">

      ${listPanel(
        "Top spending",
        spend
      )}

      ${listPanel(
        "Top income",
        inc
      )}


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
            .slice(0, 5)
            .map(p => {

              const name =
                p.name ||
                p.pot_name ||
                "Saving Pot";

              const target =
                Number(
                  p.target_amount ||
                  p.target ||
                  0
                );

              const current =
                Number(
                  p.current_amount ||
                  p.amount ||
                  p.balance ||
                  0
                );

              return `

                <div class="pot">

                  <div class="pot-icon">
                    ♡
                  </div>

                  <div class="pot-info">

                    <div>

                      <b>
                        ${name}
                      </b>

                      <span>
                        ${money(current)}
                        /
                        ${money(target)}
                      </span>

                    </div>


                    <div class="progress">

                      <i
                        style="width:${
                          target
                            ? Math.min(
                                100,
                                current / target * 100
                              )
                            : 0
                        }%">
                      </i>

                    </div>

                  </div>

                </div>
              `;
            })
            .join("")
        }

      </div>

    </div>

  `;
}


/* =========================================================
   LIST PANEL
   ========================================================= */

function listPanel(title, items) {

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
        items.length

          ? items
              .map(
                ([k, v]) => `

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
                          v /
                          (items[0]?.[1] || 1) *
                          100
                        )
                      }%
                    </em>

                  </div>

                `
              )
              .join("")

          : `
              <p class="muted">
                No data yet.
              </p>
            `
      }

    </div>

  `;
}


/* =========================================================
   TRANSACTIONS
   ========================================================= */

function transactions() {

  const m = metrics();

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

              <th>
                Date
              </th>

              <th>
                Type
              </th>

              <th>
                Description
              </th>

              <th>
                Category
              </th>

              <th>
                Member
              </th>

              <th>
                Account
              </th>

              <th>
                Amount
              </th>

              <th>
              </th>

            </tr>

          </thead>


          <tbody>

            ${
              m.tx.length

                ? m.tx
                    .map(
                      t => `

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
                            ${t.category || "—"}
                          </td>


                          <td>
                            ${t.member}
                          </td>


                          <td>
                            ${t.account || "—"}
                          </td>


                          <td
                            class="${
                              t.type === "Expense"
                                ? "negative"
                                : "positive"
                            }">

                            ${
                              t.type === "Expense"
                                ? "−"
                                : "+"
                            }${money(t.amount)}

                          </td>


                          <td>

                            ${
                              t.id
                                ? `
                                  <button
                                    class="delete-tx"
                                    data-delete="${t.id}">
                                    ×
                                  </button>
                                `
                                : ""
                            }

                          </td>

                        </tr>

                      `
                    )
                    .join("")

                : `
                    <tr>

                      <td
                        colspan="8"
                        style="text-align:center;padding:40px;">

                        No transactions
                        for this month yet.

                      </td>

                    </tr>
                  `
            }

          </tbody>

        </table>

      </div>

    </div>

  `;
}


/* =========================================================
   POTS
   ========================================================= */

function potsPage() {

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
          pots.length

            ? pots
                .map(p => {

                  const name =
                    p.name ||
                    p.pot_name ||
                    "Saving Pot";

                  const target =
                    Number(
                      p.target_amount ||
                      p.target ||
                      0
                    );

                  const current =
                    Number(
                      p.current_amount ||
                      p.amount ||
                      p.balance ||
                      0
                    );

                  return `

                    <div class="goal">

                      <div class="pot-icon">
                        ♡
                      </div>

                      <b>
                        ${name}
                      </b>

                      <strong>
                        ${money(current)}
                      </strong>

                      <small>
                        Target ${
                          target
                            ? money(target)
                            : "—"
                        }
                      </small>

                      <div class="progress">

                        <i
                          style="width:${
                            target
                              ? Math.min(
                                  100,
                                  current / target * 100
                                )
                              : 0
                          }%">
                        </i>

                      </div>

                    </div>

                  `;
                })
                .join("")

            : `
                <p class="muted">
                  No saving pots found.
                </p>
              `
        }

      </div>

    </div>

  `;
}


/* =========================================================
   ACCOUNTS
   ========================================================= */

function accountsPage() {

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
            .map(a => {

              const name =
                a.name ||
                a.account_name ||
                a.display_name ||
                "Account";

              const balance =
                Number(
                  a.balance ||
                  a.current_balance ||
                  0
                );

              return `

                <div class="account">

                  <span>
                    ▣
                  </span>

                  <div>

                    <b>
                      ${name}
                    </b>

                    <small>
                      System balance
                    </small>

                  </div>

                  <strong>
                    ${money(balance)}
                  </strong>

                </div>

              `;
            })
            .join("")
        }

      </div>

    </div>

  `;
}


/* =========================================================
   ADD TRANSACTION MODAL
   ========================================================= */

function modal() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  const categoryOptions =
    categories
      .map(c => {

        const id =
          c.id;

        const name =
          c.name ||
          c.category_name ||
          c.title ||
          "Category";

        return `
          <option
            value="${name}"
            data-id="${id}">
            ${name}
          </option>
        `;
      })
      .join("");


  const accountOptions =
    accounts
      .map(a => {

        const id =
          a.id;

        const name =
          a.name ||
          a.account_name ||
          a.display_name ||
          "Account";

        return `
          <option
            value="${name}"
            data-id="${id}">
            ${name}
          </option>
        `;
      })
      .join("");


  document.body.insertAdjacentHTML(
    "beforeend",
    `

      <div
        class="modal-bg"
        id="modal">

        <form
          class="modal"
          id="transaction-form">

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

              <option value="Expense">
                Expense
              </option>

              <option value="Income">
                Income
              </option>

              <option value="Allocation">
                Allocation
              </option>

            </select>

          </label>


          <label>

            Date

            <input
              name="date"
              type="date"
              value="${today}"
              required>

          </label>


          <label>

            Amount

            <input
              name="amount"
              type="number"
              placeholder="0"
              min="0"
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
                categoryOptions ||
                `
                  <option value="">
                    Others
                  </option>
                `
              }

            </select>

          </label>


          <label>

            Account

            <select name="account">

              <option value="">
                Select account
              </option>

              ${accountOptions}

            </select>

          </label>


          <label>

            Member

            <select name="member">

              <option value="Ali">
                Ali
              </option>

              <option value="Novia">
                Novia
              </option>

            </select>

          </label>


          <label>

            Notes

            <input
              name="notes"
              placeholder="Optional">

          </label>


          <button
            class="save"
            type="submit"
            id="save-transaction">

            Save transaction

          </button>


          <p
            class="demo"
            id="save-status">

            Saved directly to household database.

          </p>

        </form>

      </div>

    `
  );


  document
    .querySelector("#close")
    .onclick = () => {

      document
        .querySelector("#modal")
        .remove();

    };


  document
    .querySelector("#transaction-form")
    .onsubmit = async e => {

      e.preventDefault();


      const form =
        e.target;

      const button =
        document.querySelector(
          "#save-transaction"
        );

      const status =
        document.querySelector(
          "#save-status"
        );


      const formData =
        new FormData(form);


      const categoryName =
        formData.get("category");


      const accountName =
        formData.get("account");


      const category =
        categories.find(
          c =>
            (
              c.name ||
              c.category_name ||
              c.title
            ) === categoryName
        );


      const account =
        accounts.find(
          a =>
            (
              a.name ||
              a.account_name ||
              a.display_name
            ) === accountName
        );


      const obj = {

        type:
          formData.get("type"),

        date:
          formData.get("date"),

        amount:
          Number(
            formData.get("amount")
          ),

        description:
          formData.get("description"),

        category:
          categoryName,

        category_id:
          category?.id || null,

        account:
          accountName,

        account_id:
          account?.id || null,

        member:
          formData.get("member"),

        notes:
          formData.get("notes") || ""

      };


      try {

        button.disabled =
          true;

        button.textContent =
          "Saving...";

        status.textContent =
          "Saving to database...";


        await saveTransaction(
          obj
        );


        await loadTransactions();


        status.textContent =
          "✓ Saved to database";


        setTimeout(
          () => {

            document
              .querySelector("#modal")
              ?.remove();

            app();

          },
          400
        );


      } catch (error) {

        console.error(
          error
        );

        button.disabled =
          false;

        button.textContent =
          "Save transaction";

        status.textContent =
          "Failed: " +
          error.message;

      }

    };

}


/* =========================================================
   BIND
   ========================================================= */

function bind() {

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {

      button.onclick = () => {

        state.page =
          button.dataset.page;

        app();

      };

    });


  document
    .querySelector("#logout")
    ?.addEventListener(
      "click",
      logoutUser
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
      e => {

        state.month =
          Number(
            e.target.value
          );

        app();

      }
    );


  document
    .querySelectorAll(
      "[data-delete]"
    )
    .forEach(button => {

      button.onclick = async () => {

        const id =
          button.dataset.delete;


        if (
          !confirm(
            "Delete this transaction?"
          )
        ) {
          return;
        }


        try {

          await deleteTransaction(
            id
          );

        } catch (error) {

          alert(
            "Gagal menghapus transaksi: " +
            error.message
          );

        }

      };

    });

}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function initializeData() {

  state.loading = true;

  app();


  try {

    await Promise.all([
      loadAccounts(),
      loadCategories(),
      loadPots(),
      loadTransactions()
    ]);


    state.loading =
      false;

    app();


  } catch (error) {

    console.error(
      error
    );

    state.loading =
      false;

    document.querySelector("#root").innerHTML = `

      <div class="login-wrap">

        <div class="login-card">

          <div class="logo big">
            ♡
          </div>

          <h2>
            Database connection error
          </h2>

          <p class="muted">
            ${error.message}
          </p>

          <button
            class="save"
            onclick="location.reload()">

            Try again

          </button>

        </div>

      </div>

    `;

  }
}


/* =========================================================
   START
   ========================================================= */

if (state.user && authToken) {

  initializeData();

} else {

  state.user = null;

  app();

}
