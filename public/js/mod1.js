var header = document.getElementById("header")
window.onscroll = function() {myFunction()};

function myFunction() {
  if (document.body.scrollTop > 950 || document.documentElement.scrollTop > 950) {
    header.id = "header1"
} else {
    header.id = "header"
  }
}


var btn_12 = document.getElementsByClassName("btn-12")[0]
btn_12.addEventListener('click', ()=>{
    window.scrollTo({
        top: 1000,
        behavior: "smooth",
      });
    
})