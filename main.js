/* const dtoIn = {
  count: 50,
  age: {
    min: 19,
    max: 35
  }
} */

const genders = ['male', 'female'];

const maleNames = ['Jan', 'Petr', 'Martin', 'Tomáš', 'Jakub', 'Lukáš', 'Josef', 'Jiří', 'Adam', 'David', 'Ondřej', 'Michal', 'Václav', 'Roman', 'Filip', 'Karel', 'Marek', 'Aleš', 'Radek', 'Jaroslav', 'Daniel', 'Šimon', 'Matěj', 'Hynek', 'Erik'];
const femaleNames = ['Anna', 'Marie', 'Tereza', 'Eliška', 'Adéla', 'Karolína', 'Kristýna', 'Kateřina', 'Lucie', 'Natálie', 'Veronika', 'Barbora', 'Markéta', 'Klára', 'Jana', 'Nikola', 'Patricie', 'Alžběta', 'Monika', 'Denisa', 'Sandra', 'Simona', 'Zuzana', 'Michaela', 'Sabina'];

const maleSurnames = ['Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák', 'Němec', 'Marek', 'Král', 'Fiala', 'Růžička', 'Beneš', 'Holub', 'Pokorný', 'Kadlec', 'Jelínek', 'Urban', 'Pospíšil', 'Kolář', 'Sedláček', 'Šimek', 'Kříž'];
const femaleSurnames =['Nováková', 'Svobodová', 'Novotná', 'Dvořáková', 'Černá', 'Procházková', 'Kučerová', 'Veselá', 'Horáková', 'Němcová', 'Marková', 'Králová', 'Fialová', 'Růžičková', 'Benešová', 'Holubová', 'Pokorná', 'Kadlecová', 'Jelínková', 'Urbanová', 'Pospíšilová', 'Kolářová', 'Sedláčková', 'Šimková', 'Křížová'];

const workloads = [10, 20, 30, 40];

/**
 * The helper function which returns a random item from the given array.
 * @param {Array} array to pick a random item from
 * @returns {*} a randomly selected item from the array
 */
export const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * The function which generates a random birthdate of an employee in ISO format between the minimum and maximum age limits.
 * @param {number} minAge the minimum age limit of the employee
 * @param {number} maxAge the maximum age limit of the employee
 * @returns {string} a random birthdate in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export const getRandomBirthdate = (minAge, maxAge) => {
  const now = Date.now();
  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

  const minBirthTimestamp = now - maxAge * MS_PER_YEAR;
  const maxBirthTimestamp = now - minAge * MS_PER_YEAR;

  const randomBirthTimestamp = minBirthTimestamp + Math.random() * (maxBirthTimestamp - minBirthTimestamp);

  const randomBirthdate = new Date(randomBirthTimestamp);

  return randomBirthdate.toISOString();
}

/**
 * The function which generates a list of random employees of a company.
 * @param {object} dtoIn contains count of employees, age limit of employees { min, max }
 * @returns {Array} of employees
 */
export const generateEmployeeData = (dtoIn) => {
  const { count, age: { min, max } } = dtoIn;

  let dtoOut = [];

  for (let i = 0; i < count; i++) {
    const gender = getRandomItem(genders);

    const birthdate = getRandomBirthdate(min, max);

    const name = gender === 'male' ? getRandomItem(maleNames) : getRandomItem(femaleNames);
    const surname = gender === 'male' ? getRandomItem(maleSurnames) : getRandomItem(femaleSurnames);

    const workload = getRandomItem(workloads);

    dtoOut.push({
      gender,
      birthdate,
      name,
      surname,
      workload,
    });
  }

  return dtoOut;
}

const now = Date.now();
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * The function which calculates the average age of the employees.
 * @param {Array<object>} employees array of employee objects
 * @param {number} total total number of employees
 * @returns {number} average age rounded to one decimal place
 */
export const calculateAverageAge = (employees, total) => {
  let employeesAgeSum = 0;

  for (const employee of employees) {
    const employeeAge = (now - new Date(employee.birthdate).getTime()) / MS_PER_YEAR;
    employeesAgeSum += employeeAge;
  }

  const averageAge = Math.round((employeesAgeSum / total) * 10) / 10;

  return averageAge;
}

/**
 * The function which calculates the minimum and maximum age among employees.
 * @param {Array<object>} employees array of employee objects
 * @returns {object} object containing minAge and maxAge (both integers)
 */
export const calculateMinMaxAge = (employees) => {
  let minAge = Infinity;
  let maxAge = -Infinity;

  for (const employee of employees) {
    const employeeAge = (now - new Date(employee.birthdate).getTime()) / MS_PER_YEAR;

    if (employeeAge < minAge) {
      minAge = employeeAge;
    }

    if (employeeAge > maxAge) {
      maxAge = employeeAge;
    }
  }

  return {
    minAge: Math.floor(minAge),
    maxAge: Math.floor(maxAge),
  };
}

/**
 * The function which calculates the median age of employees.
 * @param {Array<object>} employees array of employee objects
 * @param {number} total total number of employees
 * @returns {number} median age (integer)
 */
export const calculateMedianAge = (employees, total) => {
  let employeesAgeArray = [];
  let medianAge = 0;

  for (const employee of employees) {
    const employeeAge = (now - new Date(employee.birthdate).getTime()) / MS_PER_YEAR;
    employeesAgeArray.push(employeeAge);
  }

  const sortedEmployeesAgeArray = employeesAgeArray.sort((employeeAgeA, employeeAgeB) => employeeAgeA - employeeAgeB);

  if (total % 2 === 0) {
    medianAge = Math.floor((sortedEmployeesAgeArray[total / 2 - 1] + sortedEmployeesAgeArray[total / 2]) / 2);
  } else {
    medianAge = Math.floor(sortedEmployeesAgeArray[Math.floor(total / 2)]);
  }

  return medianAge;
}

/**
 * The function which calculates the median workload of employees.
 * @param {Array<object>} employees array of employee objects
 * @param {number} total total number of employees
 * @returns {number} median workload (integer)
 */
export const calculateMedianWorkload = (employees, total) => {
  let employeesWorkloadArray = [];
  let medianWorkload = 0;

  for (const employee of employees) {
    const employeeWorkload = employee.workload;
    employeesWorkloadArray.push(employeeWorkload);
  }

  const sortedEmployeesWorkloadArray = employeesWorkloadArray.sort((employeeWorkloadA, employeeWorkloadB) => employeeWorkloadA - employeeWorkloadB);

  if (total % 2 === 0) {
    medianWorkload = Math.floor((sortedEmployeesWorkloadArray[total / 2 - 1] + sortedEmployeesWorkloadArray[total / 2]) / 2);
  } else {
    medianWorkload = Math.floor(sortedEmployeesWorkloadArray[Math.floor(total / 2)]);
  }

  return medianWorkload;
}

/**
 * The function which calculates the average workload of female employees.
 * @param {Array<object>} employees array of employee objects
 * @returns {number} average workload of female employees, rounded to one decimal place; returns 0 if there are no female employees
 */
export const calculateAverageWomenWorkload = (employees) => {
  let femaleCount = 0;
  let femaleWorkloadSum = 0;

  for (const employee of employees) {
    if (employee.gender === 'female') {
      femaleCount++;
      femaleWorkloadSum += employee.workload;
    }
  }

  const averageWomenWorkload = femaleCount > 0
    ? Number((femaleWorkloadSum / femaleCount).toFixed(1))
    : 0;

  return averageWomenWorkload;
}

/**
 * The function which generates the statistics of the employees.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export const getEmployeeStatistics = (employees) => {
  let dtoOut = {};

  const total = employees.length;

  const workload10 = employees.filter((employee) => employee.workload === 10).length;
  const workload20 = employees.filter((employee) => employee.workload === 20).length;
  const workload30 = employees.filter((employee) => employee.workload === 30).length;
  const workload40 = employees.filter((employee) => employee.workload === 40).length;

  const averageAge = calculateAverageAge(employees, total);

  const { minAge, maxAge } = calculateMinMaxAge(employees);

  const medianAge = calculateMedianAge(employees, total);

  const medianWorkload = calculateMedianWorkload(employees, total);

  const averageWomenWorkload = calculateAverageWomenWorkload(employees);

  const sortedByWorkload = [...employees].sort((employeeA, employeeB) => employeeA.workload - employeeB.workload);

  dtoOut = {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload,
  };

  return dtoOut;
}

/**
 * The main function which calls the application.
 * This application generates a sorted list of random employees of a company and employee statistics from this list (for a more detailed description of the application, see the algorithm).
 * @param {object} dtoIn contains count of employees, age limit of employees { min, max }
 * @returns {Array} of employees and employee statistics
 */
export const main = (dtoIn) => {
  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);

  return dtoOut;
}

/* TEST */
// console.log(JSON.stringify(main(dtoIn), null, 2));
