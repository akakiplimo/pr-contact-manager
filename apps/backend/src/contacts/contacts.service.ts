import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

// Define a local custom type to replace PaginationResult
type PaginateResult<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
};

// Define the paginated model interface
interface PaginateModel<T> extends Model<T> {
  paginate(
    query: any,
    options: {
      page?: number;
      limit?: number;
      sort?: any;
    },
  ): Promise<PaginateResult<T>>;
}

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private contactModel: Model<ContactDocument> &
      PaginateModel<ContactDocument>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const createdContact = new this.contactModel(createContactDto);
    return await createdContact.save();
  }

  async findAll(
    page = 1,
    limit = 10,
    searchTerm?: string,
    tags?: string[],
    organizationFilter?: string,
  ): Promise<any> {
    const query: any = {};

    if (searchTerm) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.$text = { $search: searchTerm };
    }

    if (tags && tags.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.tags = { $in: tags };
    }

    if (organizationFilter) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      query.organization = organizationFilter;
    }

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };

    return this.contactModel.paginate(query, options);
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    return contact;
  }

  async update(
    id: string,
    updateContactDto: CreateContactDto,
  ): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, updateContactDto, { new: true })
      .exec();

    if (!updatedContact) {
      throw new Error(`Contact with id ${id} not found`);
    }

    return updatedContact;
  }

  async remove(id: string): Promise<Contact> {
    const deletedContact = await this.contactModel.findByIdAndDelete(id).exec();
    if (!deletedContact) {
      throw new Error(`Contact with id ${id} not found`);
    }
    return deletedContact;
  }

  async exportToExcel(): Promise<Contact[]> {
    // In a real implementation, you'd format the data for Excel export
    // For the prototype, we'll just return all contacts
    return this.contactModel.find().exec();
  }

  async getAllTags(): Promise<string[]> {
    return this.contactModel.distinct('tags').exec();
  }

  async getAllOrganizations(): Promise<string[]> {
    return this.contactModel.distinct('organization').exec();
  }
}
