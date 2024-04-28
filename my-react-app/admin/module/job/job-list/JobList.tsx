import { getAllCategories, getAllJob, getAllLocations } from "../api";
import { useQuery } from "@tanstack/react-query";
import JobEdit from "./JobEdit";
import JobDelete from "./JobDelete";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../shared/Loader";
import { DownloadIcon } from "../../../shared/Icon";
import * as XLSX from "xlsx";
import ReactSelect from "react-select";
import ReactPaginate from "react-paginate";

const JobList = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [categorySelect, setCategorySelect] = useState({
    value: "",
    label: "Any - All Categories",
  });
  const [locationSelect, setLocationSelect] = useState({
    value: "",
    label: "Any - All Locations",
  });

  const [page, setPage] = useState(1);

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

  // const fetchJobs = async (page: number) => {
  //   const response = await axios.get(
  //     `http://localhost:3000/jobs?page=${page}&search=${jobListFilter.searchFilter}&category=${jobListFilter.categoryFilter}&location=${jobListFilter.locationFilter}`
  //   );
  //   return response.data;
  // };

  // const { data: jobsData, isLoading: jobsDataIsLoading, refetch: jobDataRefetch } = useQuery({
  //   queryKey: ["all-job-data", page],
  //   queryFn: () => fetchJobs(page),

  // });

  const {
    data: jobListData,
    refetch: jobListRefetch,
    isLoading: jobListIsLoading,
  } = useQuery(["getAllJob", categorySelect, locationSelect, page], () =>
    getAllJob(categorySelect, locationSelect, page)
  );

  const handleEditClick = (id: any) => {
    navigate(`/admin/update-job/${id}`);
    setShowModal(true);
    setSelectedItemId(id);
  };

  const handleDeleteClick = (id: any) => {
    setDeleteModal(true);
    setSelectedItemId(id);
  };

  const handleViewApplication = (id: any) => {
    navigate(`/admin/job-list-application/${id}`);
  };

  const generateJobListArray = () => {
    return jobListData.map((job: any, index: number) => ({
      "Sr. No": index + 1 || "-",
      "Job Title": job.title || "-",
      "Job Description": job.description || "-",
      "Company name": job.company_name || "-",
      "Company email": job.company_email || "-",
      "Job Category": job.category_id.name || "-",
      "Job Location": job.job_location_id.name || "-",
      "Job Nature": job.nature || "-",
      "Job Vacancy": job.vacancy || "-",
    }));
  };

  const downloadXL = () => {
    const userData = generateJobListArray();
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "job-list.xlsx");
  };

  const onClickResetFilter = () => {
    setCategorySelect({
      value: "",
      label: "Any - All Categories",
    });

    setLocationSelect({
      value: "",
      label: "Any - All Locations",
    });
  };

  const handleCategoryChange = (event: any) => {
    setCategorySelect(event);
  };

  const handleLocationChange = (event: any) => {
    setLocationSelect(event);
  };

  const handlePageChange = (selected: number) => {
    setPage(selected + 1);
  };

  if (
    jobListIsLoading ||
    jobCategoryDataIsLoading ||
    jobLocationDataIsLoading
  ) {
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
            <div className="d-flex flex-wrap align-items-center mb-3">
              <h1 className="app-page-title mb-0">All Jobs</h1>
              <button
                className="btn btn-primary d-flex align-items-center text-white ms-auto"
                onClick={downloadXL}
              >
                Export &nbsp;
                <DownloadIcon />
              </button>
            </div>
            <div className="d-flex gap-3 align-items-center mb-3">
              <div className="mr-2">
                <ReactSelect
                  name="job-categories"
                  onChange={handleCategoryChange}
                  value={categorySelect}
                  options={jobCategoryOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
              <div className="mr-2">
                <ReactSelect
                  name="job-location"
                  onChange={handleLocationChange}
                  value={locationSelect}
                  options={jobLocationOptions}
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                />
              </div>
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
                    <th scope="col">Job Title</th>
                    <th scope="col">Company Name</th>
                    <th scope="col">Job Category</th>
                    <th scope="col">Job Location</th>
                    <th scope="col">Job Nature</th>
                    <th scope="col">Vacancy</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!jobListData.data ||
                    (jobListData.data.length === 0 && (
                      <tr>
                        <td colSpan={7}>
                          <h3 className="text-center my-5">No Data Found</h3>
                        </td>
                      </tr>
                    ))}
                  {jobListData.data &&
                    jobListData.data.length > 0 &&
                    jobListData.data.map((job: any, index: number) => (
                      <tr key={index}>
                        <td>{job.title}</td>
                        <td>{job.company_name}</td>
                        <td className="company__description">
                          {job.category_id.name}
                        </td>
                        <td>{job.job_location_id.name}</td>
                        <td>{job.nature}</td>
                        <td>{job.vacancy}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="ml-2 btn-primary text-white p-2"
                              onClick={() => handleEditClick(job._id)}
                            >
                              Edit
                            </button>
                            <button
                              className="ml-2 btn btn-danger p-2 text-white"
                              onClick={() => handleDeleteClick(job._id)}
                            >
                              Delete
                            </button>
                            <button
                              className="ml-2 btn btn-secondary p-2 text-white"
                              onClick={() => handleViewApplication(job._id)}
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {jobListData.pageInfo.length > 0 && (
              <>
                <ReactPaginate
                  className="custom-pagination "
                  breakLabel="..."
                  nextLabel="Next"
                  onPageChange={(event) => handlePageChange(event.selected)}
                  pageCount={jobListData.pageInfo[0].totalPages}
                  pageRangeDisplayed={3}
                  previousLabel="Previous"
                  renderOnZeroPageCount={null}
                  activeClassName="paginate-active"
                  forcePage={jobListData.pageInfo[0].currentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <JobEdit selectedItemId={selectedItemId} setShowModal={setShowModal} />
      )}
      {deleteModal && (
        <JobDelete
          jobListRefetch={jobListRefetch}
          selectedItemId={selectedItemId}
          setDeleteModal={setDeleteModal}
        />
      )}
    </>
  );
};

export default JobList;
