export enum ActivityType {
    QUEUE_ASSIGNED = 'QUEUE_ASSIGNED',
    APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
    APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
    STAFF_CREATED = 'STAFF_CREATED',
    STAFF_AVAILABILITY_CHANGED = 'STAFF_AVAILABILITY_CHANGED'
}

export interface IActivity {
    id: string;
    type: ActivityType;
    message: string;
    metadata?: any;
    createdAt: Date;
}

export interface ICreateActivity {
    type: ActivityType;
    message: string;
    metadata?: any;
}
