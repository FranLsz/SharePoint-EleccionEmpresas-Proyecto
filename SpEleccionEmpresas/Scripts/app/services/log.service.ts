
export class LogService {

    public static lines: any[] = [];

    // Log
    public static log(data: any) {
        console.log(data);
        LogService.lines.push(data);
    }

    // Info
    public static info(data: any) {
        console.info(data);
        LogService.lines.push(data);
    }

    // Warn
    public static warn(data: any) {
        console.warn(data);
        LogService.lines.push(data);
    }

    // Error
    public static error(data: any) {
        console.error(data);
        LogService.lines.push(data);
    }

    // Clear log
    public static clear() {
        console.clear();
    }
}
