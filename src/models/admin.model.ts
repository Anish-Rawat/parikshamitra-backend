import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

type JWTExpiry = string | number;


const adminSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "User Name is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

adminSchema.methods.isPasswordMatch = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.generateAccessToken = function () {
  const options: SignOptions = {
    expiresIn: "2h",
  };
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    options
  );
};

adminSchema.methods.generateRefreshToken = function () {
  const options: SignOptions = {
    expiresIn: "1d",
  }
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    options
  );
};


export const Admin = mongoose.model("AdminAccount", adminSchema);
