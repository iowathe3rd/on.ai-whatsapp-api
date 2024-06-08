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
import {ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';

@Controller('contacts')
@ApiTags("Contacts")
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);
  constructor(private readonly contactsService: ContactsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all contacts', description: 'Retrieves all contacts from the server' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Limit the number of contacts returned' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all contacts', isArray: true })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch contacts' })
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
  @ApiOperation({ summary: 'Get contact by number', description: 'Retrieves a contact by its number' })
  @ApiParam({ name: 'number', type: String, description: 'Contact number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the contact'})
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch contact' })
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
}
