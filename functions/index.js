const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const cors = require("cors");

const app = express();
var excel = require("excel4node");
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
app.post("/addUser", async (req, res) => {
  var room = req.body;
  var uName = Math.floor(Math.random() * 10000).toString();
  await admin
    .firestore()
    .collection("rooms")
    .doc(room.roomID)
    .collection("meta")
    .doc("students")
    .set(
      {
        [uName]: { username: room.username, roll: room.roll },
      },
      { merge: true }
    )
    .then(function () {
      return 1;
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
      res.send({ status: 2 });
    });
});
app.get("/attendance", async (req, res) => {
  //var reqData = req.body;
  console.log(req.query.roomID);
  await admin
    .firestore()
    .collection("rooms")
    .doc(req.query.roomID)
    .collection("meta")
    .doc("attendance")
    .get()
    .then(function (doc) {
      console.log("enter", doc.data());
      if (doc.exists) {
        const fields = doc.data();
        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet("Sheet 1");
        var style = workbook.createStyle({
          font: {
            color: "#FF0800",
            size: 12,
          },
          numberFormat: "$#,##0.00; ($#,##0.00); -",
        });
        var row = 1;
        for (let key in fields) {
          worksheet.cell(row, 1).string(fields[key].username).style(style);
          worksheet.cell(row, 2).string(fields[key].roll).style(style);
          if (Number(fields[key].att) >= 27) {
            worksheet.cell(row, 3).string("Yes").style(style);
          } else {
            worksheet.cell(row, 3).string("No").style(style);
          }
          row = row + 1;
        }
        workbook.write(req.query.displayName + ".xlsx", res);
        /*res.setHeader("Content-disposition", `attachment;filename=data.xls`);
        res.setHeader("Content-type", "application/vnd.ms-excel");
        res.charset = "UTF-8";
        res.download("Excel.xlsx");
        res.status(200).end(xls);*/

        //console.log("fileeeeeeeeeee",file)
      }
      return 1;
    });
});
// build multiple CRUD interfaces:
app.post("/signup", async (req, res) => {
  console.log("json", req.body);
  var user = req.body;
  await admin
    .firestore()
    .collection("users")
    .doc(user.profile.email)
    .set({
      name: user.profile.name,
      picture: user.profile.picture,
      isNewUser: user.isNewUser,
    })
    .then(function () {
      console.log("Document successfully written!");
      res.send({ status: 7 });
      return 1;
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
      res.send({ status: 2 });
    });
});
app.post("/addEvent", async (req, res) => {
  var eventData = req.body;
  var as = await admin
    .firestore()
    .collection("calendar")
    .doc(eventData.roomID)
    .set(
      {
        [eventData._id]: {
          id: eventData._id,
          _id: eventData._id,
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          description: eventData.description,
          type: eventData.type,
          background: eventData.backgroundColor,
          text: eventData.textColor,
        },
      },
      { merge: true }
    )
    .catch(function (error) {
      console.error("Error writing document: ", error);
      res.send({ status: 2 });
    });
  res.send({ status: 7 });
  return;
});
app.post("/remEvent", async (req, res) => {
  var bodyJ = req.body;
  for (let key in bodyJ) {
    if (key === "roomID") {
      var epo = 0;
    } else {
      var et = bodyJ[key];
      as = admin
        .firestore()
        .collection("calendar")
        .doc(bodyJ.roomID)
        .update({
          [et]: admin.firestore.FieldValue.delete(),
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
          res.send({ status: 2 });
        });
    }
  }
  res.send({ status: 7 });
  return;
});
app.post("/join", async (req, res) => {
  console.log("json", req.body);
  var room = req.body;
  await admin
    .firestore()
    .collection("rooms")
    .doc(room.roomID)
    .get()
    .then(function (doc) {
      console.log("enter", doc);
      if (doc.exists) {
        console.log("Document data:", doc.data());
        const db = doc.data();
        if (room.type === "t") {
          if (db.teacherPassword === room.password) {
            res.send({
              status: 7,
              jitsi: db.jitsi,
              className: db.className,
              teacher: db.teacher,
              whiteboard: db.whiteboard,
            });
          } else {
            console.log("fffff");

            res.send({ status: 2 });
          }
        } else if (room.type === "s") {
          if (db.studentPassword === room.password) {
            res.send({
              status: 7,
              jitsi: db.jitsi,
              className: db.className,
              whiteboard: db.whiteboard,
              closed: db.closed,
            });
          } else {
            console.log("ssssss");

            res.send({ status: 2 });
          }
        }
      } else {
        console.log("efef");

        // doc.data() will be undefined in this case
        res.send({ status: 2 });
      }
      return 1;
    });
});
// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);
