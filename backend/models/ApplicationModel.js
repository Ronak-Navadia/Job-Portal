const mongoose = require('mongoose');
const Job = require('./JobModel');
const JobCategory = require('./JobCategoryModel');

const ApplicationSchema = new mongoose.Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Job
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: JobCategory
  },
  first_name: String,
  last_name: String,
  email: String,
  pan_number: String,
  mobile_number: Number,
  education: String,
  ctc: Number,
  expected_ctc: Number,
  notice_period: Number,
  total_work_experience: Number,
  gender: String,
  state: String,
  resume_file: String
},
{ timestamps: { createdAt: true, updatedAt: false } }
);

const Application = mongoose.model('applications', ApplicationSchema);

module.exports = Application;