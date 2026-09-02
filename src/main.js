import "./style.css";

const accounts = [
  ["BCA 029",4964028],["BLU 908",1936056],["BLU 927",5560073],["BNI 834",305701],
  ["BNI 198",129879],["BSI 072",17467267],["BSI 115",13145909],["BTN 160",0],
  ["DANA 444",237950],["DANA 111",17472],["JAGO 100",9792],["MANDIRI 138",100000],
  ["MANDIRI 146",354576],["CASH",0]
];
const pots = [
  ["Big Purchases",16000000,5245909],["Education",1500000,650000],["Eid",3500000,1197700],
  ["Emergency Fund",48000000,1936056],["Healthcare",15000000,5674015],["House",100000000,4923436],
  ["Ibadah",3500000,1475930],["Kids",536000000,11067901],["Pension",0,0],
  ["Tax & Services",3000000,2246363],["Travel",50000000,7900000],["Gold",50,10],
  ["SBN",0,20000000],["SGD",0,92],["KRW",0,150000],["Other Investment",0,0]
];
const categories = ["Admin & Bank Fees","Eid & Seasonal","Education","Giving & Religious","Groceries","Healthcare",
"Household & Utilities","Kids","Lifestyle & Sport","Loan","Meals & Drinks","Others","Parents & Family","Personal Care",
"Shopping","Subscription & Digital","Tax & Service","Travel","Vehicles"];

const dummyTransactions = [
  {date:"2026-09-01",type:"Income",description:"UNTAN",category:"Formal Salary",amount:3952600,member:"Novia",account:"BNI 198"},
  {date:"2026-09-01",type:"Expense",description:"Botol Susu Avent PPSU 260",category:"Kids",amount:287310,member:"Novia",account:"BNI 198"},
  {date:"2026-09-02",type:"Expense",description:"Groceries",category:"Groceries",amount:420000,member:"Ali",account:"BCA 029"},
  {date:"2026-09-03",type:"Expense",description:"Electricity & utilities",category:"Household & Utilities",amount:560000,member:"Ali",account:"BLU 908"},
  {date:"2026-09-05",type:"Income",description:"Consulting Project",category:"Consulting / Project",amount:2100000,member:"Novia",account:"MANDIRI 138"},
  {date:"2026-09-06",type:"Expense",description:"Family meal",category:"Meals & Drinks",amount:350000,member:"Ali",account:"CASH"},
  {date:"2026-09-08",type:"Expense",description:"Healthcare",category:"Healthcare",amount:275000,member:"Novia",account:"BSI 072"},
  {date:"2026-09-10",type:"Expense",description:"Subscription",category:"Subscription & Digital",amount:99000,member:"Ali",account:"DANA 444"}
];

let state = { user:null, month:"September", year:2026, transactions:[...dummyTransactions], page:"dashboard" };

const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const monthNum = {January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12};

function metrics(){
  const tx=state.transactions.filter(t=>t.date.startsWith(`${state.year}-${String(monthNum[state.month]).padStart(2,"0")}`));
  const income=tx.filter(t=>t.type==="Income").reduce((a,t)=>a+t.amount,0);
  const expense=tx.filter(t=>t.type==="Expense").reduce((a,t)=>a+t.amount,0);
  const allocation=tx.filter(t=>t.type==="Allocation").reduce((a,t)=>a+t.amount,0);
  const net=income-expense-allocation;
  const savings=income?Math.round((net/income)*100):0;
  let health=50+(net>=0?20:0)+(savings>=20?20:savings>=10?10:0);
  return {tx,income,expense,allocation,net,savings,health:Math.max(0,Math.min(100,health))};
}
function groupByCategory(tx,type){
  const m={}; tx.filter(t=>t.type===type).forEach(t=>m[t.category]=(m[t.category]||0)+t.amount);
  return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5);
}
function card(title,value,sub=""){
  return `<div class="stat"><div class="stat-title">${title}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></div>`;
}
function app(){
  if(!state.user) return login();
  document.querySelector("#root").innerHTML=`
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><div class="logo">♡</div><div><b>ALNOV</b><span>Household Finance</span></div></div>
      <button class="nav ${state.page==="dashboard"?"active":""}" data-page="dashboard">⌂ <span>Dashboard</span></button>
      <button class="nav ${state.page==="transactions"?"active":""}" data-page="transactions">↕ <span>Transactions</span></button>
      <button class="nav ${state.page==="pots"?"active":""}" data-page="pots">♡ <span>Saving Pots</span></button>
      <button class="nav ${state.page==="accounts"?"active":""}" data-page="accounts">▣ <span>Accounts</span></button>
      <div class="sidebar-bottom"><div class="member"><span class="avatar">${state.user[0]}</span><div><b>${state.user}</b><small>Household member</small></div></div><button id="logout" class="logout">Log out</button></div>
    </aside>
    <main class="main">
      <header><div><p class="eyebrow">GOOD MORNING, ${state.user.toUpperCase()} ♡</p><h1>${state.page==="dashboard"?"Your money, made calmer.":state.page[0].toUpperCase()+state.page.slice(1)}</h1></div>
      <button class="add" id="add">＋ Add transaction</button></header>
      ${state.page==="dashboard"?dashboard():state.page==="transactions"?transactions():state.page==="pots"?potsPage():accountsPage()}
    </main>
  </div>`;
  bind();
}
function login(){
 document.querySelector("#root").innerHTML=`<div class="login-wrap"><div class="login-card"><div class="logo big">♡</div><p class="eyebrow">ALNOV FINANCE</p><h1>Welcome home.</h1><p class="muted">A calm, private space for Ali & Novia to manage household money.</p><div class="login-buttons"><button data-login="Ali">Continue as Ali</button><button data-login="Novia">Continue as Novia</button></div><p class="demo">Demo mode · dummy numbers only</p></div></div>`;
 document.querySelectorAll("[data-login]").forEach(b=>b.onclick=()=>{state.user=b.dataset.login;app()});
}
function dashboard(){
 const m=metrics(), spend=groupByCategory(m.tx,"Expense"), inc=groupByCategory(m.tx,"Income");
 return `<section class="monthbar"><div><span>MONTH</span><select id="month">${Object.keys(monthNum).map(x=>`<option ${x===state.month?"selected":""}>${x}</option>`).join("")}</select><select id="year"><option>2026</option></select></div><div class="pill">● Demo data</div></section>
 <div class="stats">${card("Income",money(m.income),"This month")}${card("Net expense",money(m.expense),"After essential spending")}${card("Net cash flow",money(m.net),m.net>=0?"You are in the green":"Needs attention")}${card("Savings rate",m.savings+"%","Target: 20%+")}</div>
 <div class="grid">
  <div class="panel health"><div class="panel-head"><div><span class="label">FINANCIAL HEALTH</span><h2>${m.health}<small>/100</small></h2></div><div class="health-ring" style="--p:${m.health*3.6}deg"></div></div><p>${m.health>=80?"Looking healthy. Your money has breathing room.":m.health>=60?"Pretty steady. There is room to strengthen your buffer.":"Let's create a little more breathing room this month."}</p><div class="progress"><i style="width:${m.health}%"></i></div></div>
  <div class="panel"><div class="panel-head"><div><span class="label">MONTHLY COMPARISON</span><h3>September vs August</h3></div><span class="trend">↗ +8.4%</span></div><div class="compare"><div><span>Income</span><b>${money(m.income)}</b><i style="width:78%"></i></div><div><span>Expense</span><b>${money(m.expense)}</b><i style="width:42%"></i></div></div></div>
 </div>
 <div class="grid three">
  ${listPanel("Top spending",spend,"expense")}
  ${listPanel("Top income",inc,"income")}
  <div class="panel"><div class="panel-head"><div><span class="label">RECURRING EXPENSES</span><h3>Upcoming</h3></div><span class="link">View all</span></div><div class="mini-row"><span>Utilities</span><b>${money(560000)}</b></div><div class="mini-row"><span>Subscriptions</span><b>${money(99000)}</b></div><div class="mini-row"><span>Household</span><b>${money(420000)}</b></div></div>
 </div>
 <div class="panel"><div class="panel-head"><div><span class="label">SAVING POTS</span><h3>Goals in progress</h3></div><button class="text-btn" data-page="pots">See all →</button></div><div class="pots">${pots.slice(0,5).map(p=>`<div class="pot"><div class="pot-icon">♡</div><div class="pot-info"><div><b>${p[0]}</b><span>${money(p[2])} / ${money(p[1])}</span></div><div class="progress"><i style="width:${p[1]?Math.min(100,p[2]/p[1]*100):0}%"></i></div></div></div>`).join("")}</div></div>`;
}
function listPanel(title,items){
 return `<div class="panel"><div class="panel-head"><div><span class="label">${title.toUpperCase()}</span><h3>By category</h3></div></div>${items.map(([k,v])=>`<div class="rank"><span class="dot"></span><div><b>${k}</b><small>${money(v)}</small></div><em>${Math.round(v/(items[0]?.[1]||1)*100)}%</em></div>`).join("")||`<p class="muted">No data yet.</p>`}</div>`;
}
function transactions(){
 const m=metrics();
 return `<div class="panel"><div class="panel-head"><div><span class="label">TRANSACTION DATABASE</span><h3>${m.tx.length} transactions</h3></div><button class="add small" id="add2">＋ Add</button></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Category</th><th>Member</th><th>Amount</th></tr></thead><tbody>${m.tx.map(t=>`<tr><td>${t.date}</td><td><span class="type ${t.type.toLowerCase()}">${t.type}</span></td><td>${t.description}</td><td>${t.category}</td><td>${t.member}</td><td class="${t.type==="Expense"?"negative":"positive"}">${t.type==="Expense"?"−":"+"}${money(t.amount)}</td></tr>`).join("")}</tbody></table></div></div>`;
}
function potsPage(){return `<div class="panel"><div class="panel-head"><div><span class="label">SAVING & INVESTMENT POTS</span><h3>Goals & reserves</h3></div></div><div class="pots-grid">${pots.map(p=>`<div class="goal"><div class="pot-icon">♡</div><b>${p[0]}</b><strong>${money(p[2])}</strong><small>Target ${p[1]?money(p[1]):"—"}</small><div class="progress"><i style="width:${p[1]?Math.min(100,p[2]/p[1]*100):0}%"></i></div></div>`).join("")}</div></div>`}
function accountsPage(){return `<div class="panel"><div class="panel-head"><div><span class="label">ACCOUNTS</span><h3>${accounts.length} accounts</h3></div></div><div class="account-grid">${accounts.map(a=>`<div class="account"><span>▣</span><div><b>${a[0]}</b><small>System balance</small></div><strong>${money(a[1])}</strong></div>`).join("")}</div></div>`}
function modal(){
 document.body.insertAdjacentHTML("beforeend",`<div class="modal-bg" id="modal"><form class="modal"><button type="button" class="close" id="close">×</button><span class="label">NEW TRANSACTION</span><h2>Add to your household</h2><label>Type<select name="type"><option>Expense</option><option>Income</option><option>Allocation</option></select></label><label>Date<input name="date" type="date" value="2026-09-12"></label><label>Amount<input name="amount" type="number" placeholder="0" required></label><label>Description<input name="description" placeholder="e.g. Groceries" required></label><label>Category<select name="category">${categories.map(c=>`<option>${c}</option>`).join("")}</select></label><label>Account<select name="account">${accounts.map(a=>`<option>${a[0]}</option>`).join("")}</select></label><label>Member<select name="member"><option>Ali</option><option>Novia</option></select></label><button class="save" type="submit">Save transaction</button><p class="demo">Saved locally in this demo. Supabase connection comes next.</p></form></div>`);
 document.querySelector("#close").onclick=()=>document.querySelector("#modal").remove();
 document.querySelector("#modal form").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.transactions.unshift(Object.fromEntries(f.entries()));state.transactions[0].amount=Number(state.transactions[0].amount);document.querySelector("#modal").remove();app()}
}
function bind(){
 document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;app()});
 document.querySelector("#logout")?.addEventListener("click",()=>{state.user=null;app()});
 document.querySelector("#add")?.addEventListener("click",modal); document.querySelector("#add2")?.addEventListener("click",modal);
 document.querySelector("#month")?.addEventListener("change",e=>{state.month=e.target.value;app()});
}
app();
