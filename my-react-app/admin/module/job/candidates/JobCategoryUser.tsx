import { Link, useParams } from "react-router-dom";
import { categoryList } from "../api";
import { useQuery } from "@tanstack/react-query";
import { categoryDataType } from "../../../shared/types";
import useJobCategories from "../../../shared/store/useJobCategories";
import { useState } from "react";
import ReactPaginate from "react-paginate";

const JobCategoryUser = () => {
  const { categoryId } = useParams();
  const { jobCategoriesTitle } = useJobCategories();
  const [page, setPage] = useState(1);

  const { data: categoryData, isLoading: isLoadingCategoryData } = useQuery({
    queryKey: ["job-category-user"],
    queryFn: () => categoryList(categoryId, page),
    // select: (res) => {
    //   return res.data;
    // }
  });

  const handlePageChange = (selected: number) => {
    setPage(selected + 1);
  };

  if (isLoadingCategoryData) {
    return;
  }

  return (
    <div className="app-wrapper">
      <div className="app-content pt-3 p-md-3 p-lg-4">
        <div className="container-xl">
          <nav aria-label="breadcrumb mb-5">
            <ol className="breadcrumb bg-transparent p-0">
              <li className="breadcrumb-item ">
                <Link to="/admin/job-category-list" className="textgreen">
                  &#x2190; {jobCategoriesTitle} List
                </Link>
              </li>
            </ol>
          </nav>

          <div className="row g-3 mb-4 align-items-center justify-content-between">
            <div className="col-auto">
              <h1 className="app-page-title mb-0">{jobCategoriesTitle} List</h1>
            </div>
          </div>

          <div className="g-4 mb-4">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Candidates Name</th>
                  <th scope="col">Candidates Email</th>
                  <th scope="col">Candidates Phone</th>
                  <th scope="col">Candidates Detail</th>
                </tr>
              </thead>
              <tbody>
                {!categoryData.data ||
                  (categoryData.data.length === 0 && (
                    <tr>
                      <td colSpan={4}>No Data Found.</td>
                    </tr>
                  ))}
                {categoryData.data &&
                  categoryData.data.length > 0 &&
                  categoryData.data.map(
                    (category: categoryDataType, index: number) => (
                      <tr key={index}>
                        <td>{category.first_name}</td>
                        <td>{category.email}</td>
                        <td>{category.mobile_number}</td>
                        <td>
                          <Link
                            className="textgreen"
                            to={`/admin/job-category-user-application/${category._id}`}
                          >
                            View Candidate Detail
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
          {categoryData.pageInfo.length > 0 && (
            <>
              <ReactPaginate
                className="custom-pagination "
                breakLabel="..."
                nextLabel="Next"
                onPageChange={(event) => handlePageChange(event.selected)}
                pageCount={categoryData.pageInfo[0].totalPages}
                pageRangeDisplayed={3}
                previousLabel="Previous"
                renderOnZeroPageCount={null}
                activeClassName="paginate-active"
                forcePage={categoryData.pageInfo[0].currentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCategoryUser;
