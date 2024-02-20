const JobDelete = ({ deleteModal, setDeleteModal }: any) => {
  return (
    <div>
      {deleteModal && (
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
                    Delete Job
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setDeleteModal(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <h4>Are You Sure Want to Delete</h4>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn-danger px-2 py-1 border-0"
                    // onClick={handleSubmitEvent}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default JobDelete;