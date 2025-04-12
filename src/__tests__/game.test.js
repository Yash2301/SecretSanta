import Game from "../Game";
import fs from "fs";
import path from "path";
import xlsx from "node-xlsx";

jest.mock("fs");
jest.mock("node-xlsx");

describe("Game class", () => {
  let game;

  beforeEach(() => {
    game = new Game();
    jest.clearAllMocks();
  });

  test("should parse input arguments correctly", () => {
    process.argv = [
      "node",
      "script.js",
      "-i",
      "input.xlsx",
      "-p",
      "lastYear.xlsx",
    ];
    game.setUpArgs();

    expect(game.inputFile).toBe("input.xlsx");
    expect(game.lastYearRecordsFile).toBe("lastYear.xlsx");
  });

  test("should throw error if Excel sheet is empty", () => {
    xlsx.parse.mockReturnValue([]);

    expect(() => game.readInput("fake.xlsx", "Employee-List")).toThrow(
      "Excel file is empty"
    );
  });

  test("should throw error if sheet not found", () => {
    xlsx.parse.mockReturnValue([{ name: "Another-Sheet", data: [] }]);

    expect(() => game.readInput("fake.xlsx", "Employee-List")).toThrow(
      "Sheet Employee-List not found"
    );
  });

  test("should convert sheet data to JSON", () => {
    const mockData = [
      {
        name: "Employee-List",
        data: [
          ["Name", "Email"],
          ["John Doe", "john@example.com"],
        ],
      },
    ];
    xlsx.parse.mockReturnValue(mockData);

    const result = game.readInput("fake.xlsx", "Employee-List");
    expect(result).toEqual([{ Name: "John Doe", Email: "john@example.com" }]);
  });

  test("findRandomChild should exclude expected emails", () => {
    const input = [
      { Employee_EmailID: "a@example.com" },
      { Employee_EmailID: "b@example.com" },
      { Employee_EmailID: "c@example.com" },
    ];

    const result = game.findRandomChild(input, ["a@example.com"]);
    expect(result.Employee_EmailID).not.toBe("a@example.com");
  });
});
