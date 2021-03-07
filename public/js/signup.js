$(document).ready(() => {


  const form  = document.getElementById('sign-up-form');

  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");


  function getSelectedRole (){
    const radios = document.querySelectorAll(".role-radio");

    const selected = Array.from(radios).find((radio) => radio.checked);


    return selected.getAttribute('data-role-id');
  }
  form.addEventListener("submit",function(e){
    e.preventDefault();
    const selectedRole = getSelectedRole();
    // TODO: if selected if empty, we want to throw an error
    
    fetch('/api/signup', {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
        RoleId: selectedRole,

      })
    }).then(async (res) => {
      if(res.status !== 200){
        const formErrors = document.querySelector('.form-errors');
        formErrors.textContent = ""
        const result = await res.json();
        const errors = result.errors;
        const ul = document.createElement('ul');

        console.log({formErrors});

        for (let index = 0; index < errors.length; index++) {
          const error = errors[index];
          const li = document.createElement('li');
          li.textContent = error.msg;
          ul.append(li)  
        }

        formErrors.append(ul);
      }

      window.location.replace("login");
    })
  })
//     // Getting references to our form and input
//     const signUpForm = $("form.signup");
//     const emailInput = $("input#email-input");
//     const passwordInput = $("input#password-input");
  
//     // When the signup button is clicked, we validate the email and password are not blank
//     signUpForm.on("submit", event => {
//       event.preventDefault();
//       const userData = {
//         email: emailInput.val().trim(),
//         password: passwordInput.val().trim()
//       };
  
//       if (!userData.email || !userData.password) {
//         return;
//       }
//       // If we have an email and password, run the signUpUser function
//       signUpUser(userData.email, userData.password);
//       emailInput.val("");
//       passwordInput.val("");
//     });
  
//     // Does a post to the signup route. If successful, we are redirected to the members page
//     // Otherwise we log any errors
    // function signUpUser(email, password) {
    //   $.post("/api/signup", {
    //     email: email,
    //     password: password
    //   })
    //     .then(() => {
    //       window.location.replace("/members");
    //       // If there's an error, handle it by throwing up a bootstrap alert
    //     })
    //     .catch(handleLoginErr);
    // }
  
//     function handleLoginErr(err) {
//       $("#alert .msg").text(err.responseJSON);
//       $("#alert").fadeIn(500);
//     }
  });
  

