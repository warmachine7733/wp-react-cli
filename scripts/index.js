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
program
  .arguments("<projectName>")
  .description("Create a new React project with Webpack template")
  .option(
    "-t, --template <template>",
    "Template to use (default is template)",
    "template"
  )
  .action(async (projectName, options) => {
    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
      console.log(
        chalk.red(
          `Directory ${projectName} already exists. Please choose another name.`
        )
      );
      return;
    }

    // Ask for more details if needed
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
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green("Project created successfully!"));
    console.log(`Run \`cd ${projectName}\` to enter the project folder.`);
    console.log(
      "Then install dependencies with `npm install` and start the app with `npm start`."
    );

    // Run `npm install` in the new project folder
    console.log(chalk.blue("Installing dependencies..."));
    exec("npm install", { cwd: projectPath }, (error, stdout, stderr) => {
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
      console.log(`Run \`cd ${projectName}\` to enter the project folder.`);
      console.log("Then start the app with `npm start`.");
    });
  });

program.parse(process.argv);
