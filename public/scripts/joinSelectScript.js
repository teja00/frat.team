
var newEvent;
var editEvent;
var roomID
var db = firebase.firestore();
var array = [];
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
    selectable: false,
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
            console.log("INVALID 27")
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
        console.log("INVALID 27")
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

try {
    $("#calendar").fullCalendar("removeEvents");
    roomID = localStorage.roomID
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
          console.log("result",array)
          $("#calendar").fullCalendar("addEventSource", array);
        });
    }
  } catch (e) {
      console.log(e)
    e = "";
  }
  $(".modais1").iziModal({
    history: false,
    fullscreen: true,
    headerColor: '#ffffff',
    group: 'group2',
    loop: false,
    closeButton: true,
});