const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const authMiddleware = require("../middleware/AuthMiddleware");
const JobCategory = require("../models/JobCategoryModel");
const Application = require("../models/ApplicationModel");
const Job = require("../models/JobModel");
const JobLocation = require("../models/JobLocationModel");
const path = require("path");
const mongoose = require("mongoose");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/pdf/:filename", authMiddleware, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads", filename);
  res.sendFile(filePath);
});

router.get("/get-categories", authMiddleware, async (req, res) => {
  try {
    const { filter } = req.query;

    let aggregationPipeline = [];

    if (filter) {
      aggregationPipeline.push({
        $match: { name: { $regex: new RegExp(filter, "i") } },
      });
    }

    aggregationPipeline.push({
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "category_id",
        as: "applications",
      },
    });

    aggregationPipeline.push({
      $project: {
        category: "$name",
        applicationCount: { $size: "$applications" },
      },
    });

    const jobCategories = await JobCategory.aggregate(aggregationPipeline);

    res.json(jobCategories);
  } catch (error) {
    console.error("Error occurred while fetching job categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-category-application/:categoryId?", authMiddleware, async (req, res) => {
    const { page } = req.query;
    const { categoryId } = req.params;
    const perPage = 8;

    let pipeline = [];

    try {
      
      if (categoryId !== "") {
        pipeline.push({
          $match: { category_id: new mongoose.Types.ObjectId(categoryId) },
        })
      }

      pipeline.push({
        $sort: { createdAt: -1 }
      });
  
      pipeline.push({
        $facet: {
          data: [
            { $skip: perPage * (Number(page) - 1) },
            { $limit: perPage },
          ],
          pageInfo: [
            { $group: { _id: null, totalCount: { $sum: 1 } } },
            {
              $addFields: {
                totalPages: {
                  $ceil: { $divide: ["$totalCount", perPage] },
                },
                currentPage: Number(page),
                _id: 0,
              },
            },
          ],
        },
      })

      const applications = await Application.aggregate(pipeline);

      res.json(applications[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/get-application/:applicationId",
  authMiddleware,
  async (req, res) => {
    try {
      const applicationId = req.params.applicationId;

      const applications = await Application.findById(applicationId);

      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post("/add-job", authMiddleware, async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await Job.create(jobData);
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Edit Job API
router.put("/edit-job/:jobId", authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updatedData = req.body;

    // Find the job by ID and update its data
    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedData, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error editing job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Job API
router.delete("/delete-job/:jobId", authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Find the job by ID and delete it
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all job
router.get("/get-jobs", authMiddleware, async (req, res) => {
  const { category, location, page } = req.query;

  const perPage = 8;

  const pipeline = [];

  try {
    if (category !== "") {
      pipeline.push({ $match: {category_id: new mongoose.Types.ObjectId(category)} });
    }

    if (location !== "") {
      pipeline.push({ $match: {category_id: new mongoose.Types.ObjectId(category)} });
    }

    pipeline.push({
      $lookup: {
        from: "job_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_id",
      },
    });

    pipeline.push({
      $lookup: {
        from: "job_locations",
        localField: "job_location_id",
        foreignField: "_id",
        as: "job_location_id",
      },
    });

    pipeline.push({
      $unwind: "$job_location_id"
    });

    pipeline.push({
      $unwind: "$category_id"
    });

    pipeline.push({
      $sort: { createdAt: -1 }
    });

    pipeline.push({
      $facet: {
        data: [
          { $skip: perPage * (Number(page) - 1) },
          { $limit: perPage },
        ],
        pageInfo: [
          { $group: { _id: null, totalCount: { $sum: 1 } } },
          {
            $addFields: {
              totalPages: {
                $ceil: { $divide: ["$totalCount", perPage] },
              },
              currentPage: Number(page),
              _id: 0,
            },
          },
        ],
      },
    })

    const jobs = await Job.aggregate(pipeline);
    res.json(jobs[0]);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get specific job
router.get("/get-job/:jobId", authMiddleware, async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    res.json(job);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all job locations
router.get("/jobs-locations", authMiddleware, async (req, res) => {
  try {
    const jobLocations = await JobLocation.find({});

    res.json(jobLocations);
  } catch (error) {
    console.error("Error fetching job location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get all job categories
router.get("/jobs-categories", authMiddleware, async (req, res) => {
  try {
    const jobCategories = await JobCategory.find({});

    res.json(jobCategories);
  } catch (error) {
    console.error("Error fetching job categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/application/:jobId", authMiddleware, async (req, res) => {
  const jobId = req.params.jobId;
  const { gender, salary, notice, state, education, page = 1 } = req.query;

  let pipeline = [];
  const perPage = 8;
  try {
    pipeline.push({
      $match: { job_id: new mongoose.Types.ObjectId(jobId) }
    });

    if (gender !== "") {
      pipeline.push({
        $match: { gender }
      });
    }

    if (salary !== "") {
      if (salary === "1to3") {
        pipeline.push({ $match: { expected_ctc: { $gte: 100000, $lte: 300000 } } });
      } else if (salary === "3to5") {
        pipeline.push({ $match: { expected_ctc: { $gt: 300000, $lte: 500000 } } });
      } else if (salary === "5to7") {
        pipeline.push({ $match: { expected_ctc: { $gt: 500000, $lte: 700000 } } });
      } else if (salary === "more") {
        pipeline.push({ $match: { expected_ctc: { $gt: 700000 } } });
      }
    }

    if (notice !== "") {
      if (notice === "1to90") {
        pipeline.push({ $match: { notice_period: { $gte: 1, $lte: 90 } } });
      } else if (notice === "90to180") {
        pipeline.push({ $match: { notice_period: { $gt: 90, $lte: 180 } } });
      } else if (notice === "more") {
        pipeline.push({ $match: { notice_period: { $gt: 180 } } });
      }
    }

    if (state !== "") {
      pipeline.push({
        $match: { state }
      });
    }

    if (education !== "") {
      pipeline.push({
        $match: { education: { $regex: education, $options: "i"} }
      });
    }

    pipeline.push({
      $lookup: {
        from: "jobs",
        localField: "job_id",
        foreignField: "_id",
        as: "job_id"
      }
    });

    pipeline.push({
      $lookup: {
        from: "job_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_id"
      }
    });

    pipeline.push({
      $unwind: "$job_id"
    });

    pipeline.push({
      $unwind: "$category_id"
    });

    pipeline.push({
      $sort: { createdAt: -1 }
    });

    pipeline.push({
      $facet: {
        data: [
          { $skip: perPage * (Number(page) - 1) },
          { $limit: perPage },
        ],
        pageInfo: [
          { $group: { _id: null, totalCount: { $sum: 1 } } },
          {
            $addFields: {
              totalPages: {
                $ceil: { $divide: ["$totalCount", perPage] },
              },
              currentPage: Number(page),
              _id: 0,
            },
          },
        ],
      },
    })

    const application = await Application.aggregate(pipeline);
    
    res.json(application[0]);
  } catch (error) {
    console.error("Error fetching application based on jobId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-applications", authMiddleware, async (req, res) => {
  const { gender, salary, notice, state, education, page } = req.query;

  let pipeline = [];
  const perPage = 8;
  try {

    if (gender !== "") {
      pipeline.push({
        $match: { gender }
      });
      // Add gender filter to the query
      // applicationQuery.gender = gender;
    }

    if (salary !== "") {
      if (salary === "1to3") {
        pipeline.push({ $match: { expected_ctc: { $gte: 100000, $lte: 300000 } } });
      } else if (salary === "3to5") {
        pipeline.push({ $match: { expected_ctc: { $gt: 300000, $lte: 500000 } } });
      } else if (salary === "5to7") {
        pipeline.push({ $match: { expected_ctc: { $gt: 500000, $lte: 700000 } } });
      } else if (salary === "more") {
        pipeline.push({ $match: { expected_ctc: { $gt: 700000 } } });
      }
    }

    if (notice !== "") {
      if (notice === "1to90") {
        pipeline.push({ $match: { notice_period: { $gte: 1, $lte: 90 } } });
      } else if (notice === "90to180") {
        pipeline.push({ $match: { notice_period: { $gt: 90, $lte: 180 } } });
      } else if (notice === "more") {
        pipeline.push({ $match: { notice_period: { $gt: 180 } } });
      }
    }

    if (state !== "") {
      pipeline.push({
        $match: { state }
      });
    }

    if (education !== "") {
      pipeline.push({
        $match: { education: { $regex: education, $options: "i"} }
      });
    }

    pipeline.push({
      $lookup: {
        from: "jobs",
        localField: "job_id",
        foreignField: "_id",
        as: "job_id"
      }
    });

    pipeline.push({
      $lookup: {
        from: "job_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category_id"
      }
    });

    pipeline.push({
      $unwind: "$job_id"
    });

    pipeline.push({
      $unwind: "$category_id"
    });


    pipeline.push({
      $sort: { createdAt: -1 }
    });

    pipeline.push({
      $facet: {
        data: [
          { $skip: perPage * (Number(page) - 1) },
          { $limit: perPage },
        ],
        pageInfo: [
          { $group: { _id: null, totalCount: { $sum: 1 } } },
          {
            $addFields: {
              totalPages: {
                $ceil: { $divide: ["$totalCount", perPage] },
              },
              currentPage: Number(page),
              _id: 0,
            },
          },
        ],
      },
    })

    const applications = await Application.aggregate(pipeline);
      
    res.json(applications[0]);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
