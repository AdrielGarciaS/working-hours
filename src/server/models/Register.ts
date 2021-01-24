import mongoose, { Schema, Document, Model } from 'mongoose'

interface IRegisterModel extends Document {
  date: string
  userId: string
}

const RegisterSchema = new Schema({
  date: Date,
  userId: String,
})

const model: Model<IRegisterModel> =
  mongoose.models.Register ||
  mongoose.model<IRegisterModel>('Register', RegisterSchema)

export default model
