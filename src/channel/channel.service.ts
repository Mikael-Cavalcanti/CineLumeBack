import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Supondo que você tenha um PrismaService
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChannelDto: CreateChannelDto) {
    try {
      return await this.prisma.channel.create({
        data: createChannelDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new NotFoundException('Um canal com este nome já existe.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.channel.findMany();
  }

  async findOne(id: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Canal com o ID ${id} não encontrado.`);
    }

    return channel;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    await this.findOne(id);

    try {
      return await this.prisma.channel.update({
        where: { id },
        data: updateChannelDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new NotFoundException('Um canal com este nome já existe.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.channel.delete({
      where: { id },
    });
  }
}
