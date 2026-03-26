"use client";

import { useState, useRef } from "react";
import { setUser } from "../config/config";
import { loginUser, registerUser } from "../services/auth";
import { useDispatch } from "../redux/store";
import { dispUser } from "../redux/slices/user";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthFormProps {
    onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const dispatch = useDispatch();
    const modalRef = useRef<HTMLDivElement | null>(null);

    const notifyError = (message: string) => toast.error(message);
    const notifySuccess = (message: string) => toast.success(message);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const validateForm = (): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

        if (!emailRegex.test(email)) {
            notifyError("Некоректний email");
            return false;
        }

        if (!passwordRegex.test(password)) {
            notifyError("Пароль має містити щонайменше 6 символів, хоча б одну літеру та одну цифру.");
            return false;
        }

        if (!isLogin && password !== confirmPassword) {
            notifyError("Паролі не збігаються");
            return false;
        }

        return true;
    };

    const handleLogin = async (): Promise<void> => {
        if (!validateForm()) return;

        try {
            const data = await loginUser(email, password);

            if (!data) {
                throw new Error("Невірні дані. Спробуйте ще раз.");
            }

            setUser(data);
            dispatch(dispUser(data));
            notifySuccess("З поверненням!");
            onAuthSuccess(data);
        } catch (err: any) {
            notifyError(err.message || "Сталася помилка");
            console.error("Login error", err);
        }
    };

    const handleRegister = async (): Promise<void> => {
        if (!validateForm()) return;
        try {
            const data = await registerUser({ name, email, password });
            console.log('data reg is:', data);
            setUser(data);
            dispatch(dispUser(data));
            notifySuccess("Реєстрація успішна!");
            onAuthSuccess(data);
        } catch (err: any) {
            console.error("Register error", err);
            notifyError(err.message || "Сталася помилка");
        }
    };

    return (
        <div className="mx-20">
            <div className="relative bg-white shadow-2xl overflow-hidden min-h-[500px] flex flex-col rounded-3xl" ref={modalRef}>
                <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                    <div className="absolute inset-0 rounded-3xl bg-white"></div>
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    <div
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white rounded-t-3xl">
                        <div className="flex gap-4 justify-center px-2 mb-4">
                            <button
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    isLogin
                                        ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm'
                                        : 'text-blue-100 hover:text-white hover:bg-white/20'
                                }`}
                                onClick={() => setIsLogin(true)}
                            >
                                Вхід
                            </button>
                            <button
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    !isLogin
                                        ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm'
                                        : 'text-blue-100 hover:text-white hover:bg-white/20'
                                }`}
                                onClick={() => setIsLogin(false)}
                            >
                                Реєстрація
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-center">
                            {isLogin ? 'Ласкаво просимо назад!' : 'Створіть новий акаунт'}
                        </h2>
                    </div>


                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div
                            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
                            {isLogin ? (
                                <div className="space-y-5" key="login">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Введіть ваш email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Пароль
                                            </label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Введіть ваш пароль"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Показати пароль</span>
                                    </label>

                                    <button
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={handleLogin}
                                    >
                                        Увійти
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-5" key="register">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ім'я
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ім'я"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Введіть ваш email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Пароль
                                            </label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Створіть пароль"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Підтвердження пароля
                                            </label>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Підтвердіть пароль"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">Показати пароль</span>
                                    </label>

                                    <button
                                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
                                        onClick={handleRegister}
                                    >
                                        Зареєструватися
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 mt-auto rounded-b-3xl">
                        <p className="text-center text-xs text-gray-500">
                            {isLogin
                                ? "Немає акаунту? "
                                : "Вже маєте акаунт? "
                            }
                            <button
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Зареєструватися" : "Увійти"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default AuthModal;
