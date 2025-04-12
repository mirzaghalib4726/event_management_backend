import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto) {
    const { email, name, password, type } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (password will be hashed in @BeforeCreate)
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, type: user.type };
    const access_token = this.jwtService.sign(payload);

    return { user };
  }

  async login(
    loginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.dataValues.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessPayload = {
      sub: user.dataValues.id,
      email: user.dataValues.email,
      type: user.dataValues.type,
    };
    const access_token = this.jwtService.sign(accessPayload, {
      expiresIn: '1h',
    });

    const refreshPayload = { sub: user.dataValues.id };
    const refresh_token = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    const hashed_refresh_token = await bcrypt.hash(refresh_token, 10);
    await this.userModel.update(
      { refresh_token: hashed_refresh_token },
      { where: { id: user.dataValues.id } },
    );

    return { access_token, refresh_token };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userModel.findByPk(payload.sub);

      if (!user || !user.dataValues.refresh_token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.dataValues.refresh_token,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const access_token = this.jwtService.sign(
        {
          sub: user.dataValues.id,
          email: user.dataValues.email,
          type: user.dataValues.type,
        },
        { expiresIn: '1h' },
      );

      const new_refresh_token = this.jwtService.sign(
        { sub: user.dataValues.id },
        { expiresIn: '7d' },
      );

      const hashed_refresh_token = await bcrypt.hash(new_refresh_token, 10);
      await this.userModel.update(
        { refresh_token: hashed_refresh_token },
        { where: { id: user.dataValues.id } },
      );

      return { access_token, refresh_token: new_refresh_token };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userModel.findByPk(userId);
    if (user && user.refresh_token) {
      user.refresh_token = undefined;
      await user.save();
    }
  }
}
