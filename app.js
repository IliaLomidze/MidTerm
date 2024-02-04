#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

const expenseFilePath = path.join(__dirname, 'expenses.json');

function readExpenses() {
  try {
    const data = fs.readFileSync(expenseFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeExpenses(expenses) {
  fs.writeFileSync(expenseFilePath, JSON.stringify(expenses, null, 2));
}

function createExpense(total, category, date) {
  const expenses = readExpenses();
  const newExpense = {
    id: expenses.length + 1,
    total,
    category,
    date,
  };
  expenses.push(newExpense);
  writeExpenses(expenses);
  console.log('Expense added successfully:', newExpense);
}

function searchExpenseByCategory(category) {
  const expenses = readExpenses();
  const filteredExpenses = expenses.filter(expense => expense.category === category);
  console.log('Expenses for category', category, filteredExpenses);
}

function deleteExpenseById(id) {
  const expenses = readExpenses();
  const index = expenses.findIndex(expense => expense.id === Number(id));
  if (index !== -1) {
    const deletedExpense = expenses.splice(index, 1)[0];
    writeExpenses(expenses);
    console.log('Expense deleted successfully:', deletedExpense);
  } else {
    console.log('Expense not found with ID:', id);
  }
}

program
  .command('create-expense <total> <category> <date>')
  .action(createExpense);

program
  .command('search-expense')
  .option('--category <category>', 'Search expense by category')
  .action((options) => searchExpenseByCategory(options.category));

program
  .command('delete-expense')
  .option('--id <id>', 'Delete expense by ID')
  .action((options) => deleteExpenseById(options.id));

program.parse(process.argv);
