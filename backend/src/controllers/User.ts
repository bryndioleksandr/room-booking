import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt, {VerifyErrors} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, Request } from 'express';
import {MeetingRoom} from "../models/MeetingRoom";

dotenv.config();

interface JwtPayload {
    id: number;
    email: string;
}

const createAccessToken = (user: JwtPayload) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15m'})
}

const createRefreshToken = (user: JwtPayload) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '7d'})
}

export const userRegister = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({where: { email } });
        if (userExists) return res.json({ msg: "This email is already in use" });

        const salt = await bcrypt.genSalt(10);
        const hashPw = await bcrypt.hash(password, salt);


        const newUser = await User.create({
            name,
            email,
            password: hashPw,
        });

        const accessToken = createAccessToken({ id: newUser.id, email: newUser.email });
        const refreshToken = createRefreshToken({ id: newUser.id, email: newUser.email });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure:false, sameSite: 'lax' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:false, sameSite: 'lax' });

        return res.status(201).json({
            message: "Registration successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            accessToken,
            refreshToken
        });

    } catch (err:any) {
        return res.status(500).json({ msg: err.message });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({where: { email } });
        if (!user) return res.status(404).json({msg: "User not found"});

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) return res.status(401).json({msg: "Password is invalid"});

        const accessToken = createAccessToken({ id: user.id, email: user.email });
        const refreshToken = createRefreshToken({ id: user.id, email: user.email });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure:false, sameSite: 'lax' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:false, sameSite: 'lax' });

        return res.status(201).json({
            message: "Logged in successfully",
            user: { id: user.id, name: user.name, email: user.email },
            accessToken,
            refreshToken
        });
    }
    catch(err:any){
        return res.status(500).json({ msg: err.message });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Error during refresh token" });
        }

        // @ts-ignore
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: VerifyErrors | null, decoded: JwtPayload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Refresh token is expired" });
                }
                return res.status(401).json({ message: "Invalid refresh token" });
            }

            const userId = decoded.id;
            const email = decoded.email;

            const newAccessToken = jwt.sign(
                { id: userId, email },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '15m' }
            );

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });

            return res.status(200).json({ msg: 'Token updated successful' });
        });

    } catch (error) {
        console.error('Error checking or updating token:', error);
        return res.status(500).json({ msg: 'server error during updating token' });
    }
};

export const userLogout = async (res: Response) => {
    try {
        res.clearCookie('accessToken', {sameSite: "none", secure: true});
        res.clearCookie('refreshToken', {sameSite: "none", secure: true});
        res.status(200).json({ msg: 'Logout completed' });
    } catch (err:any) {
        return res.status(500).json({msg: err.message})
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ msg: error.message || "Server error" });
    }
};




