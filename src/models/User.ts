import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true, // aqui estava "require", corrigi
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// hash da senha antes de salvar
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

class User {
  body: { email: string; password: string };
  errors: string[];
  user: IUser | null;

  constructor(body: any) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register(): Promise<void> {
    await this.validate();

    await this.userExists();

    if (this.errors.length > 0) return;

    this.user = await UserModel.create(this.body);
  }

  async login(): Promise<void> {
    await this.validate();

    if (this.errors.length > 0) return;

    this.user = await UserModel.findOne({ email: this.body.email }).select(
      '+password'
    );

    if (!this.user) {
      this.errors.push('Usuário ou senha inválidos');
      return;
    }

    const isValid = await bcrypt.compare(this.body.password, this.user.password);

    if (!isValid) {
      this.errors.push('Usuário ou senha inválidos');
      this.user = null;
    }
  }

  async validate(): Promise<void> {
    this.cleanUp();

    if (!validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido.');
    }

    if (
      this.body.password.length < 6 ||
      this.body.password.length > 50
    ) {
      this.errors.push('A senha precisa ter entre 6 e 50 caracteres.');
    }
  }

  async userExists(): Promise<void> {
    const existingUser = await UserModel.findOne({ email: this.body.email });
    if (existingUser) {
      this.errors.push(
        'Email já cadastrado. Faça login, ou tente com outro email.'
      );
    }
  }

  cleanUp(): void {
    for (const key in this.body) {
      if (typeof this.body[key as keyof typeof this.body] !== 'string') {
        (this.body as any)[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

export default User;
export { IUser, UserModel };
