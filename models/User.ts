import mongoose, { model, Model, Schema} from 'mongoose'
import { IUser } from '../interfaces';

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: {
      type: String, 
      enum: {
        values: ['admin', 'client', 'super-user', 'SEO'],
        message: '{VALUE} no es un rol válido'
      },
      default: 'client'
    },
}, { timestamps: true ,collection: 'users' });

const UserModel: Model<IUser> = mongoose.models.User || model('User', UserSchema);

export default UserModel;