import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import FormControl from "../../../shared/FormControl";
import {
  getAllCategories,
  getAllLocations,
  getSpecificJob,
  updateJob,
} from "../api";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { AxiosError } from "axios";
import Loader from "../../../shared/Loader";
import { createJobSchema } from "../validation";
import FormError from "../../../shared/FormError";
import clsx from "clsx";
import FormLabel from "../../../../src/components/FormLabel";

const UpdateJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [categorySelect, setCategorySelect] = useState({
    value: "",
    label: "Any - All Categories",
  });
  const [locationSelect, setLocationSelect] = useState({
    value: "",
    label: "Any - All Locations",
  });

  const { data: jobData, isLoading: jobDataIsLoading } = useQuery({
    queryKey: ["get-specific-job"],
    queryFn: () => getSpecificJob(jobId),
  });

  const { mutate: updateJobFn } = useMutation(
    (data) => updateJob(jobId, data),
    {
      onSuccess: () => {
        navigate("/admin/job-list");
        toast.success("Job Edited Successfully.");
        // refetch();
      },
      onError: (error: AxiosError<{ message: string }>) => {
        toast(error.response?.data.message, {
          type: "error",
        });
      },
    }
  );

  const { data: jobCategoryData, isLoading: jobCategoryDataIsLoading } =
    useQuery(["job-category-list"], () => getAllCategories());

  const jobCategoryOptions =
    jobCategoryData?.map((category: any) => ({
      value: category._id,
      label: category.name,
    })) || [];

  const { data: jobLocationData, isLoading: jobLocationDataIsLoading } =
    useQuery(["job-location-list"], () => getAllLocations());

  const jobLocationOptions =
    jobLocationData?.map((location: any) => ({
      value: location._id,
      label: location.name,
    })) || [];

  const { handleSubmit, values, errors, handleChange, setFieldValue } = useFormik({
    initialValues: {
      title: jobData?.title,
      description: jobData?.description,
      education_description: jobData?.education_description,
      knowledge_description: jobData?.knowledge_description,
      job_location_id: jobData?.job_location_id,
      category_id: jobData?.category_id,
      vacancy: jobData?.vacancy,
      nature: jobData?.nature,
      company_name: jobData?.company_name,
      company_description: jobData?.company_description,
      company_website: jobData?.company_website,
      company_email: jobData?.company_email,
      // locationSelect: jobData?.locationSelect,
      // categorySelect: jobData?.categorySelect,
    },
    validateOnChange: false,
    validationSchema: createJobSchema,
    onSubmit: async (values: any) => {
      values["category_id"] = categorySelect.value;
      values["job_location_id"] = locationSelect.value;
      updateJobFn(values);
    },
  });

  const handleCategoryChange = (event: any) => {
    setCategorySelect(event);
  };

  const handleLocationChange = (event: any) => {
    setLocationSelect(event);
  };

  // const handleSelectOnChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setFieldValue(name, Number(value));
  // };

  const handleOnChangeEvent = (event: any) => {
    const value = event?.target.value.replace(/[^\d]/g, '');
    setFieldValue(event?.target.name, value.slice(0, 10));

    // setFieldValue(event?.target.name, Number(event.target.value));
  };

  useEffect(() => {
    if (jobData) {
      // Update form values with data fetched from the API
      setFieldValue("title", jobData.title);
      setFieldValue("description", jobData.description);
      setFieldValue("education_description", jobData.education_description);
      setFieldValue("knowledge_description", jobData.knowledge_description);
      setFieldValue("job_location_id", jobData.job_location_id);
      setFieldValue("category_id", jobData.category_id);
      setFieldValue("vacancy", jobData.vacancy);
      setFieldValue("nature", jobData.nature);
      setFieldValue("company_name", jobData.company_name);
      setFieldValue("company_description", jobData.company_description);
      setFieldValue("company_website", jobData.company_website);
      setFieldValue("company_email", jobData.company_email);
      // setFieldValue("locationSelect", jobData.locationSelect);
      // setFieldValue("categorySelect", jobData.categorySelect);

      const categoryLabel = jobCategoryData?.find(
        (category: any) => category._id === jobData.category_id
      );
      const locationLabel = jobLocationData?.find(
        (location: any) => location._id === jobData.job_location_id
      );

      setCategorySelect({
        value: jobData.category_id,
        label: categoryLabel?.name,
      });
      setLocationSelect({
        value: jobData.job_location_id,
        label: locationLabel?.name,
      });
    }
  }, [jobData, jobCategoryData, setFieldValue, jobLocationData]);

  if (
    jobCategoryDataIsLoading ||
    jobLocationDataIsLoading ||
    jobDataIsLoading
  ) {
    return (
      <div className="py-4 banner-height d-flex justify-content-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="app-content pt-3 p-md-3 p-lg-4">
        <div className="container-xl">
          <div className="row g-3 mb-4 align-items-center justify-content-between">
            <div className="col-auto">
              <h1 className="app-page-title mb-0">Edit Jobs</h1>
            </div>
          </div>
          <div className="g-4 mb-4">
            <form className="row" onSubmit={handleSubmit}>
              <div className="col-12 mb-3">
                <FormLabel name="Enter Job Title" htmlFor="title" />
                <FormControl
                  className={errors.title ? "is-error" : ""}
                  type="text"
                  id="title"
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  placeholder="Enter Job Title"
                />
                 <FormError error={errors.title} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel name="Enter Job Description" htmlFor="description" />
                <textarea
                  className={clsx(
                    errors.description ? "is-error" : "",
                    "form-control"
                  )}
                  id="description"
                  name="description"
                  onChange={handleChange}
                  value={values.description}
                  placeholder="Enter Job Description"
                ></textarea>
                <FormError error={errors.description} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Required Knowledge, Skills, and Abilities"
                  htmlFor="knowledge_description"
                />
                <textarea
                   className={clsx(
                    errors.knowledge_description ? "is-error" : "",
                    "form-control"
                  )}
                  id="knowledge_description"
                  name="knowledge_description"
                  value={values.knowledge_description}
                  onChange={handleChange}
                  placeholder="Enter Required Knowledge, Skills, and Abilities"
                ></textarea>
                 <FormError error={errors.knowledge_description} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Education + Experience"
                  htmlFor="education_description"
                />
                <textarea
                  className={clsx(
                    errors.education_description ? "is-error" : "",
                    "form-control"
                  )}
                  id="education_description"
                  name="education_description"
                  value={values.education_description}
                  onChange={handleChange}
                  placeholder="Enter Education + Experience"
                ></textarea>
                <FormError error={errors.education_description} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Company Job Description"
                  htmlFor="company_description"
                />
                <textarea
                   className={clsx(
                    errors.company_description ? "is-error" : "",
                    "form-control"
                  )}
                  value={values.company_description}
                  id="company_description"
                  name="company_description"
                  onChange={handleChange}
                  placeholder="Enter Company Job Description"
                ></textarea>
                <FormError error={errors.company_description} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel name="Enter Company Name" htmlFor="company_name" />
                <FormControl
                  type="text"
                  className={errors.company_name ? "is-error" : ""}
                  value={values.company_name}
                  id="company_name"
                  name="company_name"
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                />
                <FormError error={errors.company_name} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel name="Enter Company Email" htmlFor="email" />
                <FormControl
                  type="email"
                  className={errors.company_email ? "is-error" : ""}
                  value={values.company_email}
                  id="company_email"
                  name="company_email"
                  onChange={handleChange}
                  placeholder="Enter Company Email"
                />
                 <FormError error={errors.company_email} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Job Categories"
                  htmlFor="job-categories"
                />
                <ReactSelect
                  name="job-categories"
                  onChange={handleCategoryChange}
                  value={categorySelect}
                  options={jobCategoryOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {/* <FormError error={errors.categorySelect} /> */}
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel name="Enter Job Location" htmlFor="job-location" />
                <ReactSelect
                  name="job-location"
                  onChange={handleLocationChange}
                  value={locationSelect}
                  options={jobLocationOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
                {/* <FormError error={errors.locationSelect} /> */}
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Total Number of Vacancy"
                  htmlFor="vacancy"
                />
                <FormControl
                  value={values.vacancy}
                  className={errors.vacancy ? "is-error" : ""}
                  id="vacancy"
                  name="vacancy"
                  onChange={handleOnChangeEvent}
                  type="text"
                  placeholder="Enter Total Number of Vacancy"
                />
                <FormError error={errors.vacancy} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Job nature (Full-Time/Part-Time)"
                  htmlFor="nature"
                />
                <select
                  className={clsx(
                    errors.nature ? "is-error" : "",
                    "form-select"
                  )}
                  id="nature"
                  value={values.nature}
                  name="nature"
                  onChange={handleChange}
                >
                  <option value="select">Select Nature</option>
                  <option value="Part time">Part time</option>
                  <option value="Full time">Full time</option>
                </select>
                <FormError error={errors.nature} />
              </div>

              <div className="col-md-6 mb-3">
                <FormLabel
                  name="Enter Company Website URL"
                  htmlFor="company_website"
                />
                <FormControl
                  type="text"
                  className={errors.company_website ? "is-error" : ""}
                  value={values.company_website}
                  id="company_website"
                  name="company_website"
                  onChange={handleChange}
                  placeholder="Enter Company Website URL"
                />
                <FormError error={errors.company_website} />
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary w-auto text-white p-3 m-auto mt-5"
                >
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateJob;
