import { Schema, model, models, type InferSchemaType } from 'mongoose';

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    project: { type: String, required: false, trim: true, maxlength: 160, default: '' },
    message: { type: String, required: false, trim: true, maxlength: 4000, default: '' },
    status: {
      type: String,
      enum: ['received', 'emailed', 'failed'],
      default: 'received',
    },
    ownerEmailId: { type: String, default: null },
    senderEmailId: { type: String, default: null },
    errorMessage: { type: String, default: null },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    source: { type: String, default: 'portfolio-contact-form' },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ email: 1, createdAt: -1 });

export type ContactMessage = InferSchemaType<typeof contactMessageSchema>;

const ContactMessageModel =
  models.ContactMessage || model('ContactMessage', contactMessageSchema);

export default ContactMessageModel;
