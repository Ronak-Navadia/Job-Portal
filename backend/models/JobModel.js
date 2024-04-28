const mongoose = require('mongoose');
const JobCategory = require('./JobCategoryModel');
const JobLocation = require('./JobLocationModel');
const mongoosePaginate = require('mongoose-paginate-v2');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  education_description: String,
  knowledge_description: String,
  company_name: String,
  company_description: String,
  company_website: String,
  company_email: String,
  category_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: JobCategory
  }, 
  job_location_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: JobLocation
  },
  vacancy: Number,
  nature: String,
},
{ timestamps: { createdAt: true, updatedAt: false } }
);

jobSchema.plugin(mongoosePaginate);

const Job = mongoose.model('jobs', jobSchema);

module.exports = Job;
