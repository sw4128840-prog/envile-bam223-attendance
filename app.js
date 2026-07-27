import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUd2Cg3ocTDXPo3zPFLrLzMrjomk1_9aY",
  authDomain: "envile-bam223-attendance.firebaseapp.com",
  projectId: "envile-bam223-attendance",
  storageBucket: "envile-bam223-attendance.firebasestorage.app",
  messagingSenderId: "634327835254",
  appId: "1:634327835254:web:8e8b0ff766ca47136d7557",
  measurementId: "G-FBVCKEX5BG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const roster = [
["Akintunde Rofiat Bisola","Bus. Admin","F24/ND43001"],["Ugbor Chizitere Maria Assumpta","Bus. Admin","F24/ND43002"],["Obey Oriyomi Boluwatife","Bus. Admin","P24/ND43001"],["Felix Temitope Favour","Bus. Admin","F24/ND43003"],["Adeleke Ifeoluwa Precious","Bus. Admin","F24/ND43004"],["Oyedun Isreal Ayomide","Bus. Admin","F24/ND43005"],["Owolabi Daniel","Bus. Admin","F24/ND43006"],["Ekezie Mercy Ezinne","Bus. Admin","P24/ND43002"],["Maxwell Blessing Anita","Bus. Admin","F24/ND43007"],["Nwafor Emmanuel Daniel","Bus. Admin","P24/ND43003"],["Ige Ayomide Oluwaseun","Bus. Admin","F24/ND43008"],["Ige Itunuoluwa Ope","Bus. Admin","F24/ND43009"],["Arigbabuowo Zainab Motunrayo","Bus. Admin","F24/ND43010"],["Sunday Favour Chisom","Bus. Admin","F24/ND43011"],["Anyanwu Esther Chinatu","Bus. Admin","F24/ND43012"],["Oseni Waris Korede","Bus. Admin","P24/ND43004"],["Eyeloriade Samuel Pelumi","Bus. Admin","F24/ND43013"],["Oyedun Rebecca Oluwanifemi","Bus. Admin","F24/ND43014"],["Akinola Aishat Aramide","Bus. Admin","F24/ND43015"],["Ugbor Chukwuemeka Michael","Bus. Admin","F24/ND43016"]
].map((x,i)=>({sn:i+1,name:x[0],department:x[1],matric:x[2]}));

let current = null;
const todayKey = () => new Date().toISOString().slice(0,10);
const schoolDay = () => { const d=new Date().getDay(); return d>=1 && d<=5; };
const show = id => ["login","student","admin"].forEach(x=>document.getElementById(x).classList.toggle("hidden",x!==id));
const msg = t => document.getElementById("message").textContent=t;

async function studentLogin(){
  const m=document.getElementById("matric").value.trim().toUpperCase();
  const s=roster.find(x=>x.matric.toUpperCase()===m);
  if(!s) return msg("Matric number not found in the BAM223 roster.");
  current=s; await renderStudent(); show("student");
}
window.studentLogin=studentLogin;

async function adminLogin(){
  if(document.getElementById("adminUser").value==="admin" && document.getElementById("adminPass").value==="admin123"){
    await renderAdmin(); show("admin");
  } else msg("Incorrect admin login.");
}
window.adminLogin=adminLogin;

async function markAttendance(){
  if(!schoolDay()) return alert("Attendance is available Monday to Friday only.");
  const id=`${current.matric}_${todayKey()}`;
  const ref=doc(db,"attendance",id);
  const existing=await getDoc(ref);
  if(existing.exists()) return alert("Attendance already recorded today.");
  await setDoc(ref,{studentId:current.matric,name:current.name,department:current.department,date:todayKey(),time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),status:"Present",classCode:"BAM223"});
  await renderStudent(); alert("Attendance recorded successfully ✅");
}
window.markAttendance=markAttendance;

async function getMyRecords(){
  const q=query(collection(db,"attendance"),where("studentId","==",current.matric));
  const snap=await getDocs(q); return snap.docs.map(d=>d.data()).sort((a,b)=>b.date.localeCompare(a.date));
}

async function renderStudent(){
  const rs=await getMyRecords(), present=rs.filter(x=>x.status==="Present").length;
  document.getElementById("welcome").textContent=`Welcome, ${current.name} 👋`;
  document.getElementById("studentInfo").textContent=`${current.department} • ${current.matric}`;
  document.getElementById("date").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  document.getElementById("present").textContent=present;
  document.getElementById("rate").textContent=present?"100%":"0%";
  const r=rs.find(x=>x.date===todayKey()), st=document.getElementById("status"), btn=document.getElementById("mark");
  if(r){st.textContent=`Present • ${r.time}`;st.className="status present";btn.disabled=true;btn.textContent="ATTENDANCE RECORDED";}
  else if(!schoolDay()){st.textContent="Weekend — attendance closed";st.className="status";btn.disabled=true;btn.textContent="CLOSED ON WEEKENDS";}
  else{st.textContent="Not marked";st.className="status";btn.disabled=false;btn.textContent="MARK ATTENDANCE";}
  document.getElementById("history").innerHTML=rs.length?rs.map(x=>`<p>${x.date} — ${x.time} — <b class="present">${x.status}</b></p>`).join(""):"<p>No attendance records yet.</p>";
}

async function renderAdmin(){
  const snap=await getDocs(collection(db,"attendance"));
  const all=snap.docs.map(d=>d.data()), today=all.filter(x=>x.date===todayKey());
  document.getElementById("apresent").textContent=today.length;
  document.getElementById("arate").textContent=Math.round(today.length/roster.length*100)+"%";
  const q=(document.getElementById("search")?.value||"").toLowerCase();
  document.getElementById("table").innerHTML=roster.filter(s=>(s.name+" "+s.matric).toLowerCase().includes(q)).map(s=>{
    const r=today.find(x=>x.studentId===s.matric);
    return `<tr><td>${s.sn}</td><td>${s.name}</td><td>${s.matric}</td><td class="${r?"present":""}">${r?"Present":"Absent"}</td><td>${r?r.time:"—"}</td></tr>`;
  }).join("");
}
window.renderAdmin=renderAdmin;
document.getElementById("search")?.addEventListener("input",renderAdmin);
show("login");
