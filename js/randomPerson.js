const studentWeights = {
  jacob: 1,
  mike: 1,
  blake: 1,
  dakotah: 3,
  amee: 1,
  arianne: 1,
  arlen: 1,
  elle: 1,
  ian: 1,
  matt: 1,
  sarah: 1,
  tanya: 1,
};

let students = [];

(function setStudents() {
  for (student in studentWeights) {
    for (let i = 0; i < studentWeights[student]; i++) {
      if (studentWeights[student] > 0) {
        students.push(student);
      }
    }
  }
})();

let secondaryStudentArray = [];
let studentsCount = students.length;

const wait = (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

const randomStudent = async () => {
  const removeSelectedClass = document.querySelectorAll(".selected");
  const insertHere = document.querySelector(".random-selection");
  const button = document.querySelector(".select-btn");

  let randomSelection;

  (function setBaseAttributes() {
    insertHere.classList = "random-selection";
    removeSelectedClass.forEach((name) => (name.classList = "student"));
    button.setAttribute("disabled", "true");
  })();

  await (async function shuffle() {
    const shuffleArray = Object.keys(studentWeights);

    for (let i = 0; i < shuffleArray.length * 3; i++) {
      await wait(50);
      document.querySelector(".random-selection").innerHTML =
        shuffleArray[Math.floor(Math.random() * shuffleArray.length)];
    }
  })();

  if (studentsCount === 0) {
    [students, secondaryStudentArray] = [secondaryStudentArray, students];
    if (students.length !== 1) {
      let lastStudent = students.pop();

      studentsCount = students.length;

      randomSelection = students[Math.floor(Math.random() * studentsCount)];

      students.push(lastStudent);
      studentsCount = students.length;
    } else {
      studentsCount = students.length;

      randomSelection = students[Math.floor(Math.random() * studentsCount)];
    }
  } else {
    randomSelection = students[Math.floor(Math.random() * studentsCount)];

    let spliced = students.splice(students.indexOf(randomSelection), 1);
    secondaryStudentArray.push(spliced[0]);
    studentsCount--;
  }

  (function setFinalAttributes() {
    const selected = document.getElementById(randomSelection);

    insertHere.innerHTML = randomSelection;
    insertHere.classList.add("color-shift");

    selected.classList.add("selected");

    button.removeAttribute("disabled");
  })();

  console.log("students", students);
  console.log("secondaryStudentArray", secondaryStudentArray);
};

const updateWeight = (student, operator) => {
  const studentElement = document.getElementById(`${student}-span`);

  switch (operator) {
    case "+":
      studentWeights[student] += 1;
      const studentLengthModifier =
        studentElement.innerText[studentElement.innerText.length - 2] == " "
          ? 1
          : 2;
      const studentTextNode = studentElement.innerText.substr(
        studentElement.innerText.length - studentLengthModifier,
        studentLengthModifier
      );
      const newString = studentElement.innerText.replace(
        studentTextNode,
        studentWeights[student]
      );

      studentElement.innerText = newString;

      students.push(student);
      studentsCount++;
      break;
    case "-":
      studentWeights[student] -= studentWeights[student] === 0 ? 0 : 1;
      const studSubModifier =
        studentElement.innerText[studentElement.innerText.length - 2] == " "
          ? 1
          : 2;
      const studSubTextNode = studentElement.innerText.substr(
        studentElement.innerText.length - studSubModifier,
        studSubModifier
      );
      const newStudSubString = studentElement.innerText.replace(
        studSubTextNode,
        studentWeights[student]
      );

      if (
        secondaryStudentArray.includes(student) &&
        secondaryStudentArray.length > 0
      ) {
        secondaryStudentArray.splice(secondaryStudentArray.indexOf(student), 1);
      }

      if (
        studentWeights[student] === 0 &&
        secondaryStudentArray.includes(student)
      ) {
        secondaryStudentArray.filter((items) => items !== student);
      }

      if (
        studentWeights[student] > 0 &&
        students.length === 1 &&
        secondaryStudentArray.length === 1 &&
        students[0] === secondaryStudentArray[0]
      ) {
        secondaryStudentArray.splice(secondaryStudentArray.indexOf(student), 1);
      } else if (
        secondaryStudentArray.length !== 0 &&
        students.includes(student)
      ) {
        students.splice(students.indexOf(student), 1);
        studentsCount--;
      } else if (students.includes(student)) {
        students.splice(students.indexOf(student), 1);
        studentsCount--;
      }

      studentElement.innerText = newStudSubString;
      break;
    default:
      return;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  for (let student in studentWeights) {
    const nameSpan = document.createElement("span");
    const buttonSpan = document.createElement("span");
    const buttons = ["+", "-"];
    const li = document.createElement("li");
    const studentList = document.querySelector(".student-list");
    const text = document.createTextNode(
      `${student}: ${studentWeights[student]}`
    );

    nameSpan.appendChild(text);
    li.appendChild(nameSpan);
    li.className = "student";
    li.id = student;
    nameSpan.id = `${student}-span`;
    buttons.forEach((btn) => {
      const buttonText = document.createTextNode(btn);
      this.button = document.createElement("button");

      this.button.appendChild(buttonText);
      this.button.addEventListener("click", () => updateWeight(student, btn));

      buttonSpan.appendChild(button);
      this.button.classList.add(btn === "+" ? "plus" : "minus");
      li.appendChild(buttonSpan);
    });

    studentList.append(li);
  }
});
