import { db, isFirebaseConfigured } from "./firebase-init.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
const email = "Miksweets@gmail.com";
const starters = [
 {id:"oreo-chocolate-cup",name:"Oreo Chocolate Cup",description:"Oreo crumbs, creamy cheesecake filling, and a rich chocolate topping.",price:60,image:"images/my-cookies.jpg",category:"dessert",tag:"BESTSELLER"},
 {id:"chocolate-brownie-cup",name:"Chocolate Brownie Cup",description:"Chocolate brownie pieces layered with smooth chocolate cream.",price:60,image:"images/oatmeal-crunch.jpg",category:"dessert",tag:""},
 {id:"oreo-cheesecake",name:"Oreo Cheesecake",description:"Smooth cookies-and-cream cheesecake topped with crunchy Oreo pieces.",price:100,image:"images/gallery-2.jpg",category:"dessert",tag:"CUSTOMER FAVORITE"},
 {id:"biscoff-cheesecake",name:"Biscoff Cheesecake",description:"Creamy cheesecake with a caramelized Biscoff biscuit base and spread.",price:70,image:"images/gallery-3.jpg",category:"dessert",tag:""}
];
function safe(value="") { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c])); }
function card(p, menu=false) {
 const image = p.image || "images/my-cookies.jpg";
 const price = Number(p.price || 0);
 const subject = encodeURIComponent("Order - " + p.name);
 const body = encodeURIComponent(`Hello Miksweets!\n\nI would like to order: ${p.name}\nPrice: ₱${price}\nQuantity: \nPreferred pickup/delivery date: \n\nMy name: \nContact number: \n\nThank you!`);
 return `<article class="product-card ${menu?'menu-item':''}" data-category="cookie"><div class="product-photo"><img src="${safe(image)}" alt="${safe(p.name)}" loading="lazy">${p.tag?`<span class="tag">${safe(p.tag)}</span>`:""}</div><div class="product-info"><div><h3>${safe(p.name)}</h3><p>${safe(p.description||"")}</p></div><strong>₱${price.toLocaleString("en-PH")}</strong></div>${menu?`<a class="order-link" href="mailto:${email}?subject=${subject}&body=${body}">Order via email →</a>`:""}</article>`;
}
async function loadProducts() {
 if (!isFirebaseConfigured) return null;
 try { const snap = await getDocs(query(collection(db,"products"),orderBy("sortOrder","asc"))); return snap.docs.map(d=>({id:d.id,...d.data()})); }
 catch (e) { console.warn("Miksweets live menu could not load; showing built-in menu.",e); return null; }
}
function setupFilters() {
 const filters=document.querySelectorAll(".filter");
 filters.forEach(btn=>btn.addEventListener("click",()=>{
   filters.forEach(f=>f.classList.remove("active")); btn.classList.add("active");
   document.querySelectorAll(".menu-item").forEach(item=>item.classList.toggle("hidden",btn.dataset.filter!=="all" && btn.dataset.filter!==item.dataset.category));
 }));
}
document.addEventListener("DOMContentLoaded", async()=>{
 const menuGrid=document.querySelector(".menu-grid");
 const homeGrid=document.querySelector(".section .product-grid:not(.menu-grid)");
 const products=await loadProducts();
 if (products && products.length) {
   if(menuGrid) menuGrid.innerHTML=products.map(p=>card(p,true)).join("");
   if(homeGrid) homeGrid.innerHTML=products.slice(0,4).map(p=>card(p,false)).join("");
 }
 setupFilters();
});
