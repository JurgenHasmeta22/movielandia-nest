import { IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
    @ApiProperty({
        example: "johndoe",
        description: "Username between 3-20 characters"
    })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;

    @ApiProperty({
        example: "john.doe@example.com",
        description: "Valid email address"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "Test123!@#",
        description: "Password must contain uppercase, lowercase, number/special character"
    })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Password must contain uppercase, lowercase, number/special character",
    })
    password: string;
}

export class SignInDto {
    @ApiProperty({
        example: "john.doe@example.com",
        description: "Registered email address"
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "Test123!@#",
        description: "Your password"
    })
    @IsString()
    password: string;
}

export class ForgotPasswordDto {
    @ApiProperty({
        example: "john.doe@example.com",
        description: "Email address associated with your account"
    })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        example: "a1b2c3d4e5f6g7h8i9j0",
        description: "Reset token received via email"
    })
    @IsString()
    token: string;

    @ApiProperty({
        example: "NewTest123!@#",
        description: "New password (must contain uppercase, lowercase, number/special character)"
    })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Password must contain uppercase, lowercase, number/special character",
    })
    password: string;
}

export class ActivateAccountDto {
    @ApiProperty({
        example: "a1b2c3d4e5f6g7h8i9j0",
        description: "Activation token received via email"
    })
    @IsString()
    token: string;
}

export class TokenResponse {
    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT access token"
    })
    accessToken: string;
}
