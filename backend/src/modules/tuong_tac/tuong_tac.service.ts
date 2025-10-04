import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TuongTacService {
  constructor(private readonly prismaService: PrismaService) { }

  async getThongBaoCurrentUser(idUser, query) {
    let da_doc_chua: boolean | undefined = undefined;

    if (query.is_read === 'true') {
      da_doc_chua = true;
    } else if (query.is_read === 'false') {
      da_doc_chua = false;
    }
    return await this.prismaService.tuong_tac.findMany({
      where: {
        id_nguoi_nhan: idUser,
        da_doc_chua
      },
      include: {
        thong_bao: true
      }
    })
  }

  async countThongBaoCurrentUser(idUser, query) {
    let da_doc_chua: boolean | undefined = undefined;

    if (query.is_read === 'true') {
      da_doc_chua = true;
    } else if (query.is_read === 'false') {
      da_doc_chua = false;
    }
    return await this.prismaService.tuong_tac.count({
      where: {
        id_nguoi_nhan: idUser,
        da_doc_chua
      }
    })
  }

  async setRead(id: number) {
    return await this.prismaService.tuong_tac.update({
      where: {
        id
      },
      data: {
        da_doc_chua: true
      }
    })
  }
}
