import DateUtils from "../../../db/utils/DateUtils";
import Test from "../../classes/Test";
import TestSuite from "../../classes/TestSuite";
import Assertion from "../../lib/Assertion";

export default class DateUtilsTests extends TestSuite {
    tests = [

        /**
         * Check if normalizing the number 1 with 4 digits
         * it has to be 0001 
         */
        new Test(async function normalizeTest(){
            const number = 1;
            const normalizedNumber = DateUtils.normalize(number,4);

            Assertion.assert(normalizedNumber == "0001")
        }),

        /**
         * Check if a date can be convert to standard format
         * input: 2020/01/01 12:00:00
         * expected: 2020/01/01 12:00:00
         */
        new Test(async function toStandardDate(){
            const date = new Date("2020/01/01 00:00:00");
            const standardDate = DateUtils.toStandardDate(date);
            console.log(standardDate);
            
            Assertion.assert(standardDate == "2020/01/01 00:00:00")            
        }),

        /**
         * Check if a date can be convert to SQLite format
         * input: 2020/01/01 12:00:00
         * expected: 2020-01-01 12:00:00             
         */
        new Test(async function toSQLiteDate(){
            const date = new Date("2020/01/01 00:00:00");
            const sqliteDate = DateUtils.toSQLiteDate(date);
            console.log(sqliteDate);
            
            Assertion.assert(sqliteDate == "2020-01-01 00:00:00")            
        }),

        /**
         * Check if a date can be convert to Europe format
         * input: 2020-01-01 12:00:00
         * expected: 2020/01/01 12:00:00
         */
        new Test(async function toEuropeDate(){
            const date = new Date("2020/01/01 00:00:00");
            const europeDate = DateUtils.toEuropeDate(date);
            console.log(europeDate);
            
            Assertion.assert(europeDate == "01/01/2020 00:00:00")            
        }),

        /**
         *  Check if date comparison works 
         *  subtest 1: 2020-01-01 12:00:00 == 2020-01-01 12:00:00
         *  subtest 2: 2020-01-01 12:00:00 > 2020-01-01 12:00:01
         *  subtest 3: 2020-01-01 12:00:00 < 2020-01-01 12:00:01
         */
        new Test(async function compareBySecondConversionTest(){

            console.log("Comparing equal dates");
            const date1 = new Date("2020/01/01 00:00:00");
            const date2 = new Date("2020/01/01 00:00:00");
            const result = DateUtils.compareBySecondConversion(date1,date2);
            Assertion.assert(result == 0)

            console.log("Comparing date1 > date2");
            const date3 = new Date("2020/01/01 00:00:01");
            const result2 = DateUtils.compareBySecondConversion(date1,date3);
            Assertion.assert(result2 == -1)

            console.log("Comparing date1 < date2");
            const date4 = new Date("2019/01/01 00:00:00");
            const result3 = DateUtils.compareBySecondConversion(date1,date4);
            Assertion.assert(result3 == 1)

        }),

        /**
         * Check if leap year is calculated correctly
         * subtest 1: 2020 is leap year
         * subtest 2: 2019 is not leap year
         * subtest 3: 400 is leap year
         */
        new Test(async function isLeapYearTest(){
            const result = DateUtils.isLeapYear(2020);
            Assertion.assert(result == true)

            const result2 = DateUtils.isLeapYear(2019);
            Assertion.assert(result2 == false)

            const result3 = DateUtils.isLeapYear(400);
            Assertion.assert(result3 == true)
            
        }),



    ]


    async runAll(){
        return await super.runAll(this.constructor.name)
    }
}