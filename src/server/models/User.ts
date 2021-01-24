import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserModel extends Document {
  date: string
  userId: string
}

const UserSchema = new Schema({
  name: String,
  position: String,
})

const model: Model<IUserModel> =
  mongoose.models.User || mongoose.model<IUserModel>('User', UserSchema)

export default model
