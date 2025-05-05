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




document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  // Update progress
  xhr.upload.addEventListener('progress', function (e) {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      document.getElementById('uploadProgress').value = percent;
      document.getElementById('progressText').textContent = percent + '%';
    }
  });

  xhr.onload = function () {
    if (xhr.status === 200) {
      alert('Upload successful!');
    } else {
      alert('Upload failed.');
    }
  };

  xhr.open('POST', '/upload');
  xhr.send(formData);
});