import { getAllApplication } from "../api";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";

import Loader from "../../../shared/Loader";
import { DownloadIcon } from "../../../shared/Icon";
import { useNavigate } from "react-router-dom";
import FormControl from "../../../../src/components/FormControl";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { statesDataList } from "../../../../src/shared/helpers/data";

const ApplicationList = () => {
  const navigate = useNavigate();
  const [genderFilter, setGenderFilter] = useState("");
  const [expectedSalaryFilter, setExpectedSalaryFilter] = useState("");
  const [noticePeriodFilter, setNoticePeriodFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [educationFilter, setEducationFilter] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: applicationListData,
    isLoading: applicationListIsLoading,
    refetch: refetchApplicationListIsLoading,
  } = useQuery({
    queryKey: [
      "get-all-application",
      genderFilter,
      expectedSalaryFilter,
      noticePeriodFilter,
      stateFilter,
      page,
    ],
    queryFn: () =>
      getAllApplication(
        genderFilter,
        expectedSalaryFilter,
        noticePeriodFilter,
        stateFilter,
        educationFilter,
        page
      ),
  });

  // const { data: applicationListData, isLoading: applicationListIsLoading } =
  //   useQuery(["getAllApplication"], getAllApplication);

  const handleViewApplication = (applicationId: number) => {
    console.log('in');
    navigate(`/admin/job-category-user-application/${applicationId}?fromJob`);
  };

  const generateApplicationListArray = () => {
    return applicationListData.map((application: any, index: number) => ({
      "Sr. No": index + 1 || "-",
      "Job Title": application?.job_id?.title || "-",
      "Category Name": application?.category_id?.name || "-",
      "Applicant Name": application?.first_name || "-",
      "Applicant Email": application?.email || "-",
      "Applicant Education": application?.education || "-",
      "Applicant Pan Number": application?.pan_number || "-",
      "Applicant CTC": application?.ctc || "-",
      "Applicant Expected CTC": application?.expected_ctc || "-",
      "Notice Period": application?.notice_period || "-",
      "Total Work Exp.": application?.total_work_experience || "-",
      State: application?.state || "-",
      Gender: application?.gender || "-",
    }));
  };

  const downloadXL = () => {
    const userData = generateApplicationListArray();
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "job-applications.xlsx");
  };

  const onClickResetFilter = () => {
    setGenderFilter("");
    setExpectedSalaryFilter("");
    setNoticePeriodFilter("");
    setStateFilter("");
    setEducationFilter("");
  };

  const onGenderFilter = (event: any) => {
    setGenderFilter(event.target.value);
  };

  const onExpectedSalaryFilter = (event: any) => {
    setExpectedSalaryFilter(event?.target.value);
  };

  const onNoticePeriodFilter = (event: any) => {
    setNoticePeriodFilter(event?.target.value);
  };

  const onStateFilter = (event: any) => {
    setStateFilter(event?.target.value);
  };

  const executeSearch = useRef(
    debounce(async () => {
      await refetchApplicationListIsLoading();
    }, 500)
  ).current;

  const onEducationFilter = (event: any) => {
    setEducationFilter(event?.target.value);
    executeSearch();
  };

  const handlePageChange = (selected: number) => {
    setPage(selected + 1);
  };

  if (applicationListIsLoading) {
    return (
      <div className="py-4 banner-height d-flex justify-content-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="app-wrapper">
        <div className="app-content pt-3 p-md-3 p-lg-4">
          <div className="container-xl">
            <div className="row g-3 mb-4 align-items-center justify-content-between">
              <div className="d-flex flex-wrap align-items-center">
                <h1 className="app-page-title mb-0">All Job Applications</h1>
                <button
                  className="btn btn-primary d-flex align-items-center text-white ms-auto"
                  onClick={downloadXL}
                >
                  Export &nbsp;
                  <DownloadIcon />
                </button>
              </div>
              <div className="d-flex gap-3 align-items-center mb-3">
                <select
                  className={"form-control appearance-auto w-auto"}
                  id="inputgender"
                  value={genderFilter}
                  name="gender"
                  onChange={onGenderFilter}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                <select
                  className={"form-control appearance-auto w-auto"}
                  id="inputgender"
                  value={expectedSalaryFilter}
                  name="gender"
                  onChange={onExpectedSalaryFilter}
                >
                  <option value="">Expected Salary Range</option>
                  <option value="1to3">1-3 lakh</option>
                  <option value="3to5">3-5 lakh</option>
                  <option value="5to7">5-7 lakh</option>
                  <option value="more">more than 7 lakh</option>
                </select>
                <select
                  className={"form-control appearance-auto w-auto"}
                  id="inputgender"
                  value={noticePeriodFilter}
                  name="notice-period"
                  onChange={onNoticePeriodFilter}
                >
                  <option value="">Notice Period Range</option>
                  <option value="1to90">1-3 month</option>
                  <option value="90to180">3-6 month</option>
                  <option value="more">more than 6 months</option>
                </select>
                <select
                  className={"form-control"}
                  id="inputState"
                  value={stateFilter}
                  name="state"
                  onChange={onStateFilter}
                >
                  {statesDataList.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>

                <FormControl
                  onChange={(event: any) => onEducationFilter(event)}
                  value={educationFilter}
                  id="education"
                  type="text"
                  name="education"
                  className={""}
                  placeholderText="Enter education"
                />
                <button
                  type="button"
                  className="btn-primary text-white"
                  onClick={onClickResetFilter}
                >
                  Reset
                </button>
              </div>
              <div className="g-4 mb-4 overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sr. No</th>
                      <th scope="col">Job Title</th>
                      <th scope="col">Applicant Name</th>
                      <th scope="col">Applicant CTC</th>
                      <th scope="col">Expected CTC</th>
                      <th scope="col">Notice Period</th>
                      <th scope="col">Total Work Exp.</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!applicationListData.data ||
                      (applicationListData.data.length === 0 && (
                        <tr>
                          <td colSpan={9}>No Data Found.</td>
                        </tr>
                      ))}
                    {applicationListData.data &&
                      applicationListData.data.length > 0 &&
                      applicationListData.data.map(
                        (application: any, index: number) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{application?.job_id?.title || "-"}</td>
                            <td>{application?.first_name || "-"}</td>
                            <td>{application?.ctc || "-"}</td>
                            <td>{application?.expected_ctc || "-"}</td>
                            <td>{application?.notice_period || "-"}</td>
                            <td>{application?.total_work_experience || "-"}</td>
                            <td>{application?.gender || "-"}</td>
                            <td>
                              <button
                                className="ml-2 btn btn-secondary p-2 text-white"
                                onClick={() =>
                                  handleViewApplication(application._id)
                                }
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
              {applicationListData.pageInfo.length > 0 && (
                <>
                  <ReactPaginate
                    className="custom-pagination "
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={(event) => handlePageChange(event.selected)}
                    pageCount={applicationListData.pageInfo[0].totalPages}
                    pageRangeDisplayed={3}
                    previousLabel="Previous"
                    renderOnZeroPageCount={null}
                    activeClassName="paginate-active"
                    forcePage={applicationListData.pageInfo[0].currentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationList;
