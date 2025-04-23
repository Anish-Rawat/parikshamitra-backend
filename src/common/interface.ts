export interface DataInterface<T>{
    limit?:number;
    page?:number;
    totalRecords?:number;
    result:T|null;
}