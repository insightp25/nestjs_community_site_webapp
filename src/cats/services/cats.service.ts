import { InjectModel } from '@nestjs/mongoose';
import { CatsRepository } from '../cats.repository';
import { Injectable, UnauthorizedException, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Cat } from '../cats.schema';
import * as bcrypt from 'bcrypt';
import { CatRequestDto } from '../dto/cats.request.dto';
import { Comments } from 'src/comments/comments.schema';

@Injectable()
export class CatsService {
  constructor(
    private readonly catsRepository: CatsRepository,
    // @InjectModel(Cat.name) private readonly cats: Model<Cat>, //from stackoverflow
    // @InjectModel(Comments.name) private readonly comments: Model<Comments>, //same as above
  ) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;
    const isCatExist = await this.catsRepository.existsByEmail(email);

    if (isCatExist) {
      // throw new HttpException('해당 고양이는 이미 존재합니다.', 403); // same as code below.
      throw new UnauthorizedException('해당 고양이는 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`;
    console.log(fileName);
    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
      
    );
    console.log(newCat);
    return newCat;
  }


  async getAllCat() {
    const allCat = await this.catsRepository.findAll();
    // return allCat;
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    return readOnlyCats;
  }



}
