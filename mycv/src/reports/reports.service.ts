import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportRepository.create(reportDto);
    report.user = user;

    return this.reportRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepository.findOne(id);

    if (!report) throw new NotFoundException('report not found');

    report.approved = approved;

    return this.reportRepository.save(report);
  }
}
