import Joi from 'joi';

const customAddressSchema = Joi.object({
  formattedAddress: Joi.string().allow(null, ''),
  city: Joi.string().allow(null, ''),
  plz: Joi.string().allow(null, ''),
  country: Joi.string().allow(null, ''),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

export const createSchema = Joi.object({
  title: Joi.string().required(),
  thumbnail: Joi.string().required(),
  banner: Joi.string().allow(null, ''),
  fireStation: Joi.string().required(),  // changed here
  video: Joi.string(),
  isVideoJob: Joi.boolean().default(false),
  about: Joi.string().allow(null, ''),
  category: Joi.array().items(Joi.string().required()).required(),
  email: Joi.string().required().email(),
  phone: Joi.string().required(),
  address: customAddressSchema.required(),
  viewCount: Joi.number().default(0).required(),
  isApproved: Joi.boolean().default(true).required(),
  type: Joi.string().allow(null, ''),
  expired: Joi.boolean().default(false),
  jobApplications: Joi.array().items(Joi.string()),
}).required();

export const searchSchema = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
}).required();
