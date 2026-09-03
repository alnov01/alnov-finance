import "./style.css";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* =========================================================
   ALNOV FINANCE — SUPABASE DATABASE VERSION
   ========================================================= */

const SUPABASE_URL =
  "https://orukpqlpqbjwdsvwrrcy.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X1oq32vSXVyMFjCAmbOkcw_i4lhIxSh";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* =========================================================
   HOUSEHOLD
   ========================================================= */

const HOUSEHOLD_ID =
  "fed7fe83-4f2c-4a6b-bf1f-cbb1329a764c";

/* =========================================================
   BASIC DATA
   ========================================================= */

const accounts = [
  ["BCA 029",4964028],
  ["BLU 908",1936056],
  ["BLU 927",5560073],
  ["BNI 834",305701],
  ["BNI 198",129879],
  ["BSI 072",17467267],
  ["BSI 115",13145909],
  ["BTN 160",0],
  ["DANA 444",237950],
  ["DANA 111",17472],
  ["JAGO 100",9792],
  ["MANDIRI 138",100000],
  ["MANDIRI 146",354576],
  ["CASH",0]
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
  "Consulting / Project",
  "Mod / Side Income",
  "Saving"
];

/* =========================================================
   STATE
   ========================================================= */

let state = {
  user: null,
  authUser: null,
  month: "September",
  year: 2026,
  transactions: [],
  page: "dashboard",
  loading: false
};

/* =========================================================
   HELPERS
   ========================================================= */

const money = n =>
  new Intl.NumberFormat("id-ID",{
    style:"currency",
    currency:"IDR",
    maximumFractionDigits:0
  }).format(Number(n || 0));

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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* =========================================================
   ACCOUNT ID LOOKUP
   ========================================================= */

let accountRows = [];

async function loadAccounts() {

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("household_id", HOUSEHOLD_ID);

  if (error) {
    console.warn("Accounts gagal dimuat:", error);
    accountRows = [];
    return;
  }

  accountRows = data || [];
}

function getAccountIdByName(name) {

  const row = accountRows.find(a => {

    return (
      a.name === name ||
      a.account_name === name ||
      a.display_name === name
    );

  });

  return row?.id || null;
}

/* =========================================================
   LOAD TRANSACTIONS FROM SUPABASE
   ========================================================= */

async function loadTransactions() {

  state.loading = true;

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      id,
      household_id,
      entered_by,
      transaction_date,
      amount,
      transaction_type,
      category_id,
      description,
      account_id,
      route_to_account_id,
      route_to_pot_id,
      member_name,
      is_reimbursement,
      reimbursement_amount,
      notes,
      created_at,
      updated_at,
      source_key
    `)
    .eq("household_id", HOUSEHOLD_ID)
    .order("transaction_date", {
      ascending: false
    })
    .order("created_at", {
      ascending: false
    });

  state.loading = false;

  if (error) {

    console.error(error);

    alert(
      "Gagal mengambil transaksi dari database:\n\n" +
      error.message
    );

    state.transactions = [];
    return;
  }

  state.transactions = (data || []).map(t => ({
    id: t.id,

    date: t.transaction_date,

    amount: Number(t.amount || 0),

    type:
      t.transaction_type === "income"
        ? "Income"
        : t.transaction_type === "allocation"
        ? "Allocation"
        : "Expense",

    description:
      t.description || "",

    category:
      t.description || "Others",

    member:
      t.member_name || "Household",

    account:
      getAccountName(t.account_id),

    account_id:
      t.account_id,

    notes:
      t.notes || "",

    raw: t
  }));
}

/* =========================================================
   ACCOUNT NAME
   ========================================================= */

function getAccountName(id) {

  if (!id) return "";

  const row = accountRows.find(a => a.id === id);

  if (!row) return "";

  return (
    row.name ||
    row.account_name ||
    row.display_name ||
    ""
  );
}

/* =========================================================
   LOAD EVERYTHING
   ========================================================= */

async function loadDatabase() {

  await loadAccounts();
  await loadTransactions();

}

/* =========================================================
   METRICS
   ========================================================= */

function metrics(){

  const month =
    String(monthNum[state.month]).padStart(2,"0");

  const prefix =
    `${state.year}-${month}`;

  const tx =
    state.transactions.filter(t =>
      String(t.date).startsWith(prefix)
    );

  const income =
    tx
      .filter(t=>t.type==="Income")
      .reduce(
        (a,t)=>a+Number(t.amount || 0),
        0
      );

  const expense =
    tx
      .filter(t=>t.type==="Expense")
      .reduce(
        (a,t)=>a+Number(t.amount || 0),
        0
      );

  const allocation =
    tx
      .filter(t=>t.type==="Allocation")
      .reduce(
        (a,t)=>a+Number(t.amount || 0),
        0
      );

  const net =
    income - expense - allocation;

  const savings =
    income
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
    health: Math.max(
      0,
      Math.min(100,health)
    )
  };
}

/* =========================================================
   CATEGORY GROUP
   ========================================================= */

function groupByCategory(tx,type){

  const m={};

  tx
    .filter(t=>t.type===type)
    .forEach(t=>{

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
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);
}

/* =========================================================
   CARD
   ========================================================= */

function card(title,value,sub=""){

  return `
    <div class="stat">
      <div class="stat-title">
        ${escapeHtml(title)}
      </div>

      <div class="stat-value">
        ${escapeHtml(value)}
      </div>

      <div class="stat-sub">
        ${escapeHtml(sub)}
      </div>
    </div>
  `;
}

/* =========================================================
   APP
   ========================================================= */

function app(){

  if(!state.user){

    login();

    return;
  }

  document.querySelector("#root").innerHTML=`

    <div class="shell">

      <aside class="sidebar">

        <div class="brand">

          <div class="logo">
            ♡
          </div>

          <div>
            <b>ALNOV</b>
            <span>
              Household Finance
            </span>
          </div>

        </div>


        <button
          class="nav ${
            state.page==="dashboard"
              ?"active"
              :""
          }"
          data-page="dashboard">

          ⌂
          <span>Dashboard</span>

        </button>


        <button
          class="nav ${
            state.page==="transactions"
              ?"active"
              :""
          }"
          data-page="transactions">

          ↕
          <span>Transactions</span>

        </button>


        <button
          class="nav ${
            state.page==="pots"
              ?"active"
              :""
          }"
          data-page="pots">

          ♡
          <span>Saving Pots</span>

        </button>


        <button
          class="nav ${
            state.page==="accounts"
              ?"active"
              :""
          }"
          data-page="accounts">

          ▣
          <span>Accounts</span>

        </button>


        <div class="sidebar-bottom">

          <div class="member">

            <span class="avatar">
              ${escapeHtml(
                state.user[0]
              )}
            </span>

            <div>

              <b>
                ${escapeHtml(state.user)}
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
              ${escapeHtml(
                state.user.toUpperCase()
              )}
              ♡

            </p>

            <h1>

              ${
                state.page==="dashboard"
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

/* =========================================================
   LOGIN
   ========================================================= */

function login(){

  document.querySelector("#root").innerHTML=`

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
            data-user="Ali">

            Continue as Ali

          </button>


          <button
            data-user="Novia">

            Continue as Novia

          </button>

        </div>


        <label
          style="
            display:block;
            margin-top:24px;
            margin-bottom:8px;
            text-align:left;
          ">

          Password

        </label>


        <input
          id="password"
          type="password"
          placeholder="Enter password"
          autocomplete="current-password"
          style="
            width:100%;
            box-sizing:border-box;
            padding:14px;
            border:1px solid #ddd;
            border-radius:10px;
            font-size:16px;
          "
        />


        <button
          id="loginButton"
          class="save"
          style="
            width:100%;
            margin-top:16px;
          ">

          Login

        </button>


        <p
          id="loginError"
          style="
            display:none;
            color:#d33;
            margin-top:14px;
          ">
        </p>


        <p class="demo">
          Secure database login
        </p>

      </div>

    </div>

  `;


  let selectedUser = null;


  document
    .querySelectorAll("[data-user]")
    .forEach(button => {

      button.onclick = () => {

        selectedUser =
          button.dataset.user;

        document
          .querySelectorAll("[data-user]")
          .forEach(b =>
            b.classList.remove("selected")
          );

        button.classList.add("selected");

      };

    });


  document
    .querySelector("#loginButton")
    .onclick = async () => {

      const password =
        document.querySelector(
          "#password"
        ).value;


      const errorBox =
        document.querySelector(
          "#loginError"
        );


      if(!selectedUser){

        errorBox.textContent =
          "Pilih Ali atau Novia dulu.";

        errorBox.style.display =
          "block";

        return;
      }


      if(!password){

        errorBox.textContent =
          "Masukkan password.";

        errorBox.style.display =
          "block";

        return;
      }


      errorBox.style.display =
        "none";


      const email =
        selectedUser === "Ali"
          ? "ali@alnov.finance"
          : "novia@alnov.finance";


      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });


      if(error){

        console.error(error);

        errorBox.textContent =
          "Password salah atau akun belum terdaftar.";

        errorBox.style.display =
          "block";

        return;
      }


      state.user =
        selectedUser;

      state.authUser =
        data.user;


      await loadDatabase();

      app();

    };

}

/* =========================================================
   DASHBOARD
   ========================================================= */

function dashboard(){

  const m=metrics();

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
            Object.keys(monthNum)
              .map(x=>
                `<option ${
                  x===state.month
                    ?"selected"
                    :""
                }>
                  ${x}
                </option>`
              )
              .join("")
          }

        </select>


        <select id="year">

          <option>2026</option>

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
              ${state.month} 2026
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
              style="
                width:${Math.min(
                  100,
                  m.income /
                  (m.income+m.expense||1) *
                  100
                )}%
              ">
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
              style="
                width:${Math.min(
                  100,
                  m.expense /
                  (m.income+m.expense||1) *
                  100
                )}%
              ">
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
            .slice(0,5)
            .map(p=>`

              <div class="pot">

                <div class="pot-icon">
                  ♡
                </div>


                <div class="pot-info">

                  <div>

                    <b>
                      ${escapeHtml(p[0])}
                    </b>

                    <span>

                      ${money(p[2])}
                      /
                      ${money(p[1])}

                    </span>

                  </div>


                  <div class="progress">

                    <i
                      style="
                        width:${
                          p[1]
                            ? Math.min(
                                100,
                                p[2]/p[1]*100
                              )
                            : 0
                        }%
                      ">
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

/* =========================================================
   LIST PANEL
   ========================================================= */

function listPanel(title,items){

  return `

    <div class="panel">

      <div class="panel-head">

        <div>

          <span class="label">
            ${escapeHtml(title.toUpperCase())}
          </span>

          <h3>
            By category
          </h3>

        </div>

      </div>


      ${
        items.length
          ? items
              .map(([k,v])=>`

                <div class="rank">

                  <span class="dot"></span>

                  <div>

                    <b>
                      ${escapeHtml(k)}
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

              `)
              .join("")
          :
            `<p class="muted">
              No data yet.
            </p>`
      }

    </div>

  `;
}

/* =========================================================
   TRANSACTIONS
   ========================================================= */

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
              <th>Account</th>
              <th>Amount</th>

            </tr>

          </thead>


          <tbody>

            ${
              m.tx
                .map(t=>`

                  <tr>

                    <td>
                      ${escapeHtml(t.date)}
                    </td>


                    <td>

                      <span
                        class="type ${
                          t.type.toLowerCase()
                        }">

                        ${escapeHtml(t.type)}

                      </span>

                    </td>


                    <td>
                      ${escapeHtml(t.description)}
                    </td>


                    <td>
                      ${escapeHtml(
                        t.category || "—"
                      )}
                    </td>


                    <td>
                      ${escapeHtml(t.member)}
                    </td>


                    <td>
                      ${escapeHtml(
                        t.account || "—"
                      )}
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
                      }

                      ${money(t.amount)}

                    </td>

                  </tr>

                `)
                .join("")
            }


            ${
              !m.tx.length
                ? `
                  <tr>
                    <td
                      colspan="7"
                      style="text-align:center;padding:30px">

                      No transactions yet.

                    </td>
                  </tr>
                `
                : ""
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
                  ${escapeHtml(p[0])}
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
                    style="
                      width:${
                        p[1]
                          ? Math.min(
                              100,
                              p[2]/p[1]*100
                            )
                          : 0
                      }%
                    ">
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

/* =========================================================
   ACCOUNTS
   ========================================================= */

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
                    ${escapeHtml(a[0])}
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

/* =========================================================
   ADD TRANSACTION MODAL
   ========================================================= */

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
              value="${
                new Date()
                  .toISOString()
                  .slice(0,10)
              }"
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
                categories
                  .map(c=>
                    `<option value="${escapeHtml(c)}">
                      ${escapeHtml(c)}
                    </option>`
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
                    `<option value="${escapeHtml(a[0])}">
                      ${escapeHtml(a[0])}
                    </option>`
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

            Saved directly to database.

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
    .onsubmit=async e=>{

      e.preventDefault();


      const f =
        new FormData(e.target);


      const type =
        f.get("type");


      const accountName =
        f.get("account");


      const accountId =
        getAccountIdByName(
          accountName
        );


      const category =
        f.get("category");


      /*
        IMPORTANT:
        category_id is UUID in your DB.
        We don't put category text
        into category_id.
      */


      const payload = {

        household_id:
          HOUSEHOLD_ID,

        entered_by:
          state.authUser?.id || null,

        transaction_date:
          f.get("date"),

        amount:
          Number(
            f.get("amount")
          ),

        transaction_type:
          type.toLowerCase(),

        category_id:
          null,

        description:
          f.get("description"),

        account_id:
          accountId,

        route_to_account_id:
          null,

        route_to_pot_id:
          null,

        member_name:
          f.get("member"),

        is_reimbursement:
          false,

        reimbursement_amount:
          null,

        notes:
          null,

        source_key:
          `manual-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`

      };


      const {
        data,
        error
      } = await supabase
        .from("transactions")
        .insert(payload)
        .select()
        .single();


      if(error){

        console.error(
          "INSERT TRANSACTION ERROR:",
          error
        );


        alert(
          "Gagal menyimpan transaksi:\n\n" +
          error.message
        );

        return;
      }


      console.log(
        "Transaction saved:",
        data
      );


      document
        .querySelector("#modal")
        .remove();


      await loadTransactions();

      app();

    };

}

/* =========================================================
   BIND
   ========================================================= */

function bind(){

  document
    .querySelectorAll("[data-page]")
    .forEach(b=>{

      b.onclick=()=>{

        state.page =
          b.dataset.page;

        app();

      };

    });


  document
    .querySelector("#logout")
    ?.addEventListener(
      "click",
      async ()=>{

        await supabase.auth.signOut();

        state.user = null;
        state.authUser = null;
        state.transactions = [];

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

        state.month =
          e.target.value;

        app();

      }
    );

}

/* =========================================================
   SESSION CHECK
   ========================================================= */

async function init(){

  const {
    data: {
      session
    }
  } =
    await supabase.auth.getSession();


  if(session?.user){

    state.authUser =
      session.user;


    /*
      Tentukan nama dari email.
    */

    if(
      session.user.email ===
      "ali@alnov.finance"
    ){

      state.user = "Ali";

    }
    else if(
      session.user.email ===
      "novia@alnov.finance"
    ){

      state.user = "Novia";

    }
    else {

      state.user = "Ali";

    }


    await loadDatabase();

  }


  app();

}


init();
