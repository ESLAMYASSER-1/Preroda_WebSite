var signIn = document.querySelector(".sign-in"),
    signUp = document.querySelector(".sign-up"),
    textLabel = document.querySelector(".hed"),
    Form = document.querySelector(".inputs-cont"),
    Form2 = document.querySelector(".inputs-cont2"),
    UserDetails = document.querySelector(".input-take"),
    goSignUP = document.querySelector(".send1");
    Form2.style.display="none";
    signIn.onclick = function(){
      "use strict";
      Form.style.display="none";
      Form2.style.display="block";
      document.title = 'Sign In';
      textLabel.innerHTML = "Sign Up <lighter> or </lighter><span>Sign In </span>";
    };
    signUp.onclick = function(){
      "use strict";
      Form2.style.display="none";
      Form.style.display="block";
      document.title = 'Sign Up';
      textLabel.innerHTML = "Sign In <lighter> or </lighter><span>Sign Up </span>";
    };

    goSignUP.onclick = function(){
      "use strict";
      Form2.style.display="none";
      Form.style.display="block";
      document.title = 'Sign Up';
      textLabel.innerHTML = "Sign In <lighter> or </lighter><span>Sign Up </span>";
    };
