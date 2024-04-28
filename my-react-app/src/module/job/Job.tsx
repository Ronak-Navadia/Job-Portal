import { useEffect, useState } from "react";
import FeaturedJobs from "./FeaturedJobs";
import OnlineResume from "./OnlineResume";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ClientBanner from "./ClientBanner";
import ApplicationModal from "./ApplicationModal";
import UploadYourCVModal from "./UploadYourCVModal";

const Job = () => {
  const [applyNowModal, setApplyNowModal] = useState(false);
  const [uploadYourCVModal, setUploadYourCVModal] = useState(false);


  const [applyJobData, setApplyJobData] = useState({
    job_id: "",
    category_id: "",
  });

  const [jobListFilter, setJobListFilter] = useState({
    searchFilter: "",
    locationFilter: "",
    categoryFilter: "",
  });

  const [page, setPage] = useState(1);

  const fetchJobs = async (page: number) => {
    const response = await axios.get(
      `http://localhost:3000/jobs?page=${page}&search=${jobListFilter.searchFilter}&category=${jobListFilter.categoryFilter}&location=${jobListFilter.locationFilter}`
    );
    return response.data;
  };

  const { data: jobsData, isLoading: jobsDataIsLoading, refetch: jobDataRefetch } = useQuery({
    queryKey: ["all-job-data", page],
    queryFn: () => fetchJobs(page),

  });

  return (
    <>
      <ClientBanner setJobListFilter={setJobListFilter} setPage={setPage} jobDataRefetch={jobDataRefetch} />
      <FeaturedJobs
        setApplyNowModal={setApplyNowModal}
        setApplyJobData={setApplyJobData}
        jobsData={jobsData}
        jobsDataIsLoading={jobsDataIsLoading}
        setPage={setPage}
      />
      <OnlineResume setUploadYourCVModal={setUploadYourCVModal} />
      {applyNowModal && (
        <ApplicationModal
          setApplyNowModal={setApplyNowModal}
          applyJobData={applyJobData}
        />
      )}
      {uploadYourCVModal && (
        <UploadYourCVModal setUploadYourCVModal={setUploadYourCVModal} />
      )}
    </>
  );
};

export default Job;
