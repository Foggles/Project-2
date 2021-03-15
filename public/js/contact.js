document.addEventListener('DOMContentLoaded', (e) => {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const error_message = document.getElementById("error_message");
    const submit = document.getElementById("myform");


    submit.addEventListener('submit', handleFormSubmit);

    // error_message.style.padding = "10px";

    // const text;
    // if (name.length < 5) {
    //     text = "Please Enter valid Name";
    //     error_message.innerHTML = text;
    //     return false;
    // }
    // if (subject.length < 10) {
    //     text = "Please Enter Correct Subject";
    //     error_message.innerHTML = text;
    //     return false;
    // }
    // if (isNaN(phone) || phone.length != 10) {
    //     text = "Please Enter valid Phone Number";
    //     error_message.innerHTML = text;
    //     return false;
    // }
    // if (email.indexOf("@") == -1 || email.length < 6) {
    //     text = "Please Enter valid Email";
    //     error_message.innerHTML = text;
    //     return false;
    // }
    // if (message.length <= 140) {
    //     text = "Please Enter More Than 140 Characters";
    //     error_message.innerHTML = text;
    //     return false;
    // }
    // alert("Form Submitted Successfully!");
    // return true;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // if (!NameInput.value || !MessageInput.value || !PhoneInput.value || !EmailInput.value) {
        //   alert('Your post is missing some content');
        // }
    
        // Create a newPost object to send off to the backend
        const newPost = {
          Name: NameInput.value.trim(),
          Message: MessageInput.value.trim(),
          Phone: PhoneInput.value.trim(),
          Email: EmailInput.value.trim(),
        };
        console.log('handleFormSubmit -> newPost', newPost);

        submitPost(newPost);
        
      };

     

      const submitPost = (post) => {
        fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(post),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success in submitting post:', data);
            window.location.href = '/signup';
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      };



});

