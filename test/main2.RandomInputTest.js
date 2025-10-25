import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { generateEmployeeData, getEmployeeStatistics } from "../main.js";

import { assertStatistics, getRandomInt } from "./HelperFunctions.js"


console.log("-----------------------------");
console.log("STARTING RANDOM INPUT TESTS!!!");
console.log("-----------------------------");

for(let i = 0;i<100;i++){
	const dtoIn = {
		count: getRandomInt(51)+50,
		age: {
			min: getRandomInt(35),
			max: getRandomInt(50)+35
		}
	};
	let employees = generateEmployeeData(dtoIn);
	let dtoOut = getEmployeeStatistics(employees);

	test('Testing random input '+employees.length, () => {
		assertStatistics(employees, dtoOut);
	});
	//TODO test 2 outputs are not same in any field
}



