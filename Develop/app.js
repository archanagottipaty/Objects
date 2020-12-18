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

const writeFile = () => {
  const data = render(employees);
   console.log("Employees writefile() app.js:" + JSON.stringify(employees));
  console.log("Inside writefile");
  console.log("output dir: " + OUTPUT_DIR );
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath, data, (err) => {
      if (err) throw err;
      console.log("file written.");
    });
}


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
      askCommonQuestions().then(({name, id, email})=>{
        switch (data.role) {
          case "Manager":
            askManagerQuestion().then(({office}) => {
            const manager = new Manager(name, id, email, office);
            employees.push(manager);
            console.log("Employees employees.push():" + JSON.stringify(employees));
            writeFile();
          })
            break;
          case "Engineer":
            askEngineerQuestion().then(({github}) => {
              const engineer = new Engineer(name, id, email, github);
            employees.push(engineer);})
            break;
          case "Intern":
            break;
          default:
        }
        inquirer
        .prompt([
          {
            type: "confirm",
            name: "answer",
            message: "Do you want to create another role?",
          },
        ])
        .then(({ answer }) => {
          console.log({answer});
          if (answer == true) {
            askQuestions();
          } else {
            console.log("Employees else():" + JSON.stringify(employees));
            writeFile();
          }
        });
      });     
      //  Ask one more Question: Do u want to ake another role?
    });
};
askQuestions();

const askManagerQuestion = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "office",
      message: "What is your Office Number?",
    },
  ]);
};

const askEngineerQuestion = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "What is your GitHub URL?",
    },
  ]);
};

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
