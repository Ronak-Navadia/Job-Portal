import { useQuery } from "@tanstack/react-query";
import ReactSelect from "react-select";
import { useState } from "react";
import FormControl from "../../../admin/shared/FormControl";
import axios from "axios";
import Loader from "../../components/Loader";

type ClientBannerProps = {
  setJobListFilter: React.Dispatch<
    React.SetStateAction<{
      searchFilter: string;
      locationFilter: string;
      categoryFilter: string;
    }>
  >;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  jobDataRefetch: any;
};

const ClientBanner = ({ setJobListFilter, setPage, jobDataRefetch }: ClientBannerProps) => {
  const [categorySelect, setCategorySelect] = useState({
    value: "",
    label: "Any - All Categories",
  });
  const [locationSelect, setLocationSelect] = useState({
    value: "",
    label: "Any - All Locations",
  });

  const customStyles = {
    indicatorContainer: (base: any) => ({
      ...base,
      color: "red",
      marginRight: 19,
    }),
    control: (base: any) => ({
      ...base,
      height: 70,
      minHeight: 70,
      border: 0,
      borderRadius: 0,
      boxShadow: "none",
      "&:hover": {
        boxShadow: "none",
        borderColor: "#fff",
      },
    }),
  };

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

  const getJobLocations = async () => {
    const response = await axios.get(`http://localhost:3000/jobs-locations`);
    return response.data;
  };

  const { data: jobLocationData, isLoading: jobLocationDataIsLoading } =
    useQuery(["job-location-list"], () => getJobLocations());

  const jobLocationOptions =
    jobLocationData?.map((location: any) => ({
      value: location._id,
      label: location.name,
    })) || [];

  const handleCategoryChange = (event: any) => {
    setCategorySelect(event);
    setJobListFilter((prev:any) => {
      return {
        ...prev,
        categoryFilter: event.value
      }
    })
  };

  const handleLocationChange = (event: any) => {
    setLocationSelect(event);
    setJobListFilter((prev:any) => {
      return {
        ...prev,
        locationFilter: event.value
      }
    })
  };

  const handleSearchChange = (event: any) => {
    setJobListFilter((prev:any) => {
      return {
        ...prev,
        searchFilter: event.target.value
      }
    })
  };

  const onClickFind = (e: any) => {
    e.preventDefault();
    jobDataRefetch();
    setPage(1);
  };

  if (jobCategoryDataIsLoading || jobLocationDataIsLoading) {
    return <div className="py-4 banner-height">
      <Loader />
    </div>
  }

  return (
    <div className="slider-area">
      <div className="slider-active">
        <div className="single-slider slider-height d-flex align-items-center">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-9 col-md-10">
                <div className="hero__caption">
                  <h1>Find the most exciting jobs opportunities</h1>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-auto">
                <form action="#" className="search-box" onSubmit={onClickFind}>
                  <div className="input-form">
                    <FormControl
                      type="text"
                      id="search"
                      name="search"
                      onChange={handleSearchChange}
                      placeholder="Search Job"
                      required={false}
                    />
                  </div>
                  <div className="select-form">
                    <div className="select-itms d-flex">
                      <ReactSelect
                        className="react-select__control"
                        name="job-location"
                        styles={customStyles}
                        onChange={handleLocationChange}
                        value={locationSelect}
                        options={jobLocationOptions}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                      <ReactSelect
                        className="react-select__control"
                        name="job-categories"
                        styles={customStyles}
                        onChange={handleCategoryChange}
                        value={categorySelect}
                        options={jobCategoryOptions}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    </div>
                  </div>
                  <button type="submit" className="find-job-btn">
                    Find Job
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBanner;
