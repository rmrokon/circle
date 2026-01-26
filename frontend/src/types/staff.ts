import { IServiceType } from "./service-types";

export enum StaffAvailablityStatus {
    available = 'available',
    onLeave = 'onLeave',
}

export interface IStaff {
    id: string;
    name: string;
    dailyCapacity: number;
    available: StaffAvailablityStatus;
    serviceTypeId: string;
    createdAt: Date;
    updatedAt: Date;
    serviceTypes: IServiceType[];
}