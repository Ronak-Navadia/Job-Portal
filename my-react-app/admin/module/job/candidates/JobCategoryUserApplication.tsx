import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { categoryView, getPdf } from "../api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useJobCategories from "../../../shared/store/useJobCategories";
import { isNull } from "lodash";

const JobCategoryUserApplication = () => {
  const navigate = useNavigate();
  const { jobCategoriesTitle } = useJobCategories();
  const { categoryId } = useParams();
  const [searchParam] = useSearchParams();
  const isFromJob = searchParam.get('fromJob');
  console.log({isFromJob});

  const [viewResumeClicked, setViewResumeClicked] = useState(false);

  const { data: applicationData } = useQuery(["categoryView"], () => categoryView(categoryId));

  const { data: pdfData } = useQuery({
    queryKey: ["pdfData"],
    queryFn: () => {
      const fileName = applicationData?.resume_file.substring(applicationData?.resume_file.lastIndexOf('/') + 1);
      return getPdf(fileName)
    },
    enabled: !!viewResumeClicked
  });

  useEffect(() => {
    if(!pdfData) return;
    const blobUrl = URL.createObjectURL(pdfData);
    window.open(blobUrl, '_blank');
  }, [pdfData])


  const handleViewResume = () => {
    setViewResumeClicked(true)
  }

  return (
    <div className="app-wrapper">
      <div className="app-content pt-3 p-md-3 p-lg-4">
        <div className="container-xl">
          <nav aria-label="breadcrumb mb-5">
            <ol className="breadcrumb bg-transparent p-0">
              <li className="breadcrumb-item">
                <button className="bg-transparent border-0 textgreen" onClick={()=> navigate(-1)}>
                  &#x2190; {isNull(isFromJob) ? jobCategoriesTitle : 'Job Applications'} List
                </button>
              </li>
            </ol>
          </nav>

          <div className="row g-3 mb-4 align-items-center justify-content-between">
            <div className="col-auto">
              <h1 className="app-page-title mb-0">{applicationData?.first_name} - {jobCategoriesTitle} Candidate</h1>
            </div>
          </div>

          <div className="g-4 mb-4 border p-3 bg-white rounded shadow-sm job-candidate-list">
            <p>
              <b>First Name :</b> {applicationData?.first_name}
            </p>
            <p>
              <b>Last Name :</b> {applicationData?.last_name}
            </p>
            <p>
              <b>Email :</b>{" "}
              <a href="mailto:mark@gmail.com">{applicationData?.email}</a>
            </p>
            <p>
              <b>Pancard number :</b> {applicationData?.pan_number}
            </p>
            <p>
              <b>Mobile number :</b> {applicationData?.mobile_number}
            </p>
            <p>
              <b>Education :</b> {applicationData?.education}
            </p>
            <p>
              <b>CTC (In Lakh) :</b> {applicationData?.ctc}
            </p>
            <p>
              <b>Expected CTC (in lakh) :</b> {applicationData?.expected_ctc}
            </p>
            <p>
              <b>Notice Period (Days) :</b> {applicationData?.notice_period}
            </p>
            <p>
              <b>Total Work Experience :</b>{" "}
              {applicationData?.total_work_experience}
            </p>
            <p>
              <b>Gender :</b> {applicationData?.gender}
            </p>
            <p>
              <b>State :</b> {applicationData?.state}
            </p>
            <p>
              <b>Resume :</b>{" "}
              <button className="btn-link px-0" onClick={handleViewResume}>Click Here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCategoryUserApplication;
