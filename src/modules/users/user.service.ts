import { BadRequestError, InternalServerError } from '../../shared/errors';
import logger from "../../shared/logger";
import { runInTransaction } from '../../shared/transaction';
import { findOrCreateUser as findOrCreateUserRepo, getUserById as getUserByIdRepo } from "./user.repository";


export const findOrCreateUser = async (username: string) => {   
    
    const trimmedUsername = username?.trim().toLowerCase();

    if (!trimmedUsername) throw new BadRequestError("Username is required");
    if (trimmedUsername.length < 3) throw new BadRequestError("Username must be at least 3 characters");
    if (trimmedUsername.length > 20) throw new BadRequestError("Username must be no more than 20 characters");

    return runInTransaction(async (client) => {
        try {
            return await findOrCreateUserRepo(trimmedUsername.toLowerCase(), client);
        } catch (error) {
            logger.error("UserService.findOrCreateUser failed", error);
            throw new Error("Failed to create user");  
        }
    });
    
}
export const getUserById = async (userId: string) => {
    if (!userId) throw new BadRequestError("User ID is required");
    try {
        const user = await getUserByIdRepo(userId);
        return user;
    } catch (error) {
        logger.error("UserService.getUserById failed", error);
        throw new InternalServerError("Failed to fetch user");
    }
};