import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { SearchTexts } from 'models/TimeTrack/req-bodies/TTGetAllParams'
import Model from 'models/common/Model'

export default class GetTrackerHoursReqBody extends Model {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateAfter: Date | undefined

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateBefore: Date | undefined

  @IsOptional()
  @IsString({ each: true })
  userIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  clientIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  projectIds?: string[]

  @IsOptional()
  @IsString({ each: true })
  partnerNames?: string[]

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => SearchTexts)
  searchTexts?: SearchTexts

  @IsArray()
  @IsOptional()
  billableValues: boolean[] | undefined

  @IsBoolean()
  isMe: boolean
}
