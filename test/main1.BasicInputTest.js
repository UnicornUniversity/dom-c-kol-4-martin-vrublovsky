import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { assertStatistics } from "./HelperFunctions.js"

import { generateEmployeeData, getEmployeeStatistics } from "../main.js";


console.log("-----------------------------");
console.log("STARTING BASIC INPUT TESTS!!!");
console.log("-----------------------------");

const dtoIn = {
  count: 50,
  age: {
    min: 19,
    max: 35
  }
};

let employees = generateEmployeeData(dtoIn);
let dtoOut = getEmployeeStatistics(employees);

test('Testing basic input '+employees.length, () => {
	assertStatistics(employees, dtoOut);
});


