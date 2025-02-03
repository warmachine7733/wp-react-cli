#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Default action when no command is provided
program
  .arguments('<projectName>')
  .description('Create a new React project with Webpack template')
  .option('-t, --template <template>', 'Template to use (default is template)', 'template')
  .action(async (projectName, options) => {
    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Directory ${projectName} already exists. Please choose another name.`));
      return;
    }

    // Ask for more details if needed
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Project description (optional):',
        default: 'A new React app with Webpack setup'
      }
    ]);

    // Create the project directory
    console.log(chalk.blue(`Creating project in ${projectPath}...`));
    fs.mkdirSync(projectPath);

    // Copy template files (webpack-react template, for example)
    const templateDir = path.join(__dirname, 'template'); // Assuming you have a "template" directory
    if (!fs.existsSync(templateDir)) {
      console.log(chalk.red(`Template ${options.template} not found.`));
      return;
    }

    fs.copySync(templateDir, projectPath);

    // Update the package.json with dynamic info (like description)
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = require(packageJsonPath);
    packageJson.description = answers.projectDescription;
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green('Project created successfully!'));
    console.log(`Run \`cd ${projectName}\` to enter the project folder.`);
    console.log('Then install dependencies with `npm install` and start the app with `npm start`.');
  });

program.parse(process.argv);
