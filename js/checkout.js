const OFFER_CATALOG = {
  BANHNGOT10: {
    code:"BANHNGOT10",
    title:"Ngọt ngào tháng 10",
    description:"Giảm 10% cho đơn bánh ngọt từ 199.000đ.",
    requirement:"05/10/2026 – 31/10/2026",
    image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85",
    min:199000,
    rate:0.1,
    kind:"cake",
    active:true,
    status:"Đang áp dụng"
  },
  SHIPBANH20: {
    code:"SHIPBANH20",
    title:"Giao bánh tận tâm",
    description:"Giảm phí giao hàng tối đa 20.000đ cho đơn từ 299.000đ.",
    requirement:"01/10/2026 – 15/10/2026",
    image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=85",
    min:299000,
    maxDiscount:20000,
    kind:"shipping",
    active:true,
    status:"Đang áp dụng"
  },
  PHUKIEN15: {
    code:"PHUKIEN15",
    title:"Tiệc vui thêm trọn",
    description:"Giảm 15% phụ kiện bánh cho đơn phụ kiện từ 99.000đ.",
    requirement:"01/10/2026 – 31/10/2026",
    image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=85",
    min:99000,
    rate:0.15,
    kind:"accessory",
    active:true,
    status:"Đang áp dụng"
  },
  HALLOWEEN20: {
    code:"HALLOWEEN20",
    title:"Đêm bánh bí ngô",
    description:"Giảm 20% bánh Halloween cho đơn từ 250.000đ.",
    requirement:"20/10/2026 – 31/10/2026",
    image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=85",
    min:250000,
    rate:0.2,
    kind:"cake",
    active:false,
    status:"Chưa đến thời gian"
  },
  NOELCAKE15: {
    code:"NOELCAKE15",
    title:"Mùa bánh Giáng Sinh",
    description:"Giảm 15% bánh khúc cây và bánh mùa lễ hội từ 350.000đ.",
    requirement:"01/12/2026 – 25/12/2026",
    image:"https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1000&q=85",
    min:350000,
    rate:0.15,
    kind:"cake",
    active:false,
    status:"Chưa đến thời gian"
  },
  TRANGDOANVIEN: {
    code:"TRANGDOANVIEN",
    title:"Trăng ngọt đoàn viên",
    description:"Giảm 20% hộp bánh Trung Thu khi mua từ 2 hộp.",
    requirement:"01/09/2026 – 30/09/2026",
    image:"https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=85",
    minQuantity:2,
    rate:0.2,
    kind:"mooncake",
    active:false,
    status:"Đã hết hạn"
  },
  HAPPYCAKE50: {
    code:"HAPPYCAKE50",
    title:"Sinh nhật thêm vui",
    description:"Giảm 50.000đ cho bánh sinh nhật từ 500.000đ.",
    requirement:"01/10/2026 – 31/10/2026",
    image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85",
    min:500000,
    amount:50000,
    kind:"cake",
    active:false,
    status:"Đã dùng hết lượt"
  }
};

let cart = loadCart();
let voucher = getStoredVoucher();

function getStoredVoucher(){
  try{
    const savedCode=localStorage.getItem("selectedOffer");
    if(!savedCode || !OFFER_CATALOG[savedCode]?.active) return {code:"", active:false};
    return {code:savedCode, active:true};
  }catch(error){
    console.error("Không thể đọc mã ưu đãi đã chọn.",error);
    return {code:"", active:false};
  }
}

function loadCart(){
  try{
    const raw=localStorage.getItem("cart");
    if(!raw)return [];
    const parsed=JSON.parse(raw);
    const items=Array.isArray(parsed)?parsed:(parsed.items||parsed.products||[]);
    if(!Array.isArray(items))return [];
    return items.map(item=>({
      name:String(item.name||item.title||item.productName||"").trim(),
      price:Number(item.price??item.salePrice??item.unitPrice),
      quantity:Number(item.quantity??item.qty??1),
      image:String(item.image||item.img||item.thumbnail||""),
      category:String(item.category||item.type||"")
    })).filter(item=>item.name&&Number.isFinite(item.price)&&item.price>0&&
      Number.isInteger(item.quantity)&&item.quantity>0);
  }catch(error){
    console.error("Không thể đọc giỏ hàng đã lưu.",error);
    return [];
  }
}

const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("vi-VN").format(Math.max(0,Math.round(n)))+"đ";

function setMobileMenuOpen(isOpen){
  const navbar=document.querySelector(".navbar");
  const toggle=$("menuToggle");
  if(!navbar||!toggle)return;
  navbar.classList.toggle("active",isOpen);
  toggle.setAttribute("aria-expanded",String(isOpen));
}

function saveCart({manuallyCleared=false,orderCompleted=false}={}){
  try{
    localStorage.setItem("cart",JSON.stringify(cart));
    localStorage.setItem("cartStateVersion","3");
    localStorage.setItem("cartManuallyCleared",String(manuallyCleared&&cart.length===0));
    localStorage.setItem("cartOrderCompleted",String(orderCompleted));
  }catch(error){
    console.error("Không thể lưu thay đổi giỏ hàng.",error);
    showCheckoutNotice("Không thể cập nhật giỏ hàng trong bộ nhớ trình duyệt. Vui lòng thử lại nhé ♡");
  }
}

$("menuToggle").addEventListener("click",()=>setMobileMenuOpen(true));
$("menuClose").addEventListener("click",()=>setMobileMenuOpen(false));
document.querySelectorAll(".navbar a").forEach(link=>{
  link.addEventListener("click",()=>setMobileMenuOpen(false));
});
$("scrollToTopBtn").addEventListener("click",()=>{
  window.scrollTo({top:0,behavior:"smooth"});
});
$("fullName").addEventListener("input",updateTransferContent);
$("phone").addEventListener("input",updateTransferContent);
document.addEventListener("keydown",event=>{
  if(event.key==="Escape")setMobileMenuOpen(false);
  if(event.key==="Escape")hideCheckoutNotice();
});

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

function updateTransferContent(){
  const name=$("fullName").value.trim();
  const phone=$("phone").value.trim();
  $("transferContent").textContent=name||phone
    ?[name,phone].filter(Boolean).join(" ")
    :"Họ và tên người đặt + SĐT";
}

function updateCartBadge(){
  const badge=document.querySelector(".cart-badge");
  if(badge)badge.textContent=String(cart.reduce((total,item)=>total+item.quantity,0));
}

function renderCart(){
  const itemCount=cart.reduce((total,item)=>total+item.quantity,0);
  $("itemCount").textContent=`${itemCount} sản phẩm`;
  updateCartBadge();

  $("cartList").innerHTML=cart.length?cart.map((item,i)=>`
    <div class="cart-product">
      <div class="product-image">${item.image?`<img src="${escapeHTML(item.image)}" alt="">`:"🍰"}</div>
      <div class="product-info">
        <strong>${escapeHTML(item.name)}</strong>
        <small>Size tiêu chuẩn · Vị bánh</small>
      </div>
      <div class="product-price">${money(item.price*item.quantity)}</div>
      <div class="qty">
        <button type="button" data-action="minus" data-index="${i}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="plus" data-index="${i}">+</button>
      </div>
      <button class="remove" type="button" data-action="remove" data-index="${i}">♧</button>
    </div>
  `).join(""):'<p class="empty-cart">Giỏ hàng đang trống. Hãy quay lại giỏ hàng để chọn bánh nhé.</p>';

  $("summaryItems").innerHTML=cart.map(item=>`
    <div class="summary-item">
      <div class="summary-img">${item.image?`<img src="${escapeHTML(item.image)}" alt="">`:"🍰"}</div>
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <small>${item.quantity} × ${money(item.price)}</small>
      </div>
      <b>${money(item.price*item.quantity)}</b>
    </div>
  `).join("");

  updateTotals();
}

$("cartList").addEventListener("click",e=>{
  const btn=e.target.closest("button[data-action]");
  if(!btn)return;
  const i=Number(btn.dataset.index);
  if(btn.dataset.action==="plus")cart[i].quantity++;
  if(btn.dataset.action==="minus")cart[i].quantity=Math.max(1,cart[i].quantity-1);
  if(btn.dataset.action==="remove")cart.splice(i,1);
  saveCart({manuallyCleared:!cart.length});
  renderCart();
});

function receiveType(){
  return document.querySelector('input[name="receiveType"]:checked')?.value||"delivery";
}
function shippingFee(){
  return receiveType()==="pickup"?0:25000;
}
function subtotal(){
  return cart.reduce((sum,x)=>sum+x.price*x.quantity,0);
}
function isOfferEligible(offer){
  if(!offer.active||subtotal()<(offer.min||0)) return false;
  if(offer.kind==="shipping") return receiveType()==="delivery";
  if(offer.kind==="accessory"){
    return cart.some(item=>/accessor|phụ kiện/i.test(`${item.category} ${item.name}`));
  }
  return true;
}
function offerEligibilityMessage(offer){
  if(!offer.active) return offer.status;
  if(subtotal()<(offer.min||0)){
    return `Đơn cần đạt ${money(offer.min)} (còn thiếu ${money(offer.min-subtotal())}).`;
  }
  if(offer.kind==="shipping"&&receiveType()!=="delivery"){
    return "Chỉ áp dụng cho đơn giao tận nơi.";
  }
  if(offer.kind==="accessory"&&!cart.some(item=>/accessor|phụ kiện/i.test(`${item.category} ${item.name}`))){
    return "Mã này chỉ dùng cho sản phẩm phụ kiện.";
  }
  return "";
}
function discount(){
  if(!voucher.active) return 0;
  const offer=OFFER_CATALOG[voucher.code];
  if(!offer || !offer.active || !isOfferEligible(offer) || subtotal()<(offer.min||0)) return 0;
  if(offer.kind==="shipping") return Math.min(offer.maxDiscount,shippingFee());
  if(offer.amount) return Math.min(offer.amount,subtotal());
  return Math.round(subtotal()*offer.rate);
}
function updateTotals(){
  $("subtotal").textContent=money(subtotal());
  $("shipping").textContent=money(shippingFee());
  $("discount").textContent=discount()>0?"-"+money(discount()):money(0);
  $("total").textContent=money(subtotal()+shippingFee()-discount());
  $("shippingBadge").textContent=shippingFee()===0?"0đ":"Từ 25.000đ";
  renderSelectedVoucher();
}

function renderSelectedVoucher(){
  const offer=OFFER_CATALOG[voucher.code];
  const selectedText=$("voucherSelectionText");
  const selectedCode=$("selectedVoucherCode");
  const card=$("voucherCard");
  const image=$("voucherImage");
  if(offer){
    image.src=offer.image;
    image.alt=`${offer.title} – ưu đãi Love Cake`;
  }else{
    image.removeAttribute("src");
    image.alt="";
  }
  image.hidden=!offer;
  $("voucherName").textContent=offer?offer.title:"Chọn ưu đãi của bạn";
  $("voucherDescription").textContent=offer?offer.description:"Xem các mã đang áp dụng";
  $("voucherRequirement").textContent=offer?offer.requirement:"Chọn mã phù hợp với đơn hàng";
  $("voucherCode").textContent=offer?offer.code:"—";
  selectedText.textContent=voucher.active
    ?(isOfferEligible(offer)?"Đã áp dụng mã":`Đã chọn mã · ${offerEligibilityMessage(offer)}`)
    :"Chưa chọn mã ưu đãi";
  selectedCode.textContent=voucher.active?offer.code:"";
  $("removeVoucher").classList.toggle("hidden",!voucher.active);
  card.classList.toggle("is-empty",!voucher.active);
}

function showCheckoutNotice(message){
  $("noticeMessage").textContent=message;
  $("checkoutNotice").classList.add("show");
  $("checkoutNotice").setAttribute("aria-hidden","false");
  $("confirmNotice").focus();
}

function hideCheckoutNotice(){
  $("checkoutNotice").classList.remove("show");
  $("checkoutNotice").setAttribute("aria-hidden","true");
}

$("confirmNotice").addEventListener("click",hideCheckoutNotice);
$("closeNotice").addEventListener("click",hideCheckoutNotice);
$("checkoutNotice").addEventListener("click",event=>{
  if(event.target===$("checkoutNotice"))hideCheckoutNotice();
});

document.querySelectorAll('input[name="receiveType"]').forEach(r=>{
  r.addEventListener("change",()=>{
    document.querySelectorAll(".receive-option").forEach(x=>x.classList.remove("selected"));
    r.closest(".receive-option").classList.add("selected");
    $("deliveryPanel").classList.toggle("hidden",r.value!=="delivery");
    $("pickupPanel").classList.toggle("hidden",r.value!=="pickup");
    updateTotals();
  });
});

document.querySelectorAll('input[name="payment"]').forEach(r=>{
  r.addEventListener("change",()=>{
    document.querySelectorAll(".payment-option").forEach(x=>x.classList.remove("selected"));
    r.closest(".payment-option").classList.add("selected");
    $("onlineBox").classList.toggle("hidden",r.value!=="online");
  });
});

$("store").addEventListener("change",e=>{
  if(!e.target.value){
    $("mapBox").classList.add("hidden");
    return;
  }
  const [name,city,coords]=e.target.value.split("|");
  const [lat,lng]=coords.split(",");
  $("storeName").textContent=name;
  $("storeAddress").textContent=city;
  $("mapFrame").src=`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  $("direction").href=`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  $("mapBox").classList.remove("hidden");
});

$("removeVoucher").addEventListener("click",()=>{
  voucher.active=false;
  voucher.code="";
  try{
    localStorage.removeItem("selectedOffer");
  }catch(error){
    console.error("Không thể xóa mã ưu đãi đã lưu.",error);
    showCheckoutNotice("Không thể cập nhật mã ưu đãi. Vui lòng thử lại nhé ♡");
    return;
  }
  updateTotals();
});

function validForm(){
  if(!$("fullName").value.trim()||!$("phone").value.trim()||!$("receiveTime").value){
    showCheckoutNotice("Vui lòng điền đầy đủ họ tên, số điện thoại và thời gian nhận bánh nhé ♡");
    return false;
  }
  if(!cart.length){
    showCheckoutNotice("Giỏ hàng đang trống. Bạn hãy chọn bánh trước khi đặt hàng nhé ♡");
    return false;
  }
  if(receiveType()==="delivery"){
    if(!$("city").value||!$("district").value||!$("ward").value||!$("address").value.trim()){
      showCheckoutNotice("Vui lòng điền đầy đủ địa chỉ giao bánh để chúng mình giao bánh đến đúng nơi nhé ♡");
      return false;
    }
  }else if(!$("store").value){
    showCheckoutNotice("Vui lòng chọn chi nhánh nhận bánh nhé ♡");
    return false;
  }
  return true;
}

$("placeOrder").addEventListener("click",()=>{
  if(!validForm())return;
  const paymentMethod=document.querySelector('input[name="payment"]:checked')?.value;
  const paidByBank=paymentMethod==="online";
  $("successTitle").innerHTML=paidByBank
    ?"THANH TOÁN<br>THÀNH CÔNG!"
    :"ĐẶT HÀNG<br>THÀNH CÔNG!";
  $("successScreen").querySelector(".success-content > span").textContent=paidByBank
    ?"Đơn hàng đã được thanh toán qua ngân hàng ✦"
    :"Bạn sẽ thanh toán khi nhận bánh ✦";
  createSuccessBalloons();
  $("successScreen").classList.add("show");

  setTimeout(()=>{
    $("successScreen").classList.remove("show");
    fillInvoice();
    $("invoiceModal").classList.add("show");
    cart=[];
    saveCart({orderCompleted:true});
    renderCart();
  },3000);
});

function createSuccessBalloons(){
  const box=$("successBalloons");
  box.innerHTML="";
  for(let i=0;i<22;i++){
    const b=document.createElement("span");
    b.className="success-balloon";
    b.style.left=Math.random()*100+"%";
    b.style.setProperty("--time",2.2+Math.random()*1.8+"s");
    b.style.setProperty("--drift",-100+Math.random()*200+"px");
    b.style.setProperty("--rotate",-25+Math.random()*50+"deg");
    b.style.background=["#ff5f8a","#ffabc0","#fff","#ffd0dc"][i%4];
    b.style.animationDelay=Math.random()*.5+"s";
    box.appendChild(b);
  }
}

function createFloatingBalloon(){
  if(document.querySelector(".success-screen.show"))return;
  const b=document.createElement("span");
  b.className="floating-balloon";
  b.style.left=Math.random()*95+"%";
  b.style.background=["#ff7da0","#ffb8c9","#f9dce4"][Math.floor(Math.random()*3)];
  b.style.setProperty("--time",7+Math.random()*6+"s");
  b.style.setProperty("--drift",-80+Math.random()*160+"px");
  $("floatingBalloons").appendChild(b);
  setTimeout(()=>b.remove(),14000);
}
function scheduleBalloons(){
  const wait=7000+Math.random()*9000;
  setTimeout(()=>{
    const count=Math.random()>.55?2:1;
    for(let i=0;i<count;i++)setTimeout(createFloatingBalloon,i*650);
    scheduleBalloons();
  },wait);
}
scheduleBalloons();

function fillInvoice(){
  const now=new Date();
  const code="LC"+now.getFullYear()+String(now.getMonth()+1).padStart(2,"0")+String(now.getDate()).padStart(2,"0")+Math.floor(100+Math.random()*900);

  $("invoiceCode").textContent=code;
  $("invoiceDate").textContent=now.toLocaleDateString("vi-VN");
  $("billName").textContent=$("fullName").value.trim();
  $("billPhone").textContent=$("phone").value.trim();

  const d=new Date($("receiveTime").value);
  $("billReceive").textContent=isNaN(d)?$("receiveTime").value:d.toLocaleString("vi-VN");

  let address="";
  if(receiveType()==="delivery"){
    address=[$("address").value,$("ward").value,$("district").value,$("city").value].filter(Boolean).join(", ");
  }else{
    address=$("store").options[$("store").selectedIndex].text;
  }
  $("billAddress").textContent=address;

  $("billItems").innerHTML=cart.map(x=>`
    <div class="bill-row">
      <span>${escapeHTML(x.name)}</span>
      <span>${x.quantity}</span>
      <span>${money(x.price*x.quantity)}</span>
    </div>
  `).join("");

  const pay=document.querySelector('input[name="payment"]:checked')?.value;
  const orderTotal=subtotal()+shippingFee()-discount();
  const paidByBank=pay==="online";
  $("billSubtotal").textContent=money(subtotal());
  $("billShipping").textContent=money(shippingFee());
  $("billDiscount").textContent="-"+money(discount());
  $("billDueLabel").textContent="AMOUNT DUE";
  $("billTotal").textContent=money(paidByBank?0:orderTotal);
  $("billPayment").textContent=paidByBank
    ?"Chuyển khoản ngân hàng / Ví điện tử"
    :"Tiền mặt khi nhận bánh (COD)";
  $("billPaymentStatus").textContent=paidByBank
    ?"Đã thanh toán qua ngân hàng"
    :"Chưa thanh toán · Thanh toán khi nhận bánh";
}

$("closeInvoice").addEventListener("click",()=>$("invoiceModal").classList.remove("show"));
$("printBill").addEventListener("click",()=>window.print());
$("continueShopping").addEventListener("click",()=>window.location.href="../Love-Cake/index.html");

renderCart();
