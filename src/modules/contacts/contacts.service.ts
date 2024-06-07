import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {Contact} from "@prisma/client";
import prisma from "../../lib/db";
import {Logger} from "../../services/logger.service";

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);
  async findAll(limit: number): Promise<Contact[]> {
    try {
      return await prisma.contact.findMany({
        take: limit,
      });
    } catch (error) {
      this.logger.error(`Error fetching contacts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch contacts');
    }
  }
  async findOne(number: string): Promise<Contact> {
    try {
      const contact = await prisma.contact.findUnique({
        where: {
          phoneNumber: number
        },
      });
      if (!contact) {
        this.logger.warn(`Contact not found with ID: ${number}`);
        throw new NotFoundException(`Contact not found with ID: ${number}`);
      }
      return contact;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching contact with ID ${number}: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Failed to fetch contact with ID ${number}`);
    }
  }
}
