# 🎅 Secret Santa Game 🎉

A simple Node.js program to generate a Secret Santa list from an employee Excel sheet!

## 📦 Project Setup

1. Clone the repo or create a new directory
2. Install dependencies

```bash
pnpm i
```

# Usage

Once the application is set up, run it with the following command:

```bash
node index.js -i input.xlsx -p last_year.xlsx
```

- -i input.xlsx Input file for the current year's employee list.
- -p last_year.xlsx File containing the results of last year's Secret Santa game.

Once you run the command mentioned above, the game will:

1.  Read the employee list and last year's data.
2.  Verify the number of participants is even (since the game requires pairs).
3.  Generate random pairings ensuring no one gets the same person as last year.
4.  Save the current year's result in Secret-Santa-Game-Result-{current-year}.xlsx with the following columns:

    - **Employee_Name**
    - **Employee_EmailID**
    - **Secret_Child_Name**
    - **Secret_Child_EmailID**

# RULES

- The application is not currently smart enough to automatically understand column names, so please ensure your data is provided in the following format:

### Input File (Employee-List.xlsx)

The input file should contain the following columns:

| **Employee_Name** | **Employee_EmailID**      |
| ----------------- | ------------------------- |
| John Doe          | john.doe@example.com      |
| Jane Smith        | jane.smith@example.com    |
| Alice Johnson     | alice.johnson@example.com |
| Bob Lee           | bob.lee@example.com       |

### Last Year File (Secret-Santa-Game-Result-2023.xlsx)

The last year’s file should contain the following columns:

| **Employee_Name** | **Employee_EmailID**      | **Secret_Child_Name** | **Secret_Child_EmailID**  |
| ----------------- | ------------------------- | --------------------- | ------------------------- |
| John Doe          | john.doe@example.com      | Jane Smith            | jane.smith@example.com    |
| Jane Smith        | jane.smith@example.com    | Alice Johnson         | alice.johnson@example.com |
| Alice Johnson     | alice.johnson@example.com | Bob Lee               | bob.lee@example.com       |
| Bob Lee           | bob.lee@example.com       | John Doe              | john.doe@example.com      |
