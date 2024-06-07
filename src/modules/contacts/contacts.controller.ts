import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException, NotFoundException, Param,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import {ContactsService} from './contacts.service';
import {Logger} from '../../services/logger.service';
import {Contact} from '@prisma/client';

@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly contactsService: ContactsService) {}

/*
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    try {
      const contact = await this.contactsService.create(createContactDto);
      this.logger.log(`Contact created successfully: ${JSON.stringify(contact)}`);
      return contact;
    } catch (error) {
      this.logger.error(`Error creating contact: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create contact');
    }
  }
*/

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,): Promise<Contact[]> {
    try {
      return await this.contactsService.findAll(limit);
    } catch (error) {
      this.logger.error(`Error fetching contacts: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch contacts');
    }
  }
  @Get(':number')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('number') number: string): Promise<Contact> {
    try {
      const contact = await this.contactsService.findOne(number);
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

  /*
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto): Promise<Contact> {
      try {
        const updatedContact = await this.contactsService.update(+id, updateContactDto);
        if (!updatedContact) {
          this.logger.warn(`Contact not found with ID: ${id}`);
          throw new NotFoundException(`Contact not found with ID: ${id}`);
        }
        this.logger.log(`Contact updated successfully: ${JSON.stringify(updatedContact)}`);
        return updatedContact;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        this.logger.error(`Error updating contact with ID ${id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException(`Failed to update contact with ID ${id}`);
      }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      try {
        const result = await this.contactsService.remove(+id);
        if (!result) {
          this.logger.warn(`Contact not found with ID: ${id}`);
          throw new NotFoundException(`Contact not found with ID: ${id}`);
        }
        this.logger.log(`Contact removed successfully with ID: ${id}`);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        this.logger.error(`Error removing contact with ID ${id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException(`Failed to remove contact with ID ${id}`);
      }
    }*/
}
