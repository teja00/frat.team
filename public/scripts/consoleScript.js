document.getElementById("quizForm").style.display = "none";
var clipboard = new ClipboardJS(".btn");
var USER_CRED;
var db = firebase.firestore();
var roomData = {};
var roomID;
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
          roomData[doc.id] = {
            className: uuid,
            tPass: tPass,
            sPass: sPass,
          };
          var d1 = document.getElementById("classRoomTag");
          d1.insertAdjacentHTML(
            "beforeend",
            '<option value="' + doc.id + '">' + uuid + "</option>"
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

document
  .getElementById("createRoom")
  .addEventListener("click", addNewClassroomField);
function addNewClassroomField() {
  document.getElementById("addNewClassroomField").click();
  document.getElementById("search-expandable1").style.display = "block";
}
document.getElementById("calenderContainer").style.display = "block";

function roomChangeFunction() {
  roomID = document.getElementById("classRoomTag").value;
  var array = [];
  try {
    $("#calendar").fullCalendar("removeEvents");
    if (roomID !== "none") {
      db.collection("calendar")
        .doc(roomID)
        .get()
        .then(function (doc) {
          console.log(doc.data());
          var dummy = doc.data();
          for (let key in doc.data()) {
            console.log(dummy[key]);
            array.push(dummy[key]);
          }
          $("#calendar").fullCalendar("addEventSource", array);
        });
    }
  } catch (e) {
    e = "";
  }
  roomData[roomID];
  document.getElementById("linkContainer").innerHTML =
    '<div class="tab"> <input type="checkbox" checked id="' +
    roomID +
    '" class="listInput"> <label class="tab-label" for="' +
    roomID +
    '">Teacher link | Student link | Referral link</label> <div class="tab-content"> <ul class="demo-list-icon mdl-list"> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">cast_for_education</i> <span class="mdl-chip mdl-chip--deletable"><span class="mdl-chip__text"><a href="/join.html?type=t&room=' +
    roomID +
    "&password=" +
    roomData[roomID].tPass +
    '" target="_blank">Link for teachers</a></span> <button type="button" data-clipboard-text="https://frat.team/join.html?type=t&room=' +
    roomID +
    "&password=" +
    roomData[roomID].tPass +
    '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span></li> <li class="mdl-list__item"> <span class="mdl-list__item-primary-content"> <i class="material-icons mdl-list__item-icon">enhanced_encryption</i> <span class="mdl-chip mdl-chip--deletable"> <span class="mdl-chip__text"><a href="/join.html?type=s&room=' +
    roomID +
    "&password=" +
    roomData[roomID].sPass +
    '" target="_blank">Link for students</a> </span> <button type="button" data-clipboard-text="https://frat.team/join.html?type=s&room=' +
    roomID +
    "&password=" +
    roomData[roomID].sPass +
    '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li><li class="mdl-list__item"><i class="material-icons mdl-list__item-icon">group_add</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn" data-clipboard-text="' +
    roomData[roomID].className +
    "/" +
    roomID +
    "/" +
    roomData[roomID].tPass +
    "/" +
    roomData[roomID].sPass +
    '" data-toggle="tooltip" title="Click to copy">Referral link</button></li> </ul>Referral link - ' +
    roomData[roomID].className +
    "/" +
    roomID +
    "/" +
    roomData[roomID].tPass +
    "/" +
    roomData[roomID].sPass +
    " </div></div>";
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
          startClass: false,
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
              roomData[uuid] = {
                className: classroomName,
                tPass: tPass,
                sPass: sPass,
              };
              var d1 = document.getElementById("classRoomTag");
              d1.insertAdjacentHTML(
                "beforeend",
                '<option value="' + uuid + '">' + classroomName + "</option>"
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
var newEvent;
var editEvent;
$(document).ready(function () {
  var calendar = $("#calendar").fullCalendar({
    eventRender: function (event, element, view) {
      var startTimeEventInfo = moment(event.start).format("HH:mm");
      var endTimeEventInfo = moment(event.end).format("HH:mm");
      var displayEventDate;
      if (event.allDay == false) {
        displayEventDate = startTimeEventInfo + " - " + endTimeEventInfo;
      } else {
        displayEventDate = "All Day";
      }

      element.popover({
        title:
          '<div class="popoverTitleCalendar" style="background-color:' +
          event.backgroundColor +
          "; color:" +
          event.textColor +
          '">' +
          event.title +
          "</div>",
        content:
          '<div class="popoverInfoCalendar">' +
          "<p><strong>Calendar:</strong> " +
          event.calendar +
          "</p>" +
          "<p><strong>Event Type:</strong> " +
          event.type +
          "</p>" +
          "<p><strong>Event Time:</strong> " +
          displayEventDate +
          "</p>" +
          '<div class="popoverDescCalendar"><strong>Description:</strong> ' +
          event.description +
          "</div>" +
          "</div>",
        delay: {
          show: "800",
          hide: "50",
        },
        trigger: "hover",
        placement: "top",
        html: true,
        container: "body",
      });
      element.css("background", "#000046");
      element.css(
        "background",
        "-webkit-linear-gradient(to right, #1CB5E0, #000046"
      );
      element.css("background", "linear-gradient(to right, #1CB5E0, #000046");

      var show_username,
        show_type = true,
        show_calendar = true;

      return show_username && show_type && show_calendar;
    },
    header: {
      left: "today",
      center: "prev, title, next",
      right: "agendaWeek,agendaDay",
    },
    views: {
      month: {
        columnFormat: "dddd",
      },
      agendaWeek: {
        columnFormat: "ddd D/M",
        eventLimit: false,
      },
      agendaDay: {
        columnFormat: "dddd",
        eventLimit: false,
      },
      listWeek: {
        columnFormat: "",
      },
    },

    loading: function (bool) {
      //alert('events are being rendered');
    },
    eventAfterAllRender: function (view) {
      if (view.name == "month") {
        $(".fc-content").css("height", "auto");
      }
    },
    eventLimitClick: function (cellInfo, event) {},
    eventResize: function (event, delta, revertFunc, jsEvent, ui, view) {
      $(".popover.fade.top").remove();
    },
    eventDragStart: function (event, jsEvent, ui, view) {
      var draggedEventIsAllDay;
      draggedEventIsAllDay = event.allDay;
    },
    eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
      $(".popover.fade.top").remove();
    },
    unselect: function (jsEvent, view) {
      //$(".dropNewEvent").hide();
    },
    dayClick: function (startDate, jsEvent, view) {
      //var today = moment();
      //var startDate;
      //if(view.name == "month"){
      //  startDate.set({ hours: today.hours(), minute: today.minutes() });
      //  alert('Clicked on: ' + startDate.format());
      //}
    },
    select: function (startDate, endDate, jsEvent, view) {
      var today = moment();
      var startDate;
      var endDate;

      if (view.name == "month") {
        startDate.set({ hours: today.hours(), minute: today.minutes() });
        startDate = moment(startDate).format("ddd DD MMM YYYY HH:mm");
        endDate = moment(endDate).subtract("days", 1);
        endDate.set({ hours: today.hours() + 1, minute: today.minutes() });
        endDate = moment(endDate).format("ddd DD MMM YYYY HH:mm");
      } else {
        startDate = moment(startDate).format("ddd DD MMM YYYY HH:mm");
        endDate = moment(endDate).format("ddd DD MMM YYYY HH:mm");
      }

      var $contextMenu = $("#contextMenu");

      var HTMLContent =
        '<ul class="dropdown-menu dropNewEvent" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;">' +
        "<li onclick='newEvent(\"" +
        startDate +
        '","' +
        endDate +
        '","' +
        "Class Event" +
        '")\'> <a tabindex="-1" href="#">Add Class Event</a></li>' +
        "<li onclick='newEvent(\"" +
        startDate +
        '","' +
        endDate +
        '","' +
        "Meetings" +
        '")\'> <a tabindex="-1" href="#">Add Meetings</a></li>' +
        '<li class="divider"></li>' +
        '<li><a tabindex="-1" href="#">Close</a></li>' +
        "</ul>";
      newEvent(startDate, endDate, "Class Event");
      $(".fc-body").unbind("click");
      $(".fc-body").on("click", "td", function (e) {
        // document.getElementById("contextMenu").innerHTML = HTMLContent;

        $contextMenu.addClass("contextOpened");
        $contextMenu.css({
          display: "block",
          left: e.pageX,
          top: e.pageY,
        });
        return false;
      });

      $contextMenu.on("click", "a", function (e) {
        e.preventDefault();
        $contextMenu.removeClass("contextOpened");
        $contextMenu.hide();
      });

      $("body").on("click", function () {
        $contextMenu.hide();
        $contextMenu.removeClass("contextOpened");
      });

      //newEvent(startDate, endDate);
    },
    eventClick: function (event, jsEvent, view) {
      editEvent(event);
    },
    locale: "en-GB",
    timezone: "local",
    nextDayThreshold: "09:00:00",
    allDaySlot: true,
    displayEventTime: true,
    displayEventEnd: true,
    firstDay: 1,
    weekNumbers: false,
    selectable: true,
    weekNumberCalculation: "ISO",
    eventLimit: true,
    eventLimitClick: "week", //popover
    navLinks: true,
    timeFormat: "HH:mm",
    defaultTimedEventDuration: "01:00:00",
    editable: false,
    minTime: "07:00:00",
    maxTime: "20:00:00",
    slotLabelFormat: "HH:mm",
    weekends: true,
    nowIndicator: true,
    dayPopoverFormat: "dddd DD/MM",
    longPressDelay: 0,
    eventLongPressDelay: 0,
    selectLongPressDelay: 0,
    height: 727,
  });

  //$('#calendar').fullCalendar('addEventSource',array);

  //CREATE NEW EVENT CALENDAR

  newEvent = function (start, end, eventType) {
    $("#contextMenu").hide();
    $(".eventType").text(eventType);
    $("input#title").val("");
    $("#starts-at").val(start);
    $("#ends-at").val(end);
    $("#newEventModal").modal("show");

    var endDay;

    $(".allDayNewEvent").on("change", function () {
      if ($(this).is(":checked")) {
        statusAllDay = true;
        var endDay = $("#ends-at").prop("disabled", true);
      } else {
        statusAllDay = false;
        var endDay = $("#ends-at").prop("disabled", false);
      }
    });

    //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT
    var eventId = 1 + Math.floor(Math.random() * 10000);
    //GENERATE RAMDON ID - JUST FOR TEST - DELETE IT

    $("#save-event").unbind();
    $("#save-event").on("click", function () {
      var title = $("input#title").val();
      var startDay = $("#starts-at").val();
      if (!$(".allDayNewEvent").is(":checked")) {
        var endDay = $("#ends-at").val();
      }
      var calendar = $("#calendar-type").val();
      var description = $("#add-event-desc").val();
      var type = eventType;
      if (title) {
        var eventData = {
          _id: eventId,
          title: title,
          start: startDay,
          end: endDay,
          description: description,
          type: type,
          backgroundColor: "#1756ff",
          textColor: "#ffffff",
        };
        $("#calendar").fullCalendar("renderEvent", eventData, true);
        $("#newEventModal").find("input, textarea").val("");
        $("#newEventModal").find("input:checkbox").prop("checked", false);
        $("#ends-at").prop("disabled", false);
        $("#newEventModal").modal("hide");
        eventData.roomID = roomID
        if (roomID !== "none") {
          fetch(
            "https://us-central1-fir-rtc-926a7.cloudfunctions.net/widgets/addEvent",
            {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(eventData),
            }
          ).then((response) => {
            console.log(response.json())
          })
        }
      } else {
        alert("Title can't be blank. Please try again.");
      }
    });
  };

  //EDIT EVENT CALENDAR

  editEvent = function (event, element, view) {
    $(".popover.fade.top").remove();
    $(element).popover("hide");
    //$(".dropdown").hide().css("visibility", "hidden");

    if (event.allDay == true) {
      $("#editEventModal").find("#editEndDate").attr("disabled", true);
      $("#editEventModal").find("#editEndDate").val("");
      $(".allDayEdit").prop("checked", true);
    } else {
      $("#editEventModal").find("#editEndDate").attr("disabled", false);
      $("#editEventModal")
        .find("#editEndDate")
        .val(event.end.format("ddd DD MMM YYYY HH:mm"));
      $(".allDayEdit").prop("checked", false);
    }

    $(".allDayEdit").on("change", function () {
      if ($(this).is(":checked")) {
        $("#editEventModal").find("#editEndDate").attr("disabled", true);
        $("#editEventModal").find("#editEndDate").val("");
        $(".allDayEdit").prop("checked", true);
      } else {
        $("#editEventModal").find("#editEndDate").attr("disabled", false);
        $(".allDayEdit").prop("checked", false);
      }
    });
    $("#editTitle").val(event.title);
    $("#editStartDate").val(event.start.format("ddd DD MMM YYYY HH:mm"));
    $("#edit-calendar-type").val(event.calendar);
    $("#edit-event-desc").val(event.description);
    $(".eventName").text(event.title);
    $("#editEventModal").modal("show");
    $("#updateEvent").unbind();
    $("#updateEvent").on("click", function () {
      var statusAllDay;
      if ($(".allDayEdit").is(":checked")) {
        statusAllDay = true;
      } else {
        statusAllDay = false;
      }

      var title = $("input#editTitle").val();
      var startDate = $("input#editStartDate").val();
      var endDate = $("input#editEndDate").val();
      var calendar = $("#edit-calendar-type").val();
      var description = $("#edit-event-desc").val();
      $("#editEventModal").modal("hide");
      var eventData;

      if (title) {
        event.title = title;
        event.start = startDate;
        event.end = endDate;
        event.calendar = calendar;
        event.description = description;
        $("#calendar").fullCalendar("updateEvent", event);
        console.log(event._id);
        if (roomID !== "none") {
          db.collection("calendar")
            .doc(roomID)
            .update({
              [event.id]: {
                title: event.title,
                start: event.start,
                end: event.end,
                description: event.description,
              },
            });
        }
      } else {
        alert("Title can't be blank. Please try again.");
      }
    });

    $("#deleteEvent").on("click", function () {
      $("#deleteEvent").unbind();
      console.log(event._id);
      var ind = event._id;
      console.log(event.id);
      var bodyJ = {
        e1 : event._id,
        e2 : event.id,
        roomID : roomID
      }
      if (roomID !== "none") {
        fetch(
          "https://us-central1-fir-rtc-926a7.cloudfunctions.net/widgets/remEvent",
          {
            method: "POST", // or 'PUT'
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyJ),
          }
        ).then((response) => {
          console.log(response.json())
        })
      }
      if (event._id.includes("_fc")) {
        console.log("S");
        $("#calendar").fullCalendar("removeEvents", [event._id]);
      } else {
        console.log("D");
        $("#calendar").fullCalendar("removeEvents", [event._id]);
      }
      $("#editEventModal").modal("hide");
    });
  };

  //SET DEFAULT VIEW CALENDAR

  var defaultCalendarView = "agendaWeek";

  if (defaultCalendarView == "agendaWeek") {
    $("#calendar").fullCalendar("changeView", "agendaWeek");
  } else if (defaultCalendarView == "agendaDay") {
    $("#calendar").fullCalendar("changeView", "agendaDay");
  } else if (defaultCalendarView == "listWeek") {
    $("#calendar").fullCalendar("changeView", "listWeek");
  }

  $("#calendar_view").on("change", function () {
    var defaultCalendarView = $("#calendar_view").val();
    $("#calendar").fullCalendar("changeView", defaultCalendarView);
  });

  //SET MIN TIME AGENDA

  $("#calendar_start_time").on("change", function () {
    var minTimeAgendaView = $(this).val();
    $("#calendar").fullCalendar("option", { minTime: minTimeAgendaView });
  });

  //SET MAX TIME AGENDA

  $("#calendar_end_time").on("change", function () {
    var maxTimeAgendaView = $(this).val();
    $("#calendar").fullCalendar("option", { maxTime: maxTimeAgendaView });
  });

  //SHOW - HIDE WEEKENDS

  var activeInactiveWeekends = false;
  checkCalendarWeekends();

  $(".showHideWeekend").on("change", function () {
    checkCalendarWeekends();
  });

  function checkCalendarWeekends() {
    $("#calendar").fullCalendar("option", {
      weekends: true,
    });
  }

  //CREATE NEW CALENDAR AND APPEND

  $("#addCustomCalendar").on("click", function () {
    var newCalendarName = $("#inputCustomCalendar").val();
    $("#calendar_filter, #calendar-type, #edit-calendar-type").append(
      $("<option>", {
        value: newCalendarName,
        text: newCalendarName,
      })
    );
    $("#inputCustomCalendar").val("");
  });
});
function refreshCalendarData(){
  roomChangeFunction()
}
function addRoomByReferral() {
  var ref = document.getElementById("referral").value;
  document.getElementById("referral").value = "";
  ref = ref.split("/");
  if (ref.length === 4) {
    console.log(ref);
    db.collection("users")
      .doc(USER_CRED.email)
      .collection("rooms")
      .doc(ref[1])
      .set({
        className: ref[0],
        teacherPassword: ref[2],
        studentPassword: ref[3],
      })
      .then(function (res) {
        console.log("success");
        roomData[ref[1]] = {
          className: ref[0],
          tPass: ref[2],
          sPass: ref[3],
        };
        var d1 = document.getElementById("classRoomTag");
        d1.insertAdjacentHTML(
          "beforeend",
          '<option value="' + ref[1] + '">' + ref[0] + "</option>"
        );

    errorSnack = "Class added!";
    document.getElementById("demo-show-snackbar").click();
      });
  } else {
    errorSnack = "Wrong referral link";
    document.getElementById("demo-show-snackbar").click();
  }
}
var errorSnack = "";

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
/*'<div class="tab"> <input type="checkbox" id="' +
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
              '" class="mdl-chip__action btn"><i class="material-icons">content_copy</i></button> </span> </span> </li> </ul> </div> </div>'*/
