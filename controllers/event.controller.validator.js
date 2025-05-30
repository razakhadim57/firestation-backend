import Joi from "joi";

export const createSchema = Joi.object({
  fireStationId: Joi.string().required(),
  name: Joi.string().required(),
  thumbnail: Joi.string().required(),
  description: Joi.string().optional(),
  from: Joi.date().required(),
  to: Joi.date().required(),
  video: Joi.string().optional(),
  isVideoEvent: Joi.boolean().default(false),
  isApproved: Joi.boolean().default(true).required(),
  viewCount: Joi.number().default(0).required(),
  expired: Joi.boolean().default(false).optional(),
  slug: Joi.string().optional(),
}).required();
