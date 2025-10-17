// --- Popups ---
function openPopup(id){
  const el = document.getElementById(id);
  if(el) el.style.display = 'flex';
}
function closePopup(id){
  const el = document.getElementById(id);
  if(el) el.style.display = 'none';
}

// --- Profile Widget ---
function toggleProfileWidget(){
  const widget = document.getElementById('profileWidget');
  widget.style.display = widget.style.display === 'block' ? 'none' : 'block';
}
window.addEventListener('click', e=>{
  const widget = document.getElementById('profileWidget');
  const icon = document.querySelector('.profile-icon');
  if(widget && icon && !widget.contains(e.target) && !icon.contains(e.target)){
    widget.style.display = 'none';
  }
});

// --- Chatbot ---
function toggleChatbot(){
  const bot = document.getElementById('chatbotWindow');
  bot.style.display = bot.style.display === 'none' ? 'flex' : 'none';
}
function sendMessage(){
  const input = document.getElementById('chatInput');
  const log = document.getElementById('chatLog');
  const msg = input.value.trim();
  if(!msg) return;
  log.innerHTML += `<div class="message user-message">${escapeHtml(msg)}</div>`;
  log.innerHTML += `<div class="message bot-message">${escapeHtml(getBotResponse(msg))}</div>`;
  input.value='';
  log.scrollTop = log.scrollHeight;
}
function getBotResponse(msg){
  msg = msg.toLowerCase();
  if(msg.includes("hello")||msg.includes("hi")) return "Hello! How can I assist you?";
  if(msg.includes("how are you")) return "I’m doing well, thank you!";
  if(msg.includes("riyadh")) return "Riyadh is the capital of Saudi Arabia!";
  return "Sorry, I don't understand that yet.";
}

// --- Escape HTML ---
function escapeHtml(str){
  if(str==null) return '';
  return String(str).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

// --- Logout ---
function logout(){
  localStorage.removeItem('currentUser');
  alert('You have been logged out!');
  document.getElementById('profileName').textContent = 'John Doe';
  document.getElementById('profileEmail').textContent = 'john.doe@example.com';
}

// --- Edit Profile ---
function saveProfile(){
  const name = document.getElementById('editName').value;
  const email = document.getElementById('editEmail').value;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(currentUser){
    currentUser.name = name || currentUser.name;
    currentUser.email = email || currentUser.email;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
  }
  closePopup('editProfilePopup');
}

// --- Sign Up ---
document.getElementById('signUpForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const age = document.getElementById('signupAge').value.trim();
  const pwd = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const errorEl = document.getElementById('signupError');
  const successEl = document.getElementById('signupSuccess');
  errorEl.textContent=''; successEl.textContent='';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!name||!email||!age||!pwd||!confirm){ errorEl.textContent='❌ All fields are required.'; return; }
  if(!emailPattern.test(email)){ errorEl.textContent='❌ Please enter a valid email.'; return; }
  if(pwd!==confirm){ errorEl.textContent='❌ Password and confirmation do not match.'; return; }
  if(age<1||age>120){ errorEl.textContent='❌ Please enter a valid age.'; return; }

  // --- Check if user exists ---
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  if(users.some(u=>u.email === email)){
    errorEl.textContent='❌ This email is already registered.';
    return;
  }

  const newUser = {name,email,password:pwd,age};
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));

  // Update profile widget
  document.getElementById('profileName').textContent = name;
  document.getElementById('profileEmail').textContent = email;

  successEl.textContent=`✅ Successfully registered! You are now logged in.`;
  e.target.reset();
  setTimeout(()=>closePopup('signUpPopup'),2000);
});

// --- Log In ---
document.getElementById('logInForm').addEventListener('submit', e=>{
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pwd = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  errorEl.textContent='';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(email)){ errorEl.textContent='❌ Please enter a valid email.'; return; }
  if(!pwd){ errorEl.textContent='❌ Please enter your password.'; return; }

  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u=>u.email===email && u.password===pwd);
  if(!user){
    errorEl.textContent='❌ Invalid email or password.';
    return;
  }

  // Login success
  localStorage.setItem('currentUser', JSON.stringify(user));
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  alert('✅ Logged In!');
  closePopup('logInPopup');
  e.target.reset();
});

// --- Close buttons ---
document.querySelectorAll('.close-btn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const target = e.currentTarget.dataset.close;
    if(target) closePopup(target);
  });
});

// --- Click outside popup ---
document.querySelectorAll('.popup-overlay').forEach(overlay=>{
  overlay.addEventListener('click', e=>{
    if(e.target===overlay) overlay.style.display='none';
  });
});
