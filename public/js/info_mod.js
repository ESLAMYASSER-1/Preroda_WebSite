var header = document.getElementById("header")
window.onscroll = function() {myFunction()};

function myFunction() {
  if (document.body.scrollTop > window.innerHeight-50 || document.documentElement.scrollTop > window.innerHeight-50) {
    header.id = "header1"
} else {
    header.id = "header"
  }
}


var UtilitiesLink = document.getElementById("UtilitiesLink")
UtilitiesLink.addEventListener('click', ()=>{
    window.location.href = '/'
    setTimeout(()=>{
        window.scrollTo({
            top: 1000,
            behavior: "smooth",
          });
          console.log("ok")
      }, 30);    
})

function clearCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

var userImage = document.getElementById('user')
userImage.addEventListener('click',()=>{
  if(window.confirm("Are you sure you want to LogOut?!")){
    var cookies= document.cookie.split(";")
    for(var i=0;i<cookies.length;i++){
      // console.log(cookies[i].split('=')[0].trim())
      clearCookie(cookies[i].split('=')[0].trim())
    }
    window.location.href="/"
  }  
})


function showTab(tabId, el) {
    // Remove 'active' class from all tabs and content
    var tabs = document.getElementsByClassName('tab')
    for(var i=0; i<tabs.length; i++){
        tabs[i].classList = ['tab']
    }

    var contents = document.getElementsByClassName('content')
    for(var i=0; i<tabs.length; i++){
        contents[i].classList = ['content']
    }
    el.classList = ['tab active']  
    document.getElementById(tabId).classList = ['content active']  
    // Add 'active' class to the clicked tab and corresponding content
    // document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
    // document.getElementById(tabId).classList.add('active');
}

var el_1 = document.getElementById("1")
el_1.addEventListener('click', ()=>{
    showTab('overview', el_1)
})

var el_2 = document.getElementById("2")
el_2.addEventListener('click', ()=>{
    showTab('water', el_2)
})

var el_3 = document.getElementById("3")
el_3.addEventListener('click', ()=>{
    showTab('crop', el_3)
})

var el_4 = document.getElementById("4")
el_4.addEventListener('click', ()=>{
    showTab('unet', el_4)
})