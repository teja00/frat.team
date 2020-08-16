document.getElementById("quizForm").style.display = "none";
var clipboard = new ClipboardJS(".btn");
var USER_CRED;
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function (user) {
  if (user && user.isAnonymous === false) {
    USER_CRED = user;
    //alert("hey guy")
    document.getElementById("displayName").innerHTML = user.displayName;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("picture").src = user.photoURL;
    //email = user.email;
    //photoUrl = user.photoURL;;
    var docRef = db
      .collection("users")
      .doc(USER_CRED.email)
      .collection("rooms");
    docRef
      .get()
      .then(function (querySnapshot) {
        //console.log(querySnapshot.docs)
        if (querySnapshot.docs.length === 0) {
          document.getElementById("classLoad").innerText =
            "Create a classroom to get started!";
        }
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          document.getElementById("classLoad").style.display = "none";
          const uuid = doc.data().className;
          const tPass = doc.data().teacherPassword;
          const sPass = doc.data().studentPassword;
          var d1 = document.getElementById("classRoomTag");
          d1.insertAdjacentHTML(
            "beforeend",
            '<div class="tab"> <input type="checkbox" id="' +
              doc.id +
              '" class="listInput"> <label class="tab-label" for="' +
              doc.id +
              '">' +
              uuid +
              '</label> <div class="tab-content"> <ul class="demo-list-icon mdl-list"> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">cast_for_education</i> <span class="mdl-chip mdl-chip--deletable"><span class="mdl-chip__text"><a href="/join.html?type=t&room=' +
              doc.id +
              "&password=" +
              tPass +
              '" target="_blank">Start class</a></span> <button type="button" data-clipboard-text="https://frat.team/join.html?type=t&room=' +
              doc.id +
              "&password=" +
              tPass +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span></li> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">enhanced_encryption</i> <span class="mdl-chip mdl-chip--deletable"> <span class="mdl-chip__text"><a href="/join.html?type=s&room=' +
              doc.id +
              "&password=" +
              sPass +
              '" target="_blank">Link for students</a> </span> <button type="button" data-clipboard-text="https://frat.team/join.html?type=s&room=' +
              doc.id +
              "&password=" +
              sPass +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li> </ul> </div> </div>'
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    db.collection("users")
      .doc(USER_CRED.email)
      .collection("quiz")
      .get()
      .then(function (querySnapshot) {
        //console.log(querySnapshot.docs)
        if (querySnapshot.docs.length === 0) {
          document.getElementById("quizLoad").innerText =
            "Add a quiz to get started!";
        }
        querySnapshot.forEach(function (doc) {
          document.getElementById("quizLoad").style.display = "none";

          console.log("quiz written with ID: ", doc.id);
          var d1 = document.getElementById("quizTag");
          const uuid = doc.id;
          const quizName = doc.data().quizName;
          const quizLink = doc.data().quizLink;
          d1.insertAdjacentHTML(
            "beforeend",
            '<div class="tab"> <input type="checkbox" id="' +
              uuid +
              '" class="listInput"> <label class="tab-label" for="' +
              uuid +
              '">' +
              quizName +
              '</label> <div class="tab-content"> <ul class="demo-list-icon mdl-list">  <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">link</i> <span class="mdl-chip mdl-chip--deletable"> <span class="mdl-chip__text">Copy quiz link</span> <button type="button" data-clipboard-text="' +
              quizLink +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li> </ul> </div> </div>'
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    db.collection("users")
      .doc(USER_CRED.email)
      .collection("attendance")
      .get()
      .then(function (querySnapshot) {
        //console.log(querySnapshot.docs)
        if (querySnapshot.docs.length === 0) {
          document.getElementById("attendanceLoad").innerText =
            "You can use smart attendance only during a class. Download the attendance excel file after the class by pressing the take attendance button!";
        }
        querySnapshot.forEach(function (doc) {
          document.getElementById("attendanceLoad").style.display = "none";

          console.log("attendance written with ID: ", docRef.id);
          var d1 = document.getElementById("attendanceTag");
          const uuid = doc.id;
          const attTime = doc.data().attendanceTime;
          const attLink = doc.data().attendanceLink;
          d1.insertAdjacentHTML(
            "beforeend",
            '<div class="tab"> <input type="checkbox" id="' +
              uuid +
              '" class="listInput"> <label class="tab-label" for="' +
              uuid +
              '">' +
              attendanceTime +
              '</label> <div class="tab-content"> <ul class="demo-list-icon mdl-list"> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">assignment</i> <span class="mdl-chip mdl-chip--deletable"><span class="mdl-chip__text">' +
              uuid +
              '</span> <button type="button" data-clipboard-text="' +
              uuid +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span></li> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">link</i> <span class="mdl-chip mdl-chip--deletable"> <span class="mdl-chip__text">Copy quiz link</span> <button type="button" data-clipboard-text="' +
              attendanceLink +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li> </ul> </div> </div>'
          );
        });
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  } else {
    //alert("Dwight, get out of my nook")
    window.location.replace("/login.html");
  }
});
console.log("gis");
document
  .getElementById("createRoom")
  .addEventListener("click", addNewClassroomField);
function addNewClassroomField() {
  document.getElementById("addNewClassroomField").click();
  document.getElementById("search-expandable1").style.display = "block";
}
document
  .querySelector("#search-expandable1")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      var classroomName = document.getElementById("search-expandable1").value;
      var uuid = generateRandomString(72);
      console.log(uuid);
      console.log("room", classroomName);
      var tPass = Math.floor(Math.random() * 1000000);
      var sPass = Math.floor(Math.random() * 1000000);
      console.log(tPass, sPass);
      db.collection("rooms")
        .add({
          teacher: "none",
          className: classroomName,
          teacherPassword: tPass,
          studentPassword: sPass,
          jitsi: uuid,
          whiteboard: uuid,
          closed: false,
          startClass: false
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          uuid = docRef.id;
          db.collection("users")
            .doc(USER_CRED.email)
            .collection("rooms")
            .doc(docRef.id)
            .set({
              className: classroomName,
              teacherPassword: tPass,
              studentPassword: sPass,
            })
            .then(function (res) {
              console.log("success");
              var d1 = document.getElementById("classRoomTag");
              d1.insertAdjacentHTML(
                "beforeend",
                '<div class="tab"> <input type="checkbox" id="' +
                docRef.id +
              '" class="listInput"> <label class="tab-label" for="' +
              docRef.id +
              '">' +
              classroomName +
              '</label> <div class="tab-content"> <ul class="demo-list-icon mdl-list"> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">cast_for_education</i> <span class="mdl-chip mdl-chip--deletable"><span class="mdl-chip__text"><a href="/join.html?type=t&room=' +
              docRef.id +
              "&password=" +
              tPass +
              '" target="_blank">Start class</a></span> <button type="button" data-clipboard-text="https://frat.team/join.html?type=t&room=' +
              docRef.id +
              "&password=" +
              tPass +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span></li> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">enhanced_encryption</i> <span class="mdl-chip mdl-chip--deletable"> <span class="mdl-chip__text"><a href="/join.html?type=s&room=' +
              docRef.id +
              "&password=" +
              sPass +
              '" target="_blank">Link for students</a> </span> <button type="button" data-clipboard-text="https://frat.team/join.html?type=s&room=' +
              docRef.id +
              "&password=" +
              sPass +
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li> </ul> </div> </div>'
              );
            });
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
      document.getElementById("search-expandable1").value = "";
      document.getElementById("search-expandable1").style.display = "none";
      document.getElementById("addNewClassroomField").click();
    }
  });
const generateRandomString = function (l = 27) {
  var text = "";
  var char_list =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < l; i++) {
    text += char_list.charAt(Math.floor(Math.random() * char_list.length));
  }
  return text;
};
document
  .getElementById("createQuiz")
  .addEventListener("click", addNewQuizField);
function addNewQuizField() {
  document.getElementById("createQuiz").style.display = "none";
  document.getElementById("quizForm").style.display = "block";
}

document.getElementById("saveQuizForm").addEventListener("click", () => {
  document.getElementById("createQuiz").style.display = "block";
  document.getElementById("quizForm").style.display = "none";
  const quizName = document.getElementById("search-expandable2").value;
  const quizLink = document.getElementById("search-expandable3").value;
  console.log("hey");
  db.collection("users")
    .doc(USER_CRED.email)
    .collection("quiz")
    .add({
      quizName: quizName,
      quizLink: quizLink,
    })
    .then(function (docRef) {
      console.log("quiz written with ID: ", docRef.id);
      var d1 = document.getElementById("quizTag");
      const uuid = docRef.id;
      d1.insertAdjacentHTML(
        "beforeend",
        '<div class="tab"> <input type="checkbox" id="' +
          uuid +
          '" class="listInput"> <label class="tab-label" for="' +
          uuid +
          '">' +
          quizName +
          '</label> <div class="tab-content"> <ul class="demo-list-icon mdl-list">  <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">link</i> <span class="mdl-chip mdl-chip--deletable"> <span class="mdl-chip__text">Copy quiz link</span> <button type="button" data-clipboard-text="' +
          quizLink +
          '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li> </ul> </div> </div>'
      );
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
});
document.getElementById("cancelQuizForm").addEventListener("click", () => {
  document.getElementById("createQuiz").style.display = "block";
  document.getElementById("quizForm").style.display = "none";
});
