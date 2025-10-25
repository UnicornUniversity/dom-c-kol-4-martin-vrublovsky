import { test, describe } from "node:test";
import { strict as assert } from "node:assert";
import { assertOutputEmployees, getRandomInt, assertStatistics } from "./HelperFunctions.js"

import { main } from "../main.js";

console.log("-----------------------------");
console.log("STARTING TIME COMPLEXITY TESTS!!!");
console.log("If this test fails, your code has most likely time complexity in O(n^3) or worse!");
console.log("-----------------------------");

const dtoIn = {
  count: 2000,
  age: {
    min: 19,
    max: 35
  }
};

test("TIME COMPLEXITY TEST ! Creating "+dtoIn.count+" records ! ", {timeout: 3000},  () => {
	
	let dtoOut = main(dtoIn);
	assert(dtoOut.sortedByWorkload.length === dtoIn.count, "Ammount of employees created in time sensitive test is not correct.");
	assertOutputEmployees(dtoIn, dtoOut.sortedByWorkload);
	assertStatistics(dtoOut.sortedByWorkload, dtoOut);
});
