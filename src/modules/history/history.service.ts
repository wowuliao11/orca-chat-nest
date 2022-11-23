import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { History, HistoryDocument } from './schemas/history.schema';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<HistoryDocument>,
  ) {}

  create(createHistoryDto: CreateHistoryDto) {
    return this.historyModel.create(createHistoryDto);
  }

  findAll() {
    return `This action returns all history`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }

  /**
   * Get histories by room id
   */
  findHistoryByRoomId(roomId: ObjectId, { limit } = { limit: 10 }) {
    return this.historyModel
      .find({ room: roomId })
      .sort('-createdAt')
      .limit(limit)
      .populate('from')
      .then((data) => data.reverse());
  }
}
