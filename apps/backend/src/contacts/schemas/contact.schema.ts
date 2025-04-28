import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, PaginateModel } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop()
  position: string;

  @Prop()
  organization: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  wikipediaUrl: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  notes: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  contactPerson: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
  };
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
// Apply pagination plugin at schema
ContactSchema.plugin((mongoosePaginate as any).default || mongoosePaginate);
// Add text index for search
ContactSchema.index({
  name: 'text',
  tags: 'text',
  organization: 'text',
  notes: 'text',
  'contactPerson.name': 'text',
});
