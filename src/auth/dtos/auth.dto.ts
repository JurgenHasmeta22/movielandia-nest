import { IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class SignUpDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Password must contain uppercase, lowercase, number/special character",
    })
    password: string;
}

export class SignInDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Password must contain uppercase, lowercase, number/special character",
    })
    password: string;
}

export class ActivateAccountDto {
    @IsString()
    token: string;
}

export class TokenResponse {
    accessToken: string;
}
