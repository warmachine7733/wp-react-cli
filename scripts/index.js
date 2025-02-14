#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { exec } from 'child_process';

// Get the current directory of the script
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Default action when no command is provided
let appName = ''
program
  .arguments("<projectName>")
  .description("Create a new React project with Webpack template")
  .action(async (projectName, options) => {
    const projectPath = path.join(process.cwd(), projectName);
    appName = projectName

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
      console.log(
        chalk.red(
          `Directory ${projectName} already exists. Please choose another name.`
        )
      );
      return;
    }

    // description
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectDescription",
        message: "Project description (optional):",
        default: "A new React app with Webpack setup",
      },
    ]);

    // Create the project directory
    console.log(chalk.blue(`Creating project in ${projectPath}...`));
    fs.mkdirSync(projectPath);

    console.log(__dirname);
    // Copy template files (webpack-react template, for example)
    const templateDir = path.join(__dirname, "../template"); // Assuming you have a "template" directory
    if (!fs.existsSync(templateDir)) {
      console.log(chalk.red(`Template ${options.template} not found.`));
      return;
    }

    fs.copySync(templateDir, projectPath);

    // Update the package.json with dynamic info (like description)
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.description = answers.projectDescription;
    packageJson.name = appName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green("Project created successfully!"));
    console.log(`Run \`cd ${projectName}\` to enter the project folder.`);

    console.log(chalk.blue("Installing dependencies..."));
    exec("npm i", { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red(`Error installing dependencies: ${error.message}`)
        );
        return;
      }
      if (stderr) {
        console.error(chalk.yellow(`stderr: ${stderr}`));
        return;
      }
      console.log(chalk.green("Dependencies installed successfully!"));
      console.log("Run" +chalk.green(`\`cd ${projectName}\``) + "to enter the project folder.");
      console.log("start the app with" + chalk.green(" `npm start`."));
    });
  });

program.parse(process.argv);
