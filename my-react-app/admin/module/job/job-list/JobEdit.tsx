import { useMutation } from "@tanstack/react-query";
import FormControl from "../../../../src/components/FormControl";
import FormLabel from "../../../../src/components/FormLabel";
import { updateJob } from "../api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useFormik } from "formik";

const JobEdit = ({ setShowModal, selectedItemId }: any) => {
  const { mutate: updateJobFn } = useMutation((data) => updateJob(selectedItemId, data), {
    onSuccess: () => {
      toast.success("Job Edited Successfully.");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast(error.response?.data.message, {
        type: "error",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      company_name: "",
      company_email: "",
      company_description: "",
      education_description: "",
      job_nature: "",
      vacancy: 0,
    },
    onSubmit: (values: any) => {
      updateJobFn(values);
      setShowModal(false);
    },
  });

  return (
    <>
      <div
        className="modal fade modal-toggle show"
        id="exampleModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Job Edit
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <FormLabel name="Company  Name" htmlFor="htmlFor" />
                    <FormControl
                      onChange={formik.handleChange}
                      value={formik.values.company_name}
                      id="company_name"
                      type="text"
                      name="company_name"
                    />
                  </div>


                  <div className="form-group col-md-4">
                    <FormLabel name="Company Email" htmlFor="youremail" />
                    <FormControl
                      onChange={formik.handleChange}
                      value={formik.values.company_email}
                      id="company_email"
                      type="email"
                      name="company_email"
                    />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel
                      name="Company Description"
                      htmlFor="pan_number"
                    />
                    <FormControl
                      onChange={formik.handleChange}
                      value={formik.values.company_description}
                      id="company_description"
                      type="text"
                      name="company_description"
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <FormLabel
                      name="Education Description"
                      htmlFor="mobilenumber"
                    />
                    <FormControl
                      onChange={formik.handleChange}
                      value={formik.values.education_description}
                      id="education_description"
                      type="number"
                      name="education_description"
                    />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Job Nature" htmlFor="education" />
                    <FormControl
                      onChange={formik.handleChange}
                      value={formik.values.job_nature}
                      id="job_nature"
                      type="text"
                      name="job_nature"
                    />
                  </div>

                  <div className="form-group col-md-4">
                    <FormLabel name="Vacancy" htmlFor="ctc" />
                    <FormControl
                      onChange={formik.handleChange}
                      value={formik.values.vacancy}
                      id="vacancy"
                      type="number"
                      name="vacancy"
                    />
                  </div>


                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn-primary px-2 py-1 border-0"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default JobEdit;