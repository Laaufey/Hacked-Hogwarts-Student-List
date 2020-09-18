"use strict";

window.addEventListener("DOMContentLoaded", start);

const template = document.querySelector("template").content;
const json = "https://petlatkea.dk/2020/hogwarts/students.json";
const main = document.querySelector("main");
const modal = document.querySelector(".modal-background");
const dropdown = document.querySelector("select");
dropdown.addEventListener("change", filterList);

let allStudents = [];
let usableData = [];
let filteredData = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  expelled: "",
  prefect: "",
  bloodStatus: "",
  squad: "",
};

function start() {
  loadData();
  registerBtns();
}

async function loadData() {
  const response = await fetch(json);
  const jsonData = await response.json();
  prepareObjects(jsonData);
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
    student.middleName = null;
  } else if (fullName.includes(" ")) {
    student.middleName = fullName.substring(
      fullName.indexOf(" ") + 1,
      fullName.lastIndexOf(" ") + 1
    );
  } else {
    student.middleName = null;
  }
  if (fullName.includes(`"`)) {
    student.nickName = fullName.substring(
      fullName.indexOf(" ") + 1,
      fullName.lastIndexOf(" ") + 1
    );
  } else {
    student.nickName = null;
  }
  return student;
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

function displayList(students) {
  document.querySelector("main").innerHTML = "";
  students.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("template").content.cloneNode(true);
  clone.querySelector("li").addEventListener("click", () => showModal(student));
  clone.querySelector("[data-field=firstName]").innerHTML = student.firstName;
  clone.querySelector("[data-field=lastName]").innerHTML = student.lastName;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  document.querySelector("main").appendChild(clone);
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
  } else if (dropdown.value === "prefects") {
    console.log("prefects");
  } else if (dropdown.value === "squad") {
    console.log("squad");
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
// function prepareData(json) {
//   list.forEach((jsonObject) => {
//     const student = Object.create(Student);
//     const fullName = jsonObject.fullname.trim();
//     // const splitted = fullName.split(" ");
//     student.name = capitalize(fullName);
//     student.house = capitalize(jsonObject.house.trim());
//     if (fullName.includes(" ")) {
//       student.firstName = capitalize(
//         fullName.substring(0, fullName.indexOf(" "))
//       );
//     } else {
//       student.firstName = capitalize(fullName);
//     }
//     if (fullName.includes(" ")) {
//       student.lastName = capitalize(
//         fullName.substring(fullName.lastIndexOf(" ")).trim()
//       );
//     }
//     if (fullName.includes(`"`)) {
//       student.middleName = null;
//     } else if (fullName.includes(" ")) {
//       student.middleName = fullName.substring(
//         fullName.indexOf(" ") + 1,
//         fullName.lastIndexOf(" ") + 1
//       );
//     } else {
//       student.middleName = null;
//     }
//     if (fullName.includes(`"`)) {
//       student.nickName = fullName.substring(
//         fullName.indexOf(" ") + 1,
//         fullName.lastIndexOf(" ") + 1
//       );
//     } else {
//       student.nickName = null;
//     }

//     usableData.push(student);
//   });
//   filteredData = usableData;
// }

// DISPLAYING THE STUDENT LIST

// function showData(students) {
//   students.forEach((student) => {
//     const clone = template.cloneNode(true);
//     clone
//       .querySelector("li")
//       .addEventListener("click", () => showModal(student));
//     clone.querySelector("[data-field=firstName]").innerHTML = student.firstName;
//     clone.querySelector("[data-field=lastName]").innerHTML = student.lastName;

//     clone.querySelector("[data-field=house]").innerHTML = student.house;

//     body.appendChild(clone);
//   });
// }

// DISPLAYING EACH STUDENT IN MODAL

// function showModal(studentName) {
//   modal.classList.remove("hide");
//   modal.querySelector("#close").addEventListener("click", () => {
//     modal.classList.add("hide");
//   });
//   modal.querySelector(".fullName").textContent = studentName.name;
//   modal.querySelector(".firstName").textContent = studentName.firstName;
//   modal.querySelector(".lastName").textContent = studentName.lastName;
//   modal.querySelector(".middleName").textContent = studentName.middleName;
//   modal.querySelector(".nickName").textContent = studentName.nickName;
//   modal.querySelector(".house").textContent = studentName.house;
// }

// DROPDOWN FILTERING

// function filterData() {
//   if (dropdown.value === "all") {
//     showData(filteredData);
//     console.log("working");
//   } else if (dropdown.value === "gryffindor") {
//     console.log("gryffindor");
//   } else if (dropdown.value === "slytherin") {
//     console.log("slytherin");
//   } else if (dropdown.value === "ravenclaw") {
//     console.log("ravenclaw");
//   } else if (dropdown.value === "hufflepuff") {
//     console.log("hufflepuff");
//   } else if (dropdown.value === "expelled") {
//     console.log("expelled");
//   } else if (dropdown.value === "prefects") {
//     console.log("prefects");
//   } else if (dropdown.value === "squad") {
//     console.log("squad");
//   }
// }

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

function sortHouse(a, b) {
  if (a.house < b.house) {
    return -1;
  } else {
    return 1;
  }
}
