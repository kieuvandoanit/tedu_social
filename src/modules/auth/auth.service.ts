// import {generateJwtToken, randomTokenString} from '@core/utils/helpers';
import { HttpException } from '@core/exceptions';
import { isEmptyObject } from '@core/utils';
import { DataStoredInToken, TokenData, IUser} from '@modules/auth';
import LoginDto from './auth.dto';
import {UserSchema} from '@modules/users';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
class AuthService{
    public userSchema = UserSchema;

    public async login(model: LoginDto): Promise<TokenData>{
        if(isEmptyObject(model)){
            throw new HttpException(400, "Model is empty");
        }
        const user = await this.userSchema.findOne({email: model.email}).exec();

        if(!user){
            throw new HttpException(409, `Your email ${model.email} is not exist.`);
        }

        const isMatchPassword = await bcryptjs.compare(model.password, user.password);
        if(!isMatchPassword) throw new HttpException(400, 'Credential is not valid');

        return this.createToken(user)
    }

    private createToken(user:IUser):TokenData{
        const  dataInToken: DataStoredInToken = {id: user._id};
        const secret: string = process.env.JWT_TOKEN_SECRET!;
        const expiresIn: number = 60;
        return {
            token: jwt.sign(dataInToken, secret, {expiresIn: expiresIn}),
        };
    }
}

export default AuthService;