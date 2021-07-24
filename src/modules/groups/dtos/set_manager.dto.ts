import { IsNotEmpty } from "class-validator";

export default class SetManagerDto{
    @IsNotEmpty()
    public userId: string | undefined;
    @IsNotEmpty()
    public role: string | undefined;
}