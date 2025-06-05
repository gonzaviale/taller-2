export interface UserDTO {
    id?: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}