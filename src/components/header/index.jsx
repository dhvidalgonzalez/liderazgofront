import React, { useEffect, useContext } from "react";
import logoUser from "src/assets/img/codelco/user.png";

const Header = () => {
  useEffect(() => {
    const toggleBtn = document.querySelector(".sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    const toggleSidebar = (e) => {
      e.preventDefault();
      sidebar.classList.toggle("collapsed");

      sidebar.addEventListener(
        "transitionend",
        () => {
          window.dispatchEvent(new Event("resize"));
        },
        { once: true }
      );
    };

    toggleBtn?.addEventListener("click", toggleSidebar);
    return () => {
      toggleBtn?.removeEventListener("click", toggleSidebar);
    };
  }, []);

  return (
    <nav
      className="navbar navbar-top fixed-top navbar-expand bg-primary px-3"
      id="navbarDefault"
    >
      <div className="collapse navbar-collapse justify-content-between">
        <div className="navbar-logo">
          <button
            className="btn navbar-toggler navbar-toggler-humburger-icon hover-bg-transparent"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarVerticalCollapse"
            aria-controls="navbarVerticalCollapse"
            aria-expanded="false"
            aria-label="Toggle Navigation"
          >
            <span className="navbar-toggle-icon">
              <span className="toggle-line" />
            </span>
          </button>
          <a
            className="navbar-brand d-flex align-items-center text-white"
            href="/"
          >
            <div className="ms-2 d-none d-sm-block">
              <div className="fw-bold" style={{ fontSize: "16px" }}>
                Justificaciones
              </div>
              <div style={{ fontSize: "12px", color: "#cce0f5" }}>
                Plan de Liderazgo
              </div>
            </div>
          </a>
        </div>

        <ul className="navbar-nav navbar-nav-icons flex-row">
          <li className="nav-item d-lg-none">
            <a
              className="nav-link"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#searchBoxModal"
            >
              <span
                data-feather="search"
                style={{ height: 19, width: 19, marginBottom: 2 }}
              />
            </a>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              href="#"
              style={{ minWidth: "2.25rem" }}
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              data-bs-auto-close="outside"
            >
              <span className="d-block" style={{ height: 20, width: 20 }}>
                <span data-feather="bell" style={{ height: 20, width: 20 }} />
              </span>
            </a>
            <div
              className="dropdown-menu dropdown-menu-end notification-dropdown-menu py-0 shadow border navbar-dropdown-caret"
              id="navbarDropdownNotfication"
              aria-labelledby="navbarDropdownNotfication"
            >
              <div className="card position-relative border-0">
                <div className="card-header p-2">
                  <div className="d-flex justify-content-between">
                    <h5 className="text-body-emphasis mb-0">Notifications</h5>
                    <button
                      className="btn btn-link p-0 fs-9 fw-normal"
                      type="button"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div
                    className="scrollbar-overlay"
                    style={{ height: "27rem" }}
                  >
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative read border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img
                              className="rounded-circle"
                              src={logoUser}
                              alt
                            />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">
                              Jessie Samson
                            </h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                              <span className="me-1 fs-10">💬</span>Mentioned
                              you in a comment.
                              <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">
                                10m
                              </span>
                            </p>
                            <p className="text-body-secondary fs-9 mb-0">
                              <span className="me-1 fas fa-clock" />
                              <span className="fw-bold">10:41 AM </span>August
                              7,2021
                            </p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-boundary="window"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-bs-reference="parent"
                          >
                            <span className="fas fa-ellipsis-h fs-10 text-body" />
                          </button>
                          <div className="dropdown-menu py-2">
                            <a className="dropdown-item" href="#!">
                              Mark as unread
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <div className="avatar-name rounded-circle">
                              <span>J</span>
                            </div>
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">
                              Jane Foster
                            </h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                              <span className="me-1 fs-10">📅</span>Created an
                              event.
                              <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">
                                20m
                              </span>
                            </p>
                            <p className="text-body-secondary fs-9 mb-0">
                              <span className="me-1 fas fa-clock" />
                              <span className="fw-bold">10:20 AM </span>August
                              7,2021
                            </p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-boundary="window"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-bs-reference="parent"
                          >
                            <span className="fas fa-ellipsis-h fs-10 text-body" />
                          </button>
                          <div className="dropdown-menu py-2">
                            <a className="dropdown-item" href="#!">
                              Mark as unread
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img
                              className="rounded-circle avatar-placeholder"
                              src={logoUser}
                              alt
                            />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">
                              Jessie Samson
                            </h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                              <span className="me-1 fs-10">👍</span>Liked your
                              comment.
                              <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">
                                1h
                              </span>
                            </p>
                            <p className="text-body-secondary fs-9 mb-0">
                              <span className="me-1 fas fa-clock" />
                              <span className="fw-bold">9:30 AM </span>August
                              7,2021
                            </p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-boundary="window"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-bs-reference="parent"
                          >
                            <span className="fas fa-ellipsis-h fs-10 text-body" />
                          </button>
                          <div className="dropdown-menu py-2">
                            <a className="dropdown-item" href="#!">
                              Mark as unread
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img
                              className="rounded-circle"
                              src={logoUser}
                              alt
                            />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">
                              Kiera Anderson
                            </h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                              <span className="me-1 fs-10">💬</span>Mentioned
                              you in a comment.
                              <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10" />
                            </p>
                            <p className="text-body-secondary fs-9 mb-0">
                              <span className="me-1 fas fa-clock" />
                              <span className="fw-bold">9:11 AM </span>August
                              7,2021
                            </p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-boundary="window"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-bs-reference="parent"
                          >
                            <span className="fas fa-ellipsis-h fs-10 text-body" />
                          </button>
                          <div className="dropdown-menu py-2">
                            <a className="dropdown-item" href="#!">
                              Mark as unread
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative unread border-bottom">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img
                              className="rounded-circle"
                              src={logoUser}
                              alt
                            />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">
                              Herman Carter
                            </h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                              <span className="me-1 fs-10">👤</span>Tagged you
                              in a comment.
                              <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10" />
                            </p>
                            <p className="text-body-secondary fs-9 mb-0">
                              <span className="me-1 fas fa-clock" />
                              <span className="fw-bold">10:58 PM </span>August
                              7,2021
                            </p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-boundary="window"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-bs-reference="parent"
                          >
                            <span className="fas fa-ellipsis-h fs-10 text-body" />
                          </button>
                          <div className="dropdown-menu py-2">
                            <a className="dropdown-item" href="#!">
                              Mark as unread
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 px-sm-3 py-3 notification-card position-relative read ">
                      <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex">
                          <div className="avatar avatar-m status-online me-3">
                            <img
                              className="rounded-circle"
                              src={logoUser}
                              alt
                            />
                          </div>
                          <div className="flex-1 me-sm-3">
                            <h4 className="fs-9 text-body-emphasis">
                              Benjamin Button
                            </h4>
                            <p className="fs-9 text-body-highlight mb-2 mb-sm-3 fw-normal">
                              <span className="me-1 fs-10">👍</span>Liked your
                              comment.
                              <span className="ms-2 text-body-quaternary text-opacity-75 fw-bold fs-10" />
                            </p>
                            <p className="text-body-secondary fs-9 mb-0">
                              <span className="me-1 fas fa-clock" />
                              <span className="fw-bold">10:18 AM </span>August
                              7,2021
                            </p>
                          </div>
                        </div>
                        <div className="dropdown notification-dropdown">
                          <button
                            className="btn fs-10 btn-sm dropdown-toggle dropdown-caret-none transition-none"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-boundary="window"
                            aria-haspopup="true"
                            aria-expanded="false"
                            data-bs-reference="parent"
                          >
                            <span className="fas fa-ellipsis-h fs-10 text-body" />
                          </button>
                          <div className="dropdown-menu py-2">
                            <a className="dropdown-item" href="#!">
                              Mark as unread
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer p-0 border-top border-translucent border-0">
                  <div className="my-2 text-center fw-bold fs-10 text-body-tertiary text-opactity-85">
                    <a className="fw-bolder" href="pages/notifications.html">
                      Notification history
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link lh-1 pe-0"
              id="navbarDropdownUser"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <div className="avatar avatar-l ">
                <img className="rounded-circle " src={logoUser} alt />
              </div>
            </a>
            <div
              className="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border"
              aria-labelledby="navbarDropdownUser"
            >
              <div className="card position-relative border-0">
                <div className="card-body p-0">
                  <div className="text-center pt-4 pb-3">
                    <div className="avatar avatar-xl ">
                      <img className="rounded-circle " src={logoUser} alt />
                    </div>
                    <h6 className="mt-2 text-body-emphasis">Jerry Seinfield</h6>
                  </div>
                  <div className="mb-3 mx-3">
                    <input
                      className="form-control form-control-sm"
                      id="statusUpdateInput"
                      type="text"
                      placeholder="Update your status"
                    />
                  </div>
                </div>
                <div
                  className="overflow-auto scrollbar"
                  style={{ height: "10rem" }}
                >
                  <ul className="nav d-flex flex-column mb-2 pb-1">
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        {" "}
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="user"
                        />
                        <span>Profile</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="pie-chart"
                        />
                        Dashboard
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        {" "}
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="lock"
                        />
                        Posts &amp; Activity
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        {" "}
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="settings"
                        />
                        Settings &amp; Privacy{" "}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        {" "}
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="help-circle"
                        />
                        Help Center
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        {" "}
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="globe"
                        />
                        Language
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="card-footer p-0 border-top border-translucent">
                  <ul className="nav d-flex flex-column my-3">
                    <li className="nav-item">
                      <a className="nav-link px-3 d-block" href="#!">
                        {" "}
                        <span
                          className="me-2 text-body align-bottom"
                          data-feather="user-plus"
                        />
                        Add another account
                      </a>
                    </li>
                  </ul>
                  <hr />
                  <div className="px-3">
                    {" "}
                    <a
                      className="btn btn-phoenix-secondary d-flex flex-center w-100"
                      href="#!"
                    >
                      {" "}
                      <span className="me-2" data-feather="log-out">
                        {" "}
                      </span>
                      Sign out
                    </a>
                  </div>
                  <div className="my-2 text-center fw-bold fs-10 text-body-quaternary">
                    <a className="text-body-quaternary me-1" href="#!">
                      Privacy policy
                    </a>
                    •
                    <a className="text-body-quaternary mx-1" href="#!">
                      Terms
                    </a>
                    •
                    <a className="text-body-quaternary ms-1" href="#!">
                      Cookies
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
