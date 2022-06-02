export default class DateUtils {
    
    static DATE_FORMAT = {
        STANDARD : "yyyy/MM/dd HH:mm:ss",
        EUROPE :  "dd/MM/yyyy HH:mm:ss",
        SQLITE : "yyyy-MM-dd HH:mm:ss"
    }

    /*
    * Format a date in standard format
    * @param date The date to format
    * @returns The formatted date as string
    */
    public static toStandardDate(date : Date) : string {
        return this.dateToString(date,DateUtils.DATE_FORMAT.STANDARD);    
    }

    /**
     * Format a date in europe format
     * @param date The date to format
     * @returns The formatted date as string
     */
    public static toEuropeDate(date : Date) : string {
        return this.dateToString(date, DateUtils.DATE_FORMAT.EUROPE);        
    }

    /**
     * Format a date in sqlite format
     * @param date The date to format
     * @returns The formatted date as string
     */
    public static toSQLiteDate(date : Date) : string {
        return this.dateToString(date, DateUtils.DATE_FORMAT.SQLITE);        
    }

    /**
     * Convert a date to String matching the given format1 
     * @param date The date to format
     * @param format The format to match
     * @returns The formatted date as string
     */
    private static dateToString(date: Date, format : string) : string {
        if (!date) {
            return "";
        }

        let result = format;
        result = result.replace("yyyy","" + this.normalize(date.getFullYear(),4));
        result = result.replace("MM","" + this.normalize(date.getMonth() + 1, 2));
        result = result.replace("dd","" + this.normalize(date.getDate(),2));

        result = result.replace("HH","" + this.normalize(date.getHours(),2));
        result = result.replace("mm","" + this.normalize(date.getMinutes(),2));
        result = result.replace("ss","" + this.normalize(date.getSeconds(),2));

        return result;    
    }

    /**
     * Add zeros to a given number to match a length
     * @param number The number to normalize
     * @param digits The number of digits to match
     * @returns The normalized number
     */
    public static normalize(number: number, digits: number): string {

        let result = "" + number;

        const realDigits = ("" + number).length;
        const missing = digits - realDigits;
    
        for (let i = 0; i < missing; i++) {          
            result = "0" + result;
        }
        
        return result;
    }


    
    public static HOURS_IN_DAY = 24;
    public static MINUTES_IN_HOUR = 60;
    public static SECONDS_IN_MINUTE = 60;


    /**
     * Compare two dates converting them in seconds
     * @param date1 The first date
     * @param date2 The second date
     */
    public static compareBySecondConversion(date1 : Date, date2 : Date) : number {
        
        const d1y = date1.getFullYear();
        const d1m = date1.getMonth();
        const d1d = date1.getDate();
        const d1h = date1.getHours();
        const d1i = date1.getMinutes();
        const d1s = date1.getSeconds();

        const d2y = date2.getFullYear();
        const d2m = date2.getMonth();
        const d2d = date2.getDate();
        const d2h = date2.getHours();
        const d2i = date2.getMinutes();
        const d2s = date2.getSeconds();


        let totalD1 = 0;
        let totalD2 = 0;

        // Add seconds
        totalD1 += d1s;
        totalD2 += d2s;

        // Add minutes
        totalD1 += d1i * DateUtils.SECONDS_IN_MINUTE;
        totalD2 += d2i * DateUtils.SECONDS_IN_MINUTE;

        // Add hours
        totalD1 += d1h * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;
        totalD2 += d2h * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;

        // Add days
        totalD1 += d1d * DateUtils.HOURS_IN_DAY * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;
        totalD2 += d2d * DateUtils.HOURS_IN_DAY * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;

        // Add months
        totalD1 += DateUtils.getDaysInMonths(d1y, d1m) * DateUtils.HOURS_IN_DAY * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;
        totalD2 += DateUtils.getDaysInMonths(d2y, d2m) * DateUtils.HOURS_IN_DAY * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;

        // Add years
        totalD1 += DateUtils.getDaysInYears(d1y) * DateUtils.HOURS_IN_DAY * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;        
        totalD2 += DateUtils.getDaysInYears(d2y) * DateUtils.HOURS_IN_DAY * DateUtils.MINUTES_IN_HOUR * DateUtils.SECONDS_IN_MINUTE;        

        const delta = totalD1 - totalD2;

        if(delta > 0) {
            return 1;
        }
        else if(delta < 0) {
            return -1;
        }

        return 0;
    }

    /**
     * Get if is leap year
     * @param year The year to check
     * @returns If is leap year
     */
    public static isLeapYear(year : number) : boolean {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

    /**
     * Get the number of days in a month
     * @param year The year
     * @param month The month
     * @returns The number of days in the month
     */
    public static getDaysInMonth(year : number, month : number) : number {
        return [31, DateUtils.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    /**
     * Get the total number of days in a given number of months of a year
     * @param year The year
     * @param month The month
     * @returns The total number of days in the month
     */
    public static getDaysInMonths(year : number, month : number) : number {
        let total = 0;

        for (let i = 0; i < month; i++) {
            total += DateUtils.getDaysInMonth(year, i);
        }

        return total;
    }

    /**
     * Get the total number of days in a given number of years
     * @param year The year
     * @returns the total number of days in the year
     */
    public static getDaysInYears(year : number) : number {
        let total = 0;

        for (let i = 0; i < year; i++) {
            total += DateUtils.isLeapYear(i) ? 366 : 365;
        }

        return total;
    }
}