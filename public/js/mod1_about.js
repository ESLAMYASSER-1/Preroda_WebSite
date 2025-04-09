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
