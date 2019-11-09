// Logout BTN
$(".logout").click(function(){
   axios.post("/users/logout").then(() => {
      location.reload()
   }).catch(e => {
      Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: e.response.data,
      })
   })
})

// Add Task BTN
$(".addTaskBtn").click(function() {
   const task = $(".taskInput").val()
   axios.post("/tasks", {
      content: task
   }).then(() => {
      location.reload()
   }).catch(e => {
      Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: e.response.data,
      })
   })
})

// Delete Task BTN
$(".deleteTask").click(function() {
   const taskID = $(this).attr("id")
   var confirmation = confirm("Do You Want To Delete This Task ?")
   if(confirmation) {
      axios.delete(`/tasks/${taskID}`).then(() => {
         location.reload()
      }).catch(e => {
         Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e.response.data,
         })
      })
   }
})


// Edit Task BTN
$(".editTask").click(function() {
   const taskID = $(this).attr("id")
   const taskText = $(this).parent().text()
   Swal.fire({
      title: 'Enter your edits',
      input: 'text',
      inputValue: taskText,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
   }).then(value => {
      if(value.value) {
         axios.patch(`/tasks/${taskID}`, {
            content: value.value
         }).then(() => {
            Swal.fire(
               'Success!',
               'Your Task is edited successfully',
               'success'
             ).then(() => {
               location.reload()
            })
         }).catch(e => {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: e.response.data,
            })
         })
      }
   })
})


// Edit Username
$(".editUsername").click(function() {
   const text = $(this).siblings("span").text()
   Swal.fire({
      title: 'Enter your edits',
      input: 'text',
      inputValue: text,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
   }).then(value => {
      if(value.value) {
         axios.patch(`/users/me`, {
            username: value.value
         }).then(() => {
            Swal.fire(
               'Success!',
               'Your username is changed successfully',
               'success'
             ).then(() => {
               location.reload()
            })
         }).catch(e => {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: e.response.data,
            })
         })
      }
   })
})

// Edit Phone
$(".editPhone").click(function() {
   const text = $(this).siblings("span").text()
   Swal.fire({
      title: 'Enter your edits',
      input: 'number',
      inputValue: text,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
   }).then(value => {
      if(value.value) {
         axios.patch(`/users/me`, {
            phone: value.value
         }).then(() => {
            Swal.fire(
               'Success!',
               'Your Phone Number is changed successfully',
               'success'
             ).then(() => {
               location.reload()
            })
         }).catch(e => {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: e.response.data,
            })
         })
      }
   })
})

// Edit Age
$(".editAge").click(function() {
   const text = $(this).siblings("span").text()
   Swal.fire({
      title: 'Enter your edits',
      input: 'number',
      inputValue: text,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
   }).then(value => {
      if(value.value) {
         axios.patch(`/users/me`, {
            age: value.value
         }).then(() => {
            Swal.fire(
               'Success!',
               'Your Age is changed successfully',
               'success'
             ).then(() => {
               location.reload()
            })
         }).catch(e => {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: e.response.data,
            })
         })
      }
   })
})

// Edit Email Address
$(".editEmail").click(function() {
   const text = $(this).siblings("span").text()
   Swal.fire({
      title: 'Enter your new email address',
      input: 'email',
      inputValue: text,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
   }).then(value => {
      if(value.value) {
         axios.patch(`/users/me`, {
            email: value.value
         }).then(() => {
            Swal.fire(
               'Success!',
               'Your Email is changed successfully',
               'success'
             ).then(() => {
               location.reload()
            })
         }).catch(e => {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: e.response.data,
            })
         })
      }
   })
})

// Edit Age
$(".editPassword").click(function() {
   Swal.fire({
      title: 'Enter Your Password',
      html:
        `
      <label>Enter New Password</label>
      <input type="password" id="swal-input1" class="swal2-input">
      <label>Confirm New Password</label>
      <input type="password" id="swal-input2" class="swal2-input">
         `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    }).then(value => {
      if(value.value.length > 0) {
         if (value.value[0] !== value.value[1]) {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: "Password Doesn't Match"
            })
         } else {
            axios.patch(`/users/me`, {
               password: value.value[0]
            }).then(() => {
               Swal.fire(
                  'Success!',
                  'Your password is changed successfully',
                  'success'
                ).then(() => {
                  location.reload()
               })
            }).catch(e => {
               Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: e.response.data,
               })
            })
         }
      }
   })
})

// Edit Profile Picture
$(".userImageE").click(function() {
   Swal.fire({
      title: 'Choose your new picture',
      input: 'file',
      showCancelButton: true
   }).then(value => {
      if(value.value) {
         const file = new Blob([value.value], { type: 'image/jpg' });
         const formData = new FormData();
         formData.append('avatar', file, file.filename);
         axios.post(`/users/uploadAvatar`, formData).then(() => {
            Swal.fire(
               'Success!',
               'Your Image is uploaded successfully',
               'success'
             ).then(() => {
               location.reload()
            })
         }).catch(e => {
            Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: e.response.data,
            })
         })
      }
   })
})