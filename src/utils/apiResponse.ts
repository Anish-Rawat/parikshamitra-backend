import { DataInterface } from "../common/interface";

class ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: DataInterface<T> | T;
    record?:number;
    success: boolean;

    constructor(statusCode: number, message: string = "success", payload?: DataInterface<T> | T ) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;

        // Handle both paginated and direct results
        if (payload && typeof payload === "object" && "result" in payload) {
            this.data = payload as DataInterface<T>;
        } else {
            this.data = payload as T;
        }
    }
}

export default ApiResponse;
