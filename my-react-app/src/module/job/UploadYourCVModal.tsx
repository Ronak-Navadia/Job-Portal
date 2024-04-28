/* eslint-disable @typescript-eslint/no-explicit-any */
import FormControl from "../../components/FormControl";
import FormLabel from "../../components/FormLabel";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useState, useEffect, useRef } from "react";
import FormError from "../../components/FormError";
import clsx from "clsx";
import Loader from "../../components/Loader";
import ReactSelect from "react-select";
import { UploadYourCVModalSchema } from "./UploadYourCVValidation";
import { statesDataList } from "../../shared/helpers/data";

const UploadYourCVModal = ({ setUploadYourCVModal }: any) => {
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categorySelect, setCategorySelect] = useState({
    value: "",
    label: "Any - All Categories",
  });

  const getJobCategories = async () => {
    const response = await axios.get(`http://localhost:3000/jobs-categories`);
    return response.data;
  };

  const { data: jobCategoryData, isLoading: jobCategoryDataIsLoading } =
    useQuery({
      queryKey: ["job-category-list"],
      queryFn: () => getJobCategories(),
    });

  const jobCategoryOptions =
    jobCategoryData?.map((category: any) => ({
      value: category._id,
      label: category.name,
    })) || [];

  const handleCloseModal = () => {
    setUploadYourCVModal(false);
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addJobApplication = async (data: any) => {
    const response = await axios.post(`http://localhost:3000/apply`, data);
    return response.data;
  };
  
  const { mutate: applyJobMutate, isLoading: applyJobIsLoading } = useMutation({
    mutationFn: (data) => addJobApplication(data),
    onSuccess: () => {
      setUploadYourCVModal(false);
      toast.success("Application added successfully");
    },
  });

  const customStyles = {
    control: (base:any) => ({
      ...base,
      borderColor: 'red',
    }),
  };

  const { handleSubmit, setFieldValue, errors, values, handleChange } =
    useFormik({
      initialValues: {
        job_id: "",
        category_id: "",
        first_name: "",
        last_name: "",
        email: "",
        pan_number: "",
        mobile_number: "",
        education: "",
        ctc: "",
        expected_ctc: "",
        notice_period: "",
        total_work_experience: "",
        gender: "",
        state: "",
        resume_file: "",
      },
      validateOnChange: false,
      validationSchema: UploadYourCVModalSchema,
      onSubmit: (values: any) => {
        const formData: any = new FormData();
        Object.keys(values).forEach((key) => {
          if (!["resume_file", "job_id", "category_id"].includes(key)) {
            formData.append(key, values[key]);
          }
        });
        formData.append("resume_file", file);
        formData.append("category_id", categorySelect.value)

        if (!file || !file.name) {
          toast.error("Please upload resume");
          return;
        }

        applyJobMutate(formData);
      },

    });


  const handleOnChangeEvent = (event: any) => {
    const value = event?.target.value.replace(/[^\d]/g, '');
    setFieldValue(event?.target.name, value.slice(0, 10));
  };

  const onStateChange = (event: any) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  const handleFileChange = async (e: any) => {
    e.preventDefault();

    const fileObj = e.target.files && e.target.files[0];
    if (!fileObj) {
      return;
    }

    // check file size
    if (fileObj.size > 25000000) {
      toast.error("Please select file under 25MB");
      setFile(null);
      e.target.value = null;
      return;
    }

    //check file types
    if (fileObj.type !== "application/pdf") {
      toast.error(
        "Invalid file format. Supported Format: .JPEG, .JPG, .PDF, .PNG"
      );
      setFile(null);
      e.target.value = null;
      return;
    }

    console.log('here');

    setFile(fileObj);
    e.target.value = null;
  };

  const onChooseFileButtonClick = () => {
    if(fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleCategoryChange = (event: any) => {
    setCategorySelect(event);
    setFieldValue('category_id', event.value)
  };

  if (applyJobIsLoading || jobCategoryDataIsLoading ) {
    return (
      <div className="text-center py-4 bg-white banner-height">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div
        className="modal fade modal-toggle  show"
        id="exampleModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Upload your CV
              </h5>
              <button
                type="button"
                className="close outline-0"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <FormLabel name="First Name*" htmlFor="htmlFor" />
                    <FormControl
                      onChange={handleChange}
                      value={values.first_name}
                      id="first_name"
                      type="text"
                      name="first_name"
                      className={errors.first_name ? "is-error" : ""}
                    />
                    <FormError error={errors.first_name} />
                  </div>
                  <div className="form-group col-md-4">
                    <FormLabel name="Last Name*" htmlFor="lastname" />
                    <FormControl
                      onChange={handleChange}
                      value={values.last_name}
                      id="last_name"
                      type="text"
                      name="last_name"
                      className={errors.last_name ? "is-error" : ""}
                    />
                    <FormError error={errors.last_name} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Email*" htmlFor="youremail" />
                    <FormControl
                      onChange={handleChange}
                      value={values.email}
                      id="email"
                      type="text"
                      name="email"
                      className={errors.email ? "is-error" : ""}
                    />
                    <FormError error={errors.email} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Pancard number*" htmlFor="pan_number" />
                    <FormControl
                      onChange={handleChange}
                      value={values.pan_number}
                      id="pan_number"
                      type="text"
                      name="pan_number"
                      className={errors.pan_number ? "is-error" : ""}
                    />
                    <FormError error={errors.pan_number} />
                  </div>
                  <div className="form-group col-md-4">
                    <FormLabel name="Mobile number*" htmlFor="mobilenumber" />
                    <FormControl
                      onChange={(event: any) => handleOnChangeEvent(event)}
                      value={values.mobile_number}
                      id="mobile_number"
                      name="mobile_number"
                      type="tel"
                      className={errors.mobile_number ? "is-error" : ""}
                    />
                    <FormError error={errors.mobile_number} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Education*" htmlFor="education" />
                    <FormControl
                      onChange={handleChange}
                      value={values.education}
                      id="education"
                      type="text"
                      name="education"
                      className={errors.education ? "is-error" : ""}
                    />
                    <FormError error={errors.education} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="CTC* (in lakh)" htmlFor="ctc" />
                    <FormControl
                      onChange={(event: any) => handleOnChangeEvent(event)}
                      value={values.ctc}
                      id="ctc"
                      type="number"
                      name="ctc"
                      className={errors.ctc ? "is-error" : ""}
                    />
                    <FormError error={errors.ctc} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Expected CTC* (in lakh)" htmlFor="expctc" />
                    <FormControl
                      onChange={(event: any) => handleOnChangeEvent(event)}
                      value={values.expected_ctc}
                      id="expctc"
                      type="number"
                      name="expected_ctc"
                      className={errors.expected_ctc ? "is-error" : ""}
                    />
                    <FormError error={errors.expected_ctc} />

                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Category*" htmlFor="select catgory" />
                    <ReactSelect
                      styles={errors.category_id ? customStyles : {}}
                      name="job-categories"
                      value={categorySelect}
                      options={jobCategoryOptions}
                      onChange={handleCategoryChange}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                    />
                    <FormError error={errors.category_id} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel
                      name="Total Work Experience* (years)"
                      htmlFor="workexperience"
                    />
                    <FormControl
                      onChange={(event: any) => handleOnChangeEvent(event)}
                      value={values.total_work_experience}
                      id="workexperience"
                      type="text"
                      name="total_work_experience"
                      className={errors.total_work_experience ? "is-error" : ""}
                    />
                    <FormError error={errors.total_work_experience} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Gender*" htmlFor="gendar" />
                    <select
                      className={clsx(
                        errors.gender ? "is-error" : "",
                        "form-control"
                      )}
                      id="inputgender"
                      value={values.gender}
                      name="gender"
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>

                    </select>
                    <FormError error={errors.gender} />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="State*" htmlFor="state" />
                    <select
                      className={clsx(
                        errors.state ? "is-error" : "",
                        "form-control"
                      )}
                      id="inputState"
                      value={values.state}
                      name="state"
                      onChange={onStateChange}
                    >
                      {statesDataList.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    <FormError error={errors.state} />
                  </div>

                  
                  <div className="form-group col-md-4">
                    <FormLabel name="Notice Period* (days)" htmlFor="notice_period" />
                    <FormControl
                      onChange={(event: any) => handleOnChangeEvent(event)}
                      value={values.notice_period}
                      id="notice_period"
                      type="text"
                      name="notice_period"
                      className={errors.notice_period ? "is-error" : ""}
                    />
                    <FormError error={errors.notice_period} />
                  </div>

                  <div className="form-group col-md-12">
                    <label htmlFor="resume" className="btn-link mb-0 font-weight-bold cursor-pointer">Add Resume</label>
                    <input
                      className="form-control"
                      type="file"
                      id="resume"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e)}
                    />
                    <button type="button" style={{"opacity": "0"}}onClick={onChooseFileButtonClick}>Choose File</button>
                    {file?.name && <p>Selected file: {file?.name}</p>}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default UploadYourCVModal;
