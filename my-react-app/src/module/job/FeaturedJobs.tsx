import SingleJobList from "./SingleJobList";
import ReactPaginate from "react-paginate";
import Loader from "../../components/Loader";
import { useState } from "react";

type FeaturedJobsProps = {
  setApplyNowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setApplyJobData: React.Dispatch<
    React.SetStateAction<{
      job_id: string;
      category_id: string;
    }>
  >;
  jobsData: any;
  jobsDataIsLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const FeaturedJobs = ({
  setApplyNowModal,
  setApplyJobData,
  jobsData,
  jobsDataIsLoading,
  setPage,
}: FeaturedJobsProps) => {
  const [activePage, setActivePage] = useState(0);

  console.log(jobsData);
  if (jobsDataIsLoading) {
    return (
      <div className="text-center py-4 bg-white banner-height">
        <Loader />
      </div>
    );
  }

  const handlePageChange = (selected: number) => {
    setActivePage(selected);
    setPage(selected + 1);
  };

  return (
    <section className="featured-job-area feature-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-tittle text-center">
              <h2>Recent Openings</h2>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-10">
          {!jobsData.data || (jobsData.data.length === 0 && <h3 className="text-center mb-5">No Data Found</h3>)}
            {jobsData?.data?.length > 0 && !jobsDataIsLoading && (
              <>
                {jobsData?.data?.map((job: any, index: number) => (
                  <span key={index}>
                    <SingleJobList
                      setApplyNowModal={setApplyNowModal}
                      id={job?._id}
                      title={job.title}
                      categoryName={job.category_id.name}
                      categoryId={job?.category_id?._id}
                      description={job?.description}
                      location={job?.job_location_id?.name}
                      companyName={job?.company_name}
                      setApplyJobData={setApplyJobData}
                    />
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
        {jobsData.data.length > 0 && (
          <ReactPaginate
            className="custom-pagination "
            breakLabel="..."
            nextLabel="Next"
            onPageChange={(event) => handlePageChange(event.selected)}
            pageCount={jobsData.pageInfo[0].totalPages}
            pageRangeDisplayed={3}
            previousLabel="Previous"
            renderOnZeroPageCount={null}
            activeClassName="paginate-active"
            forcePage={activePage}
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
