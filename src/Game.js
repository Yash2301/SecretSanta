import xlsx from "node-xlsx";
import fs from "fs";
class Game {
  constructor() {
    this.setUpArgs();
  }
  setUpArgs() {
    const args = process.argv.slice(2);
    args.forEach((arg, index) => {
      if (arg.startsWith("-i")) {
        this.inputFile = args[index + 1];
      } else if (arg.startsWith("-p")) {
        this.lastYearRecordsFile = args[index + 1];
      }
    });
  }
  async init() {
    this.inputFile = this.inputFile || "input.txt";
    this.lastYearRecordsFile =
      this.lastYearRecordsFile || "last_year_records.txt";

    const input = await this.readInput(this.inputFile, "Employee-List");
    const lastYearRecords = await this.readInput(
      this.lastYearRecordsFile,
      "Secret-Santa-Game-Result-2023"
    );

    if (input.length % 2 === 0) {
      throw new Error("Number of employees should be even like 2, 4, 6");
    }

    const currentYearRecords = await this.generateCurrentYearRecords(
      input,
      lastYearRecords
    );
    return currentYearRecords;
  }
  readInput(file, sheet) {
    const excel = xlsx.parse(file);
    if (excel.length === 0) {
      throw new Error("Excel file is empty");
    }
    const sheetData = excel.find((sheetData) => sheetData.name === sheet);
    if (!sheetData) {
      throw new Error(`Sheet ${sheet} not found`);
    }
    const data = sheetData.data;
    // sheet data to json
    const headers = data[0];
    const jsonData = data.slice(1).map((row) => {
      const obj = {};
      row.forEach((cell, index) => {
        obj[headers[index]] = cell;
      });
      return obj;
    });
    return jsonData;
  }
  findRandomChild(input, expectThis, log = false) {
    const filteredInput = input.filter(
      (person) => !expectThis.includes(person.Employee_EmailID)
    );
    const randomIndex = Math.floor(Math.random() * filteredInput.length);
    return { ...filteredInput[randomIndex] };
  }
  async generateCurrentYearRecords(inputArr, lastYearRecords) {
    // generate current year records
    const currentYearRecords = [];
    const lastYearRecordsMap = new Map();
    let input = inputArr;
    lastYearRecords.forEach((record) => {
      lastYearRecordsMap.set(record.Employee_EmailID, record);
    });
    let expectThis = [];
    for (let x = 0; x < inputArr.length; x++) {
      const randomFirstPerson = await this.findRandomChild(
        input,
        expectThis,
        true
      );

      expectThis = [...expectThis, randomFirstPerson.Employee_EmailID];
      const lastYearChild = lastYearRecords.find(
        (record) =>
          record.Employee_EmailID === randomFirstPerson.Employee_EmailID
      );
      const randomSecondPerson = await this.findRandomChild(input, [
        randomFirstPerson.Employee_EmailID,
        lastYearChild?.Employee_EmailID,
      ]);

      currentYearRecords.push({
        Employee_Name: randomFirstPerson?.Employee_Name,
        Employee_EmailID: randomFirstPerson?.Employee_EmailID,
        Secret_Child_Name: randomSecondPerson?.Employee_Name,
        Secret_Child_EmailID: randomSecondPerson?.Employee_EmailID,
      });
    }

    const currentYearRecordsFile =
      "Secret-Santa-Game-Result-" + new Date().getFullYear() + ".xlsx";
    const currentYearRecordsSheet = [
      [
        "Employee_Name",
        "Employee_EmailID",
        "Secret_Child_Name",
        "Secret_Child_EmailID",
      ],
      ...currentYearRecords.map((record) => [
        record.Employee_Name,
        record.Employee_EmailID,
        record.Secret_Child_Name,
        record.Secret_Child_EmailID,
      ]),
    ];
    const buffer = xlsx.build([
      { name: "Secret-Santa-Game-Result-2025", data: currentYearRecordsSheet },
    ]);
    fs.writeFileSync(currentYearRecordsFile, buffer, "binary");
    console.log(`Current year records saved to ${currentYearRecordsFile}`);

    return currentYearRecords;
  }
}

export default Game;
