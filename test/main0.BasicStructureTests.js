import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { assertOutputEmployees, assertBasicStructureEmployees, parseISOString, assertDate, compareEmpoyeeLists, assertBasicStructureStatistics, assertStatistics } from "./HelperFunctions.js"

import { main, generateEmployeeData, getEmployeeStatistics } from "../main.js";


console.log("-----------------------------");
console.log("STARTING BASIC STRUCTURE TESTS!!!");
console.log("-----------------------------");

const dtoIn = {
  count: 50,
  age: {
    min: 19,
    max: 35
  }
};
let employees = generateEmployeeData(dtoIn);

test('Testing basic employee structure of input and output ', () => {
	assertBasicStructureEmployees(dtoIn, employees);
});

test('Testing date format of emplyees', () => {
	for(let i =0;i<employees.length;i++){
		const person = employees[i];
	  		
		let date = parseISOString(person.birthdate);
	}
});

test('Testing birth in correct time interval', () => {
	for(let i =0;i<employees.length;i++){
		const person = employees[i];
	  		
		let date = parseISOString(person.birthdate);
		assertDate(date, dtoIn);
	}
});

let employeesCopy = Array.from(employees);

let dtoOut = getEmployeeStatistics(employees);

test('Testing that getEmployeeStatistics does not change original employee list ', () => {
	compareEmpoyeeLists(employees, employeesCopy);
});

test('Testing that employee statistics have correct structure ', () => {
	assertBasicStructureStatistics(dtoIn, dtoOut);
});

test('Testing that employee statistics have correct results ', () => {
	assertStatistics(employees, dtoOut);
});