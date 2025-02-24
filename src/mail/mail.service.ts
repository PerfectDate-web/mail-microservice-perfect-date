import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) { }

  async sendMail(mail:string[], context: object, template: string, subject: string) {
    await this.mailService.sendMail({
      to: mail.join(','), // list of receivers
      from: 'Name-APP', // override default from 
      subject: subject,
      template: template, // HTML body content 
      context: context
    });
  }
}
