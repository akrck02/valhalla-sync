export default class DateUtils {
    
    static DATE_FORMAT = {
        STANDARD : "yyyy/MM/dd",
        EUROPE :  "dd/MM/yyyy",
        SQLITE : "yyyy-MM-dd"
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

        return result;    
    }

        /**
     * Add zeros to a given number to match a length
     * @param number The number to normalize
     * @param digits The number of digits to match
     * @returns The normalized number
     */
         public static normalize(number: number, digits: number): string {

            let result = "";
            let missing = digits - (number + "").length;
    
            for (let i = 0; i < missing; i++) {
                const character = [i];
    
                if (character)
                    result += character;
                else
                    result += "0"
            }
            result += number;
    
            return result;
        }
    


}