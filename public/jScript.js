const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");
const roomID = urlParams.get("room");
const password = urlParams.get("password");
var errorSnack = "";

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    if (user.isAnonymous === true && type === "t") {
      alert("You need to be signed-in to conduct classes");
      window.location.replace("/login.html");
    } else if (type === "s") {
      console.log("talk to db");
      document.getElementById("emailLabel").innerHTML = "Username";
      document.getElementById("passwordLabel").innerHTML = "Roll number";
      document.getElementById("email").disabled = false;
      document.getElementById("password").disabled = false;
    } else if (user.isAnonymous === false && type === "t") {
      document.getElementById("emailLabel").innerHTML = "Room ID";
      document.getElementById("passwordLabel").innerHTML = "Password";
      document.getElementById("email").value = roomID;
      document.getElementById("password").value = password;
      document.getElementById("password").value = "password";
      document.getElementById("email").disabled = true;
      document.getElementById("password").disabled = true;
    } else {
      errorSnack = "You need an access link to join a room.";
      document.getElementById("demo-show-snackbar").click();
    }
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
  } else {
    if (type === "t") {
      alert("You need to sign-up in order to conduct classes");
      window.location.replace("/login.html");
    } else if (type === "s") {
      console.log("error1");
      anonymousSignin();
    } else {
      errorSnack = "You need an access link to join a room.";
      document.getElementById("demo-show-snackbar").click();
    }
    // User is signed out.
    // ...
  }
  // ...
});
document.getElementById("submit").addEventListener("click", function () {
  console.log(typeof(password))
  const submitReq = {
    roomID: "S10SnRxLaAXzB4bYlAS7",
    password: parseInt(password),
    type: type,
  };
  //fetch("https://us-central1-fir-rtc-926a7.cloudfunctions.net/widgets/join", {
  
  fetch("https://us-central1-fir-rtc-926a7.cloudfunctions.net/widgets/join", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submitReq),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 2 && type === "s") {
        errorSnack =
          "Link is not valid. Contact your teacher to get the correct link.";
        document.getElementById("demo-show-snackbar").click();
      } else if (data.status === 2 && type === "t") {
        errorSnack =
          "Link is not valid. Contact your collegue to get correct access link.";
        document.getElementById("demo-show-snackbar").click();
      } else if (data.status === 7) {
        if (typeof Storage !== "undefined") {
          localStorage.setItem("className", data.className);
          localStorage.setItem("jitsi", data.jitsi);
          localStorage.setItem("whiteboard", data.whiteboard);
          // Code for localStorage/sessionStorage.
          if (type === "s") {
            var person = prompt("Please enter the type of room\npro - For modern devices with fast internet\nlite - For old devices with poor interent", "pro");
            if(person == "pro"){  
            window.location.replace("/studentProRoom.html")
          }else if(person == "lite"){
            window.location.replace("/studentLiteRoom.html")
          }
          } else if (type === "t") {
            if (data.teacher === "none") {
              window.location.replace("/teacherRoom.html")

            } else {
              errorSnack =
                "Teacher is present. Wait till he/she leaves and try again.";
              document.getElementById("demo-show-snackbar").click();
            }
          }
        } else {
          errorSnack = "Web storage not found. Please use Chrome.";
          document.getElementById("demo-show-snackbar").click();
          // Sorry! No Web Storage support..
        }
      }
      //window.location.replace("/console.html");
    })
    .catch((error) => {
      alert("Error: Wrong link format");
      window.location.replace("/404.html");
    });
});
function anonymousSignin() {
  firebase
    .auth()
    .signInAnonymously()
    .catch(function (error) {
      console.log("error");
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}
(function () {
  "use strict";
  var snackbarContainer = document.querySelector("#demo-snackbar-example");
  var showSnackbarButton = document.querySelector("#demo-show-snackbar");
  var handler = function (event) {
    showSnackbarButton.style.backgroundColor = "";
  };
  showSnackbarButton.addEventListener("click", function () {
    "use strict";
    showSnackbarButton.style.backgroundColor =
      "#" + Math.floor(Math.random() * 0xffffff).toString(16);
    var data = {
      message: errorSnack,
      timeout: 2000,
      actionHandler: handler,
      actionText: "X",
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  });
})();
var current = null;
document.querySelector("#email").addEventListener("focus", function (e) {
  if (current) current.pause();
  current = anime({
    targets: "path",
    strokeDashoffset: {
      value: 0,
      duration: 700,
      easing: "easeOutQuart",
    },
    strokeDasharray: {
      value: "240 1386",
      duration: 700,
      easing: "easeOutQuart",
    },
  });
});
document.querySelector("#password").addEventListener("focus", function (e) {
  if (current) current.pause();
  current = anime({
    targets: "path",
    strokeDashoffset: {
      value: -336,
      duration: 700,
      easing: "easeOutQuart",
    },
    strokeDasharray: {
      value: "240 1386",
      duration: 700,
      easing: "easeOutQuart",
    },
  });
});
document.querySelector("#submit").addEventListener("focus", function (e) {
  if (current) current.pause();
  current = anime({
    targets: "path",
    strokeDashoffset: {
      value: -730,
      duration: 700,
      easing: "easeOutQuart",
    },
    strokeDasharray: {
      value: "530 1386",
      duration: 700,
      easing: "easeOutQuart",
    },
  });
});
