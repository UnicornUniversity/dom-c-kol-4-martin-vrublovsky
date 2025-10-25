import { test, describe } from "node:test";
import { strict as assert } from "node:assert";

//Tolerance for min and maximum of generated birthdate in years
const DATE_TOLERACE = 1/12;

// true = person age must be in <age.min, age.max> interval, 
// false = person age must be in <age.min, age.max + 1 year) interval
const USE_CLOSED_INTERVAL_FOR_DATE = true;

//If years are calculated as integers when calculating average years (age) and median age
// true = we expect all years to be integer
// false = we expect years to be exact real numbers
const INTEGER_YEARS = false;

//If years are rounded before comparison or truncated
// true = rounded (17 years+ 6 months = 18 years)
// false = truncated (17 years+ 6 months = 17 years)
const YEARS_ROUNDED = false;

//Maximal number of names/surnames (male+female together)
const MAXIMUM_NAMES = 50;
//Minimal number of names/surnames (male+female together)
const MINIMUM_NAMES = 8;

//For comparison of real numbers
const EPSILON = 0.000000001;

/**
 *
 * @param dtoOut
 * @param dtoIn
 */
export function assertBasicStructureEmployees(dtoIn, dtoOut) {
	//dtoIn properties
	assert(dtoIn.hasOwnProperty('count'), 'Testing that dtoIn properties are not deleted - count');
	assert(dtoIn.hasOwnProperty('age'), 'Testing that dtoIn properties are not deleted - age');
	assert(dtoIn.age.hasOwnProperty('min'), 'Testing that dtoIn properties are not deleted - age.min');
	assert(dtoIn.age.hasOwnProperty('max'), 'Testing that dtoIn properties are not deleted - age.max');
	
	//dtoOut properties
	assert(Array.isArray(dtoOut), 'Testing that dtoOut properties - dtoOut is an array');
	assert(dtoOut.length === dtoIn.count, 'Testing basic input - output person count of '+dtoOut.length +'is equal input count '+dtoIn.count);
	
	for(let i =0;i<dtoOut.length;i++){
		const person = dtoOut[i];
		assert(person.hasOwnProperty('gender'), 'Testing that dtoOut properties exist - gender');
		assert(person.hasOwnProperty('workload'), 'Testing that dtoOut properties exist - workload');
		assert(person.hasOwnProperty('name'), 'Testing that dtoOut properties exist - name');
		assert(person.hasOwnProperty('surname'), 'Testing that dtoOut properties exist - surname');
		assert(person.hasOwnProperty('birthdate'), 'Testing that dtoOut properties exist - birthdate');
	}
}

export function assertBasicStructureStatistics(dtoIn, dtoOut) {
	
	//statistics properties
	assert(Array.isArray(dtoOut.sortedByWorkload), 'Testing statistics properties - sortedByWorkload is an array');
	assert(dtoOut.sortedByWorkload.length === dtoIn.count, 'Testing statistics properties - sortedByWorkload count of '+dtoOut.sortedByWorkload.length +'is equal input count '+dtoIn.count);
	
	assert(dtoOut.hasOwnProperty('total'), 'Testing that statistics total property exist');
	
	assert(dtoOut.hasOwnProperty('workload10'), 'Testing that statistics workload10 property exist');
	assert(dtoOut.hasOwnProperty('workload20'), 'Testing that statistics workload20 property exist');
	assert(dtoOut.hasOwnProperty('workload30'), 'Testing that statistics workload30 property exist');
	assert(dtoOut.hasOwnProperty('workload40'), 'Testing that statistics workload40 property exist');
	
	assert(dtoOut.hasOwnProperty('medianWorkload'), 'Testing that statistics medianWorkload property exist');
	assert(dtoOut.hasOwnProperty('averageWomenWorkload'), 'Testing that statistics averageWomenWorkload property exist');
	
	assert(dtoOut.hasOwnProperty('averageAge'), 'Testing that statistics averageAge property exist');
	assert(dtoOut.hasOwnProperty('minAge'), 'Testing that statistics minAge property exist');
	assert(dtoOut.hasOwnProperty('maxAge'), 'Testing that statistics maxAge property exist');
	assert(dtoOut.hasOwnProperty('medianAge'), 'Testing that statistics medianAge property exist');
	
	for(let i =0;i<dtoOut.sortedByWorkload.length;i++){
		const person = dtoOut.sortedByWorkload[i];
		assert(person.hasOwnProperty('gender'), 'Testing that statistics sortedByWorkload properties exist - gender');
		assert(person.hasOwnProperty('workload'), 'Testing that statistics sortedByWorkload  properties exist - workload');
		assert(person.hasOwnProperty('name'), 'Testing that statistics sortedByWorkload  properties exist - name');
		assert(person.hasOwnProperty('surname'), 'Testing that statistics sortedByWorkload  properties exist - surname');
		assert(person.hasOwnProperty('birthdate'), 'Testing that statistics sortedByWorkload  properties exist - birthdate');
	}
}

/**
 *
 * @param dtoOut
 * @param dtoIn
 */
export function assertOutputEmployees(dtoIn, dtoOut) {
	//tests basic structure of input+output is correct
	assertBasicStructureEmployees(dtoIn, dtoOut);
	
	const names = {};
	const surnames = {};
	const dates = {};
	const workloads = {};
	const sexes = {};
	for(let i =0;i<dtoOut.length;i++){
		const person = dtoOut[i];
	  
		assert(["male", "female"].includes(person.gender), 'Testing basic input - permitted gender (sex) value of '+person.gender);
	  	assert([10, 20, 30, 40].includes(person.workload), 'Testing basic input - permitted workload value of '+person.workload);
	  
		sexes[person.gender] = ++sexes[person.gender] || 1;
	  	names[person.name] = ++names[person.name] || 1;
		surnames[person.surname] = ++surnames[person.surname] || 1;
		workloads[person.workload] = ++workloads[person.workload] || 1;
		dates[person.birthdate] = ++dates[person.birthdate] || 1;
		
		let date = parseISOString(person.birthdate);
		assertDate(date, dtoIn);
	}
	
	//testing right count - should not fail
	assert(Object.values(sexes).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has sex');
	assert(Object.values(dates).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has date');
	assert(Object.values(workloads).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has workload');
	assert(Object.values(names).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has name');
	assert(Object.values(surnames).reduce((sum, value) => sum + value,  0) === dtoIn.count, 'Testing basic input - Testing that every person has surname');


  
  //testing usage of all/proper count of options
	assert(Object.keys(workloads).length === 4, 'Testing basic input - Testing that all options for every workload is used');
	assert(Object.keys(sexes).length === 2, 'Testing basic input - Testing that all options for every sex (gender) is used');
	assert(Object.keys(names).length>=MINIMUM_NAMES, 'Testing basic input - Testing that at least '+MINIMUM_NAMES+' names are used');
	assert(Object.keys(surnames).length>=MINIMUM_NAMES, 'Testing basic input - Testing that at least '+MINIMUM_NAMES+' surnames are used');
	assert(Object.keys(names).length<=MAXIMUM_NAMES, 'Testing basic input - Testing that no more than '+MAXIMUM_NAMES+' names are used');
	assert(Object.keys(surnames).length<=MAXIMUM_NAMES, 'Testing basic input - Testing that no more than '+MAXIMUM_NAMES+' surnames are used');
	assert(Object.keys(dates).length===dtoIn.count, 'Testing basic input - Testing that every person has a different birthdate');
}



/**
 *
 * @param date
 * @param dtoIn
 */
export function assertDate(date, dtoIn) {
  	const now = new Date();
    const years = (now - date)/(1000*60*60*24*365.25);
	
	assert(years+(DATE_TOLERACE)>=dtoIn.age.min, 'Testing basic input - Testing that person born in '+date.toISOString()+", i.e. "+years+" y.o., is older than "+dtoIn.age.min);
	if(USE_CLOSED_INTERVAL_FOR_DATE)
		assert(years-(DATE_TOLERACE)<=dtoIn.age.max, 'Testing basic input - Testing that person born in '+date.toISOString()+", i.e. "+years+" y.o., is younger than "+dtoIn.age.max);
	else
		assert(years-(DATE_TOLERACE)<dtoIn.age.max+1, 'Testing basic input - Testing that person born in '+date.toISOString()+", i.e. "+years+" y.o., is younger than "+dtoIn.age.max);
}


//YYYY-MM-DDTHH:mm:ss.sssZ
//i.e. "2000-01-03T00:00:00.000Z"
/**
 *
 * @param isoString
 */
export function parseISOString(isoString){
	assert(isoString.length === 24, 'Testing basic input - testing date character size of '+isoString+' is 24 (is '+isoString.length+')!');
	
	//year
	let year = isoString.substring(0, 4);
	assert(Number.isInteger(+year), 'Testing basic input - testing date year is a number: '+year+" in "+isoString+" int value: "+ (+year));
	assert(+year > 0, 'Testing basic input - testing date year is in AD: '+year+" in "+isoString+" int value: "+ (+year));
	assert(+year <= (new Date()).getFullYear(), 'Testing basic input - testing date year is not in future: '+year+" in "+isoString+" int value: "+ (+year));
	
	//separators
	assert(isoString.charAt(4)==='-', 'Testing basic input - testing date separator "-" on index 4 in '+isoString);
	assert(isoString.charAt(7)==='-', 'Testing basic input - testing date separators "-" on index 7 in '+isoString);
	assert(isoString.charAt(10)==='T', 'Testing basic input - testing date separators "T" on index 10 in '+isoString);
	assert(isoString.charAt(13)===':', 'Testing basic input - testing date separators ":" on index 13 in '+isoString);
	assert(isoString.charAt(16)===':', 'Testing basic input - testing date separators ":" on index 16 in '+isoString);
	assert(isoString.charAt(19)==='.', 'Testing basic input - testing date separators "." on index 19 in '+isoString);
	assert(isoString.charAt(23)==='Z', 'Testing basic input - testing date separators "Z" on index 23 in '+isoString);
	
	//month
	let monthString = isoString.substring(5, 7);
	let intMonth = +monthString;
	assert(Number.isInteger(+monthString), 'Testing basic input - testing date month is a number: '+monthString+" in "+isoString+" int value: "+ (+monthString));
	assert(intMonth > 0, 'Testing basic input - testing date month is > 0: '+monthString+" in "+isoString+" int value: "+ (+monthString));
	assert(intMonth < 13, 'Testing basic input - testing date month is < 13: '+monthString+" in "+isoString+" int value: "+ (+monthString));
	let month = monthString-1;//month sould be index
	
	//day
	let day = isoString.substring(8, 10);
	assert(Number.isInteger(+day), 'Testing basic input - testing date day is a number: '+day+" in "+isoString+" int value: "+ (+day));
	assert(+day > 0, 'Testing basic input - testing date day > 0: '+day+" in "+isoString+" int value: "+ (+day));
	assert(!isNaN(new Date(+year, +month, +day)), 'Testing basic input - testing date day is a valid day in month and year: '+day+" in "+isoString+" int value: "+ (+day));

	//hout
	let hour = isoString.substring(11, 13);
	assert(Number.isInteger(+hour), 'Testing basic input - testing date hour is a number: '+hour+" in "+isoString+" int value: "+ (+hour));
	assert(+hour >= 0, 'Testing basic input - testing date hour >= 0: '+hour+" in "+isoString+" int value: "+ (+hour));
	assert(+hour <= 24, 'Testing basic input - testing date hour <= 24: '+hour+" in "+isoString+" int value: "+ (+hour));
	
	//minutes
	let minute = isoString.substring(14, 16);
	assert(Number.isInteger(+minute), 'Testing basic input - testing date minute is a number: '+minute+" in "+isoString+" int value: "+ (+minute));
	assert(+minute >= 0, 'Testing basic input - testing date minute >= 0: '+minute+" in "+isoString+" int value: "+ (+minute));
	assert(+minute <= 60, 'Testing basic input - testing date minute <= 60: '+minute+" in "+isoString+" int value: "+ (+minute));
	
	//second
	let second = isoString.substring(17, 19);
	assert(Number.isInteger(+second), 'Testing basic input - testing date second is a number: '+second+" in "+isoString+" int value: "+ (+second));
	assert(+second >= 0, 'Testing basic input - testing date second >= 0: '+second+" in "+isoString+" int value: "+ (+second));
	assert(+second <= 60, 'Testing basic input - testing date second <= 60: '+second+" in "+isoString+" int value: "+ (+second));

	//ms
	let milisecond = isoString.substring(20, 23);
	assert(Number.isInteger(+milisecond), 'Testing basic input - testing date milisecond is a number: '+milisecond+" in "+isoString+" int value: "+ (+milisecond));
	assert(+milisecond >= 0, 'Testing basic input - testing date milisecond >= 0: '+milisecond+" in "+isoString+" int value: "+ (+milisecond));
	assert(+milisecond <= 999, 'Testing basic input - testing date milisecond <= 999: '+milisecond+" in "+isoString+" int value: "+ (+milisecond));

	//valid date
	const date = new Date(+year, +month, +day, +hour, +minute, +second, +milisecond);
	assert(!isNaN(date), 'Testing basic input - testing date correct format of '+isoString);
	
	return date;
}

//tests results from 4th assignment
export function assertStatistics(employees, dtoOut) {
	
	assert(dtoOut.length === employees.total, 'Testing statistics - output person count of '+dtoOut.length +' is not equal input count '+employees.total);
	
	let workloads = {};
	let ages = [];
	let averageAge = 0, minAge = +Infinity, maxAge = -Infinity, averageWomenWorkload = 0, females = 0;
	for(let i =0;i<employees.length;i++){
		const person = employees[i];
		
		workloads[person.workload] = ++workloads[person.workload] || 1;
		if(person.gender === "female")
		{
			averageWomenWorkload += person.workload;
			females++;
		}
		
		const now = new Date();
		let age = (now - new Date(person.birthdate))/(1000*60*60*24*365.25);
		if(INTEGER_YEARS) {
			if(YEARS_ROUNDED){
				age = +(age.toFixed(0));
			} else {
				age = (age | 0);
			}
		}
		
		averageAge += age;
		ages[i] = age;
		
		minAge = minAge < age ? minAge : age;
		maxAge = maxAge > age ? maxAge : age;
	}
	
	assert(workloads["10"] === dtoOut.workload10, 'Testing statistics - workload10 should be '+workloads["10"]+' and is '+dtoOut.workload10);
	assert(workloads["20"] === dtoOut.workload20, 'Testing statistics - workload20 should be '+workloads["20"]+' and is '+dtoOut.workload20);
	assert(workloads["30"] === dtoOut.workload30, 'Testing statistics - workload30 should be '+workloads["30"]+' and is '+dtoOut.workload30);
	assert(workloads["40"] === dtoOut.workload40, 'Testing statistics - workload40 should be '+workloads["40"]+' and is '+dtoOut.workload40);
	
	averageAge /= employees.length;
	averageWomenWorkload /= females;
	
	assert( Math.abs(dtoOut.averageAge-(+dtoOut.averageAge.toFixed(1))) < EPSILON, "Testing statistics - average age ("+dtoOut.averageAge+") is rounded to 1 decimal place.");
	assert(averageAge+(DATE_TOLERACE)>=dtoOut.averageAge, "Testing statistics - average age ("+dtoOut.averageAge+") is about equal "+averageAge);
	assert(averageAge-(DATE_TOLERACE)<=dtoOut.averageAge, "Testing statistics - average age ("+dtoOut.averageAge+") is about equal "+averageAge);
	
	assert( Math.abs(dtoOut.averageWomenWorkload-(+dtoOut.averageWomenWorkload.toFixed(1))) < EPSILON, "Testing statistics - averageWomenWorkload ("+dtoOut.averageWomenWorkload+") is rounded to at most 1 decimal place.");
	assert((+averageWomenWorkload.toFixed(1)) === dtoOut.averageWomenWorkload || (+averageWomenWorkload.toFixed(0)) === dtoOut.averageWomenWorkload, "Testing statistics - averageWomenWorkload ("+dtoOut.averageWomenWorkload+") is equal "+averageWomenWorkload+" when fixed to 1 or 0 decimal places")

	assert(YEARS_ROUNDED ? +(minAge.toFixed(0)) === dtoOut.minAge : truncAgeEquals(minAge, dtoOut.minAge), 'Testing statistics - minAge '+dtoOut.minAge+' should be '+(YEARS_ROUNDED ? +(minAge.toFixed(0)) : (minAge | 0)));
	assert(YEARS_ROUNDED ? +(maxAge.toFixed(0)) === dtoOut.maxAge : truncAgeEquals(maxAge, dtoOut.maxAge), 'Testing statistics - maxAge '+dtoOut.maxAge+' should be '+(YEARS_ROUNDED ? +(maxAge.toFixed(0)) : (maxAge | 0)));

	let medianAge = median(ages);
	assert(YEARS_ROUNDED ? +(medianAge.toFixed(0)) === dtoOut.medianAge : truncAgeEquals(medianAge, dtoOut.medianAge), 'Testing statistics - medianAge '+dtoOut.medianAge+' should be '+YEARS_ROUNDED ? +(medianAge.toFixed(0)) : (medianAge | 0));
	
	//yes, this calculation is totaly meaningless as median function could have been used instead. But it´s efficient.
	let medianWorkload = 0, sumWorkload = 0, middleIndex = ((employees.length / 2) | 0);
	for(let i = 10;i<40;i+=10){
		sumWorkload += workloads[i];
		if(sumWorkload >= middleIndex+1){
			if (employees.length % 2 === 0 && sumWorkload-workloads[i] >=middleIndex) {
				medianWorkload =  0.5*i+0.5*(i-10);
			}
			else {
				medianWorkload = i;
			}
			break;
		}
	}
	
	assert(medianWorkload === dtoOut.medianWorkload, 'Testing statistics - medianWorkload '+dtoOut.medianWorkload+' should be '+medianWorkload);
	
	const sorted = Array.from(employees).sort((a, b) => a.workload - b.workload);
	for(let i = 0;i < sorted.length;i++){
		assert(dtoOut.sortedByWorkload[i].workload === sorted[i].workload, 'Testing statistics - sortedByWorkload is sorted in same way - workload '+dtoOut.sortedByWorkload[i].workload+' is not '+sorted[i].workload);
		//assert(dtoOut.sortedByWorkload[i].name === sorted[i].name, 'Testing statistics - sortedByWorkload is sorted in same way - name '+dtoOut.sortedByWorkload[i].name+' is not '+sorted[i].name);
		//assert(dtoOut.sortedByWorkload[i].surname === sorted[i].surname, 'Testing statistics - sortedByWorkload is sorted in same way - surname '+dtoOut.sortedByWorkload[i].surname+' is not '+sorted[i].surname);
		//assert(dtoOut.sortedByWorkload[i].gender === sorted[i].gender, 'Testing statistics - sortedByWorkload is sorted in same way - gender '+dtoOut.sortedByWorkload[i].gender+' is not '+sorted[i].gender);
		//assert(dtoOut.sortedByWorkload[i].birthdate === sorted[i].birthdate, 'Testing statistics - sortedByWorkload is sorted in same way - birthdate '+dtoOut.sortedByWorkload[i].birthdate+' is not '+sorted[i].birthdate);
	}
	
}

/**
 * Courtesy of Lukáš Nemerád
 */
export function truncAgeEquals(expected, actual) {
    const min = (expected - DATE_TOLERACE) | 0;
    const max = (expected + DATE_TOLERACE) | 0;
    return Number.isInteger(actual) && min <= actual && actual <= max;
}

export function compareEmpoyeeLists(testedList, expectedList){
	assert(testedList.length === expectedList.length, 'Comparing employee lists - length '+testedList.length+' should be '+expectedList.length);
	
	for(let i = 0;i < expectedList.length;i++){
		assert(testedList[i].workload === expectedList[i].workload, 'Comparing employee lists - workload '+testedList[i].workload+' is not '+expectedList[i].workload);
		assert(testedList[i].name === expectedList[i].name, 'Comparing employee lists - name '+testedList[i].name+' is not '+expectedList[i].name);
		assert(testedList[i].surname === expectedList[i].surname, 'Comparing employee lists - surname '+testedList[i].surname+' is not '+expectedList[i].surname);
		assert(testedList[i].gender === expectedList[i].gender, 'Comparing employee lists - gender '+testedList[i].gender+' is not '+expectedList[i].gender);
		assert(testedList[i].birthdate === expectedList[i].birthdate, 'Comparing employee lists - birthdate '+testedList[i].birthdate+' is not '+expectedList[i].birthdate);
	}
}

/**
 *
 * @param max
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = ((sorted.length / 2) | 0);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}