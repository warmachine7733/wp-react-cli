#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI Command
program
  .command("create <projectName>")
  .description("Create a new React project with Webpack template")
  .option("-t, --template <template>", "Template to use (default is wp-react)", "wp-react")
  .action(async (projectName, options) => {
    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Directory ${projectName} already exists. Please choose another name.`));
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectDescription",
        message: "Project description (optional):",
        default: "A new React app with Webpack setup",
      },
    ]);

    console.log(chalk.blue(`Creating project in ${projectPath}...`));
    fs.mkdirSync(projectPath);

    // Copy template files
    const templateDir = path.join(__dirname, "template", options.template);
    if (!fs.existsSync(templateDir)) {
      console.log(chalk.red(`Template ${options.template} not found.`));
      return;
    }

    fs.copySync(templateDir, projectPath);

    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.description = answers.projectDescription;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(chalk.green("Project created successfully!"));
    console.log(`Run \`cd ${projectName}\`, then \`npm install\`, and start with \`npm start\`.`);
  });

program.parse(process.argv);

