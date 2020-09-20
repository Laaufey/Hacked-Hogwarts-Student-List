"use strict";

window.addEventListener("DOMContentLoaded", start);

const template = document.querySelector("template").content;
const json = "https://petlatkea.dk/2020/hogwarts/students.json";
const familynames = "https://petlatkea.dk/2020/hogwarts/families.json";
const main = document.querySelector("main");
const modal = document.querySelector(".modal-background");
const bgColor = document.querySelector(".modal-content");
document.querySelector(".reverse").addEventListener("click", reverse);
const dropdown = document.querySelector("select");
dropdown.addEventListener("change", selectFilter);

let familyBlood;
let allStudents = [];
let usableData = [];
let filteredData = [];
let expelledData = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  image: "",
  expelled: false,
  prefect: false,
  bloodStatus: "",
  squad: false,
};

function start() {
  loadData();
  loadFamilies();
  registerBtns();
}
async function loadData() {
  const response = await fetch(json);
  const jsonData = await response.json();
  prepareObjects(jsonData);

  console.log("hello");
}
async function loadFamilies() {
  const response = await fetch(familynames);
  familyBlood = await response.json();
  addBloodStatus(familyBlood);
  console.log("hi mom");
}

// CAPITALIZE FUNCTION

function capitalize(str) {
  const cap =
    str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();

  return cap;
}
function registerBtns() {
  document
    .querySelectorAll(".sort")
    .forEach((button) => button.addEventListener("click", selectSort));
}
// CLEANING THE STUDENT LIST

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  buildList();
}
function prepareObject(jsonObject) {
  const student = Object.create(Student);
  const fullName = jsonObject.fullname.trim();
  student.name = capitalize(fullName);
  student.house = capitalize(jsonObject.house.trim());

  if (fullName.includes(" ")) {
    student.firstName = capitalize(
      fullName.substring(0, fullName.indexOf(" "))
    );
  } else {
    student.firstName = capitalize(fullName);
  }
  if (fullName.includes(" ")) {
    student.lastName = capitalize(
      fullName.substring(fullName.lastIndexOf(" ")).trim()
    );
  }
  if (fullName.includes(`"`)) {
    student.middleName = "";
  } else if (fullName.includes(" ")) {
    student.middleName =
      "Middlename: " +
      fullName.substring(
        fullName.indexOf(" ") + 1,
        fullName.lastIndexOf(" ") + 1
      );
  } else {
    student.middleName = "";
  }
  if (fullName.includes(`"`)) {
    student.nickName =
      "Nickname: " +
      fullName.substring(
        fullName.indexOf(" ") + 1,
        fullName.lastIndexOf(" ") + 1
      );
  } else {
    student.nickName = "";
  }

  const lastNameFile = student.lastName.toLowerCase();
  const firstLetterFile = student.firstName[0].toLowerCase();
  const firstNameLow = student.firstName.toLowerCase();
  const houseFirstChar = student.house[0].toLowerCase();

  if (lastNameFile.includes("-")) {
    student.image =
      "/images/" +
      lastNameFile.substring(lastNameFile.indexOf("-") + 1) +
      "_" +
      firstLetterFile +
      ".png";
  } else if (lastNameFile.includes("patil")) {
    student.image = "/images/" + lastNameFile + "_" + firstNameLow + ".png";
  } else {
    student.image = "/images/" + lastNameFile + "_" + firstLetterFile + ".png";
  }

  student.crest = "/" + houseFirstChar + "-crest.png";

  return student;
}
function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

//DISPLAYING THE LIST OF STUDENTS
function displayList(students) {
  document.querySelector("main").innerHTML = "";
  students.forEach(displayStudent);
  if (students.length === 1) {
    document.querySelector(".num-stud").textContent =
      "Showing " + students.length + " student";
  } else {
    document.querySelector(".num-stud").textContent =
      "Showing " + students.length + " students";
  }
}
function displayStudent(student) {
  const clone = document.querySelector("template").content.cloneNode(true);
  clone.querySelector("li").addEventListener("click", () => showModal(student));
  clone.querySelector("[data-field=firstName]").innerHTML = student.firstName;
  clone.querySelector("[data-field=lastName]").innerHTML = student.lastName;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  document.querySelector("main").appendChild(clone);
}

// MODAL
function showModal(studentName) {
  console.log("Showing modal for " + studentName.firstName);
  modal.classList.remove("hide");
  modal.querySelector("#close").addEventListener("click", () => {
    modal.classList.add("hide");
  });
  modal.querySelector(".fullName").textContent = studentName.name;
  modal.querySelector(".firstName").textContent = studentName.firstName;
  modal.querySelector(".lastName").textContent = studentName.lastName;
  modal.querySelector(".middleName").textContent = studentName.middleName;
  modal.querySelector(".nickName").textContent = studentName.nickName;
  modal.querySelector(".house").textContent = studentName.house;
  modal.querySelector("#student-image").src = studentName.image;
  // console.log(studentName.image);
  modal.querySelector("#house-crest").src = studentName.crest;
  // console.log(studentName.crest);

  if (studentName.house == "Slytherin") {
    bgColor.style.backgroundImage = "linear-gradient(#0D6217, #AAAAAA)";
    bgColor.style.color = "black";
  } else if (studentName.house == "Gryffindor") {
    bgColor.style.backgroundImage = "linear-gradient(#7F0909, #FFC500)";
    bgColor.style.color = "black";
  } else if (studentName.house == "Hufflepuff") {
    bgColor.style.backgroundImage = "linear-gradient(#EEE117, #000000)";
    bgColor.style.color = "white";
  } else if (studentName.house == "Ravenclaw") {
    bgColor.style.backgroundImage = "linear-gradient(#000A90, #946B2D)";
    bgColor.style.color = "white";
  }

  if (studentName.isPureBlood) {
    modal.querySelector(".bloodStatus").textContent = "Pure Blood";
  } else if (studentName.isHalfBlood) {
    modal.querySelector(".bloodStatus").textContent = "Half Blood";
  } else {
    modal.querySelector(".bloodStatus").textContent = "Muggle Blood";
  }
  // MAKE PREFECT

  if (studentName.prefect === true) {
    document.querySelector(".prefect").textContent =
      "Prefect of " + `${studentName.house}`;
    document.querySelector("#prefect-btn").textContent = "Remove as prefect";
  } else {
    document.querySelector(".prefect").textContent = "";
    document.querySelector("#prefect-btn").textContent = "Make a prefect";
  }

  if (studentName.prefect === false) {
    document
      .querySelector("#prefect-btn")
      .addEventListener("click", makePrefect);
  } else {
    document
      .querySelector("#prefect-btn")
      .addEventListener("click", prefectOff);
  }
  function makePrefect() {
    console.log(studentName.firstName + " is a Prefect");
    document
      .querySelector("#prefect-btn")
      .removeEventListener("click", makePrefect);
    addPrefect(studentName);
  }
  function prefectOff() {
    console.log(studentName.firstName + " is not a Prefect");
    document
      .querySelector("#prefect-btn")
      .removeEventListener("click", prefectOff);
    removePrefect(studentName);
  }

  // MAKE SQUAD

  if (studentName.squad === true) {
    document.querySelector(".squad").textContent = "is in the squad";
    document.querySelector("#squad-btn").textContent = "Remove from squad";
  } else {
    document.querySelector(".squad").textContent = "";
    document.querySelector("#squad-btn").textContent = "Put in the squad";
  }

  if (studentName.squad === false) {
    document.querySelector("#squad-btn").addEventListener("click", makeSquad);
  } else {
    document.querySelector("#squad-btn").addEventListener("click", squadOff);
  }
  function makeSquad() {
    // console.log("Is squad");
    document
      .querySelector("#squad-btn")
      .removeEventListener("click", makeSquad);
    addSquad(studentName);
  }
  function squadOff() {
    // console.log("Not a squad");
    document.querySelector("#squad-btn").removeEventListener("click", squadOff);
    removeSquad(studentName);
  }

  // EXPELLING
  if (studentName.firstName === "Laufey") {
    console.log("Hi Laufey");
    document.querySelector("#expel-btn").textContent = "Expel student";
    document.querySelector("#expel-btn").addEventListener("click", expelLaufey);
  } else if (studentName.expelled === false) {
    console.log(studentName.firstName + " is not Expelled");
    document.querySelector("#expel-btn").textContent = "Expel student";
    document.querySelector("#expel-btn").addEventListener("click", expel);
    document.querySelector(".expelled").textContent = "";
  } else if (studentName.expelled === true) {
    console.log(studentName.firstName + " is Expelled");
    document.querySelector("#expel-btn").textContent = "Student is expelled";
    document.querySelector(".expelled").textContent = "EXPELLED";
  }
  function expel() {
    document.querySelector("#expel-btn").removeEventListener("click", expel);
    expelStudent(studentName);
  }
}
// ADDING AND REMOVING FROM PREFECT AND SQUAD
function removePrefect(studentName) {
  console.log("remove prefect for " + studentName.firstName);
  studentName.prefect = false;
  showModal(studentName);
}
function addPrefect(studentName) {
  console.log("add prefect for " + studentName.firstName);
  studentName.prefect = true;
  showModal(studentName);
}
function removeSquad(studentName) {
  // console.log("remove squad");
  studentName.squad = false;
  showModal(studentName);
  buildList();
}
function addSquad(studentName) {
  // console.log("add squad");
  if (studentName.isPureBlood === true || studentName.house === "Slytherin") {
    studentName.squad = true;
    showModal(studentName);
    buildList();
  } else {
    studentName.squad = false;
    alert("This student can't join the squad");
    showModal(studentName);
    buildList();
  }
}
function expelStudent(studentName) {
  console.log("Expelled");
  studentName.expelled = true;
  allStudents.splice(allStudents.indexOf(studentName), 1);
  expelledData.push(studentName);
  showModal(studentName);
  buildList();
}

// BLOOD
// fara yfir og gera flottara og meira skiljanlegra en virkar
function addBloodStatus(data) {
  allStudents.forEach((student) => {
    if (
      data.half.includes(student.lastName) &
      data.pure.includes(student.lastName)
    ) {
      data.half.splice(data.half.indexOf(student.lastName), 1);
    }
  });
  setBloodStatus(data);
}
function setBloodStatus(list) {
  allStudents.forEach((student) => {
    if (list.half.includes(student.lastName)) {
      student.isPureBlood = false;
      student.isHalfBlood = true;
      student.bloodStatus = "Half Blood";
    } else if (list.pure.includes(student.lastName)) {
      student.isPureBlood = true;
      student.bloodStatus = "Pure Blood";
    } else {
      student.isPureBlood = false;
      student.isHalfBlood = false;
      student.isMuggle = true;
      student.bloodStatus = "Muggle Blood";
    }
    return student;
  });
}

// FILTERING AND SORTING FUNCTIONS
function selectFilter() {
  const filter = this.value;
  console.log(`${filter}`);
  filterList(filter);
}
function filterList() {
  let filteredList = allStudents;

  if (dropdown.value === "all") {
    displayList(filteredList);
    console.log("working");
  } else if (dropdown.value === "gryffindor") {
    console.log("gryffindor");
    filteredList = allStudents.filter(isGryffindor);
  } else if (dropdown.value === "slytherin") {
    console.log("slytherin");
    filteredList = allStudents.filter(isSlytherin);
  } else if (dropdown.value === "ravenclaw") {
    console.log("ravenclaw");
    filteredList = allStudents.filter(isRavenclaw);
  } else if (dropdown.value === "hufflepuff") {
    console.log("hufflepuff");
    filteredList = allStudents.filter(isHufflePuff);
  } else if (dropdown.value === "expelled") {
    console.log("expelled");
    filteredList = expelledData;
  }
  displayList(filteredList);
}
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isHufflePuff(student) {
  return student.house === "Hufflepuff";
}
function isExpelled(student) {
  return student.expelled === true;
}
function selectSort(event) {
  const sortBy = event.target.id;
  sortList(sortBy);
}
function sortList(sortBy) {
  let sortedList = allStudents;
  if (sortBy === "FirstName") {
    sortedList = allStudents.sort(sortFirstName);
  } else if (sortBy === "LastName") {
    sortedList = allStudents.sort(sortLastName);
  }
  displayList(sortedList);
}

// SORTING FUNCTIONS

function sortFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}
function sortLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}
function reverse() {
  allStudents = allStudents.reverse();
  displayList(allStudents);
}
// function sortHouse(a, b) {
//   if (a.house < b.house) {
//     return -1;
//   } else {
//     return 1;
//   }
// }

// HACKING
document.querySelector(".hack").addEventListener("click", hackTheSystem);

function hackTheSystem() {
  console.log("hacking");
  addLaufey();
  randomizeBlood();
}
function addLaufey() {
  let me = Object.create(Student);
  me.firstName = "Laufey";
  me.lastName = "Hjaltested";
  me.middleName = "Cat";
  me.nickName = "Hacker";
  me.house = "Gryffindor";

  allStudents.push(me);
  buildList();
}

function expelLaufey() {
  alert("Sorry, not sorry! One step ahead of you there ;)");
}
function randomizeBlood() {
  allStudents.forEach((student) => {
    if (student.isHalfBlood === true || student.isMuggle === true) {
      student.isHalfBlood = false;
      student.isMuggle = false;
      student.isPureBlood = true;
    } else {
      let randomBlood = Math.floor(Math.random() * 3);
      student.isPureBlood = false;
      if (randomBlood === 0) {
        student.isPureBlood = true;
      } else if (randomBlood === 1) {
        student.isHalfBlood = true;
      } else {
        student.isMuggle = true;
      }
    }
    // return student;
  });
}
