import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Invalid password"),
});

const signUpSchema = z.object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Invalid password"),
});

type SignInData = z.infer<typeof signInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signOut } = useAuthActions();
    const router = useRouter();

    const signInForm = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const signUpForm = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    const handleSignIn = async (data: SignInData) => {
        setIsLoading(true);
        try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                flow: "login",
            });
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            signInForm.setError("password", {
                message: "Invalid email or password",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (data: SignUpData) => {
        setIsLoading(true);
        try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                name: `${data.firstname} ${data.lastname}`,
                flow: "sign-up",
            });
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            signUpForm.setError("root", {
                message: "Failed to create account. Email may already be in use.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut();
            router.push("/auth/login");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signInForm,
        signUpForm,
        handleSignIn,
        handleSignUp,
        handleSignOut,
        isLoading,
    };
};
