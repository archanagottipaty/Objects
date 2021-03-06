const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];
let managerSelect = false; //Boolean which is checked to see if Manager is already selected


//function that writes tthe team.html file in the output dir
const writeFile = () => {
  const data = render(employees);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, data, (err) => {
    if (err) throw err;
  });
};

//Function that asks the initial question
const askQuestions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: ["Manager", "Engineer", "Intern"],
      },
    ])
    .then((data) => {
      askCommonQuestions().then(({ name, id, email }) => {
        switchRole(data.role,name,id,email);
      });
    });
};

//Function that asks questions when manager is already selected
const askQuestionsWithoutManager = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: [ "Engineer", "Intern"],
      },
    ])
    .then((data) => {
      askCommonQuestions().then(({ name, id, email }) => {
        switchRole(data.role,name,id,email);
      });
    });
};

//Function that calls ask***Question() depending on selection
const switchRole = (role, name,id,email) => {
  switch (role) {
    case "Manager":
      managerSelect = true;
      console.log("Ask manager question, Line 63");
      askManagerQuestion().then(({ office }) => {
        const manager = new Manager(name, id, email, office);
        employees.push(manager);
        askAnotherRole();
      });
      break;
    case "Engineer":
      askEngineerQuestion().then(({ github }) => {
        const engineer = new Engineer(name, id, email, github);
        employees.push(engineer);
        askAnotherRole();
      });
      break;
    case "Intern":
       askInternQuestion().then(({ school }) => {
        const intern = new Intern(name, id, email, school);
         employees.push(intern);

      askAnotherRole();
    });
      break;
    default:
  }
};

//Function that asks if user wants to create another role
const askAnotherRole = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "answer",
        message: "Do you want to create another role?",
      },
    ])
    .then(({ answer }) => {
    
       if (managerSelect == true && answer == true){
        askQuestionsWithoutManager();
      }

      else if (answer == true) {
        askQuestions();
      } 
      
      else {
        writeFile();
      }
    });
};
//Function that asks the one question specific to managers
const askManagerQuestion = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "office",
      message: "What is your Office Number?",
    },
  ]);
};

//Function that asks the one question specific to engineers
const askEngineerQuestion = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "What is your GitHub URL?",
    },
  ]);
};
//Function that asks the one question specific to interns
const askInternQuestion = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "school",
      message: "What is your School name?",
    },
  ]);
};

//Function that asks the 3 common questions
const askCommonQuestions = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your Name?",
    },
    {
      type: "input",
      name: "id",
      message: "What is your Id?",
    },
    {
      type: "input",
      name: "email",
      message: "What is your email?",
    },
  ]);
};

//These are the two functions called from the global scope, other functions are called from within functions
let role = askQuestions();
switchRole(role);

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
