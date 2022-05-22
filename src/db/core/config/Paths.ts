export default class Paths {

    static SQL_SCRIPTS = "sql/";

    static AUTH_CREATE_TABLES = this.SQL_SCRIPTS + "auth.sql";
    static USER_CREATE_TABLES = this.SQL_SCRIPTS + "user.sql";

    static TEST_PREPARE_USER_DB = this.SQL_SCRIPTS + "test-user.sql";
    static TEST_PREPARE_AUTH_DB = this.SQL_SCRIPTS + "test.sql";

    static DATABASE_STORAGE = "db/";
    static DATABASE_EXTENSION = ".db";
    
}