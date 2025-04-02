import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactPersonDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  relationship: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;
}

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  organization: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  wikipediaUrl: string;

  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString()
  @IsOptional()
  notes: string;

  @ValidateNested()
  @Type(() => ContactPersonDto)
  @IsOptional()
  contactPerson?: ContactPersonDto;
}
