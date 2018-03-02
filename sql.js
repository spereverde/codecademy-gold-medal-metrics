var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  return "CREATE TABLE 'Country' (id INTEGER NOT NULL, name TEXT NOT NULL, " +
      "code TEXT NOT NULL, gdp INTEGER, population INTEGER, PRIMARY KEY(id));";
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  return "CREATE TABLE 'GoldMedal' (id INTEGER NOT NULL, year INTEGER NOT NULL, " +
      "name TEXT NOT NULL, event TEXT NOT NULL, gender TEXT NOT NULL, " +
      "sport TEXT NOT NULL, discipline TEXT NOT NULL, city TEXT NOT NULL, " +
      "country TEXT NOT NULL, season TEXT NOT NULL, PRIMARY KEY(id));";
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
    return "SELECT COUNT(*) FROM GoldMedal WHERE country = '" + country + "';";
};

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
    return `SELECT year, COUNT(*) as count from GoldMedal WHERE country = '${country}' 
    AND season = 'Summer' GROUP BY year ORDER BY count DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  return `SELECT year, COUNT(*) as count from GoldMedal WHERE country = '${country}' 
    AND season = 'Winter' GROUP BY year ORDER BY count DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = country => {
  return mostSummerWins(country) + mostWinterWins(country);
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
    return `SELECT discipline, COUNT(*) as count from GoldMedal WHERE country = '${country}' 
      GROUP BY discipline ORDER BY count DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
    return `SELECT sport, COUNT(*) as count from GoldMedal WHERE country = '${country}' 
      GROUP BY sport ORDER BY count DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  return `SELECT event, COUNT(*) as count from GoldMedal WHERE country = '${country}' 
      GROUP BY event ORDER BY count DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = country => {
  return `SELECT COUNT(DISTINCT name) as count from GoldMedal WHERE country = '${country}' AND gender = 'Men' ORDER BY count;`;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  return `SELECT COUNT(DISTINCT name) as count from GoldMedal WHERE country = '${country}' AND gender = 'Women' ORDER BY count;`;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
    return `SELECT name from GoldMedal WHERE country = '${country}' GROUP BY name ORDER BY COUNT(*) DESC LIMIT 1;`;

};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
    let ordered = '';
    if (field) {
        if (sortAscending) {
            ordered = `ORDER BY ${field} ASC;`;
        } else {
            ordered = `ORDER BY ${field} DESC;`;
        }
    }
    return `SELECT * from GoldMedal WHERE country = '${country}' ${ordered};`;
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
    let ordered = '';
    if (field) {
        if (sortAscending) {
            ordered = `ORDER BY ${field} ASC;`;
        } else {
            ordered = `ORDER BY ${field} DESC;`;
        }
    }
    return `SELECT sport, COUNT(sport) as count,
      (COUNT(sport) * 100 / (select COUNT(*) FROM GoldMedal WHERE country = '${country}')) as percentage
      FROM GoldMedal WHERE country = '${country}' GROUP BY sport ${ordered};`;
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
