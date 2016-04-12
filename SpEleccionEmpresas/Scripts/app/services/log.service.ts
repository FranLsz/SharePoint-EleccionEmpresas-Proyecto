
export class LogService {

    // Log
    public static log(data: any) {
        console.log(data);
    }

    // Info
    public static info(data: any) {
        console.info(data);
    }

    // Warn
    public static warn(data: any) {
        console.warn(data);
    }

    // Error
    public static error(data: any) {
        console.error(data);
    }

    // Clear log
    public static clear() {
        console.clear();;
    }

}
