$(document).ready(function() {
    const allowedUpdate = isUpdateAllowed(114);

    // ----- GLOBAL VARIABLES -----
    let contractAppraisalFilename   = [], contractAppraisalFiles   = [];
    let employeeMemorandaFilename   = [], employeeMemorandaFiles   = [];
    let trainingDevelopmentFilename = [], trainingDevelopmentFiles = [];
    let othersFilename              = [], othersFiles              = [];

    const statusStyle = (status) => {
        if (status == "0") {
            return `<span class="badge badge-outline-danger" style="width: 100% !important">Resigned</span>`;
        } else if (status == "1") {
            return `<span class="badge badge-outline-success" style="width: 100% !important">Active</span>`;
        } else if (status == "2") {
            return `<span class="badge badge-outline-primary" style="width: 100% !important">Probationary</span>`;
        } else if (status == "3") {
            return `<span class="badge badge-outline-danger" style="width: 100% !important">AWOL</span>`;
        } else if (status == "4") {
            return `<span class="badge badge-outline-info" style="width: 100% !important">Retired</span>`;
        } else if (status == "5") {
            return `<span class="badge badge-outline-warning" style="width: 100% !important">Suspended</span>`;
        } else if (status == "6") {
            return `<span class="badge badge-outline-danger" style="width: 100% !important">Terminated</span>`;
        } else {
            return `<span class="badge badge-info" style="width: 100% !important">Rendering</span>`;
        }
    }

    let systemSetting = getTableData(`gen_system_setting_tbl`);
    // ----- END GLOBAL VARIABLES -----


    // ----- CHANGE LEAVE BALANCE WHEN RESIZING -----
    $( window ).resize(function() {
        const width = $(window).width();
        if (width < 1200) {
            $(`[href="#leave-balance-tab"]`).text("Leave");
        } else {
            $(`[href="#leave-balance-tab"]`).text("Leave Balance");
        }
    });
    // ----- END CHANGE LEAVE BALANCE WHEN RESIZING -----


    // ----- HIDE THE UPLOAD DOCUMENT FOR NON-HR DESIGNATION -----
    const getDesignationName = getTableData("hris_designation_tbl", "designationName", `designationID = ${sessionDesignationID}`);
    function isImHumanResource() {
        if (getDesignationName.length > 0) {
            let { designationName:designation } = getDesignationName[0];
            // let designationName = designation.toLowerCase().replaceAll(" ", "");
            let designationArr = designation?.toLowerCase()?.split(' ') || [];
            if ((designationArr.length > 1 && designationArr.includes('human') && designationArr.includes('resource')) || sessionDesignationID == 1) {
                return true;
            }
            return false;
        }
        return false;
    }
    // ----- END HIDE THE UPLOAD DOCUMENT FOR NON-HR DESIGNATION -----


    // ----- DATATABLES -----
    $(document).on('click', 'a[data-toggle=tab]', function (e) {
        initDataTables();
    } );

	function initDataTables() {
		if ($.fn.DataTable.isDataTable("#tablePersonnelModule")) {
			$("#tablePersonnelModule").DataTable().destroy();
		}

		if ($.fn.DataTable.isDataTable("#tablePersonnelModule2")) {
			$("#tablePersonnelModule2").DataTable().destroy();
		}

		if ($.fn.DataTable.isDataTable("#tableLeaveBalance")) {
			$("#tableLeaveBalance").DataTable().destroy();
		}

		if ($.fn.DataTable.isDataTable("#tableSchedule")) {
			$("#tableSchedule").DataTable().destroy();
		}

		if ($.fn.DataTable.isDataTable("#tableAccessibility")) {
			$("#tableAccessibility").DataTable().destroy();
		}

		var table = $("#tablePersonnelModule")
			.css({ "min-width": "100%" })
			.removeAttr("width")
			.DataTable({
				proccessing: false,
				serverSide: false,
				scrollX: true,
				scrollCollapse: true,
                bStateSave: true,
                lengthMenu: [
					[50, 100, 150, 200, -1],
					[50, 100, 150, 200, "All"],
				],
				columnDefs: [
					{ targets: 0, width: 50  },
					{ targets: 1, width: 200 },
					{ targets: 2, width: 200 },
					{ targets: 3, width: 150 },
					{ targets: 4, width: 300 },
					{ targets: 5, width: 150 },
					{ targets: 6, width: 150 },
					{ targets: 7, width: 110 },
					{ targets: 8, width: 120 },
				],
			});

		var table = $("#tablePersonnelModule2")
			.css({ "min-width": "100%" })
			.removeAttr("width")
			.DataTable({
				proccessing: false,
				serverSide: false,
				scrollX: true,
				scrollCollapse: true,
                bStateSave: true,
                ordering: false,
                lengthMenu: [
					[50, 100, 150, 200, -1],
					[50, 100, 150, 200, "All"],
				],
				columnDefs: [
					{ targets: 0, width: 50  },
					{ targets: 1, width: 200 },
					{ targets: 2, width: 200 },
					{ targets: 3, width: 120 },
				],
			});


		var tableLeaveBalance = $("#tableLeaveBalance")
			.css({ "min-width": "100%" })
			.removeAttr("width")
			.DataTable({
				proccessing: false,
				serverSide: false,
				scrollX: true,
                scrollY: 500,
				scrollCollapse: true,
                paging: false,
                sorting: false,
                info: false,
				columnDefs: [
					{ targets: 0, width: "5%"  },
					{ targets: 1, width: "50%" },
					{ targets: 2, width: "15%" },
					{ targets: 3, width: "15%" },
					{ targets: 4, width: "15%" },
				],
			});


		var tableSchedule = $("#tableSchedule")
			.css({ "min-width": "100%" })
			.removeAttr("width")
			.DataTable({
				proccessing: false,
				serverSide: false,
				scrollX: true,
                scrollY: 500,
				scrollCollapse: true,
                paging: false,
                sorting: false,
                info: false,
				columnDefs: [
					{ targets: 0, width: "5%"  },
					{ targets: 1, width: "50%" },
					{ targets: 2, width: "50%" },
				],
			});


		var tableAccessibility = $("#tableAccessibility")
			.css({ "min-width": "100%" })
			.removeAttr("width")
			.DataTable({
				proccessing: false,
				serverSide: false,
				scrollX: true,
                scrollY: 500,
				scrollCollapse: true,
                paging: false,
                sorting: false,
                info: false,
				columnDefs: [
					{ targets: 0, width: "30%"  },
					{ targets: 1, width: "10%" },
					{ targets: 2, width: "10%" },
					{ targets: 3, width: "10%" },
					{ targets: 4, width: "10%" },
					{ targets: 5, width: "10%" },
					{ targets: 6, width: "10%" },
					{ targets: 7, width: "10%" },
				],
			});

        $("#tableLeaveBalance").DataTable().columns.adjust().draw();
        $("#tableAccessibility").DataTable().columns.adjust().draw();
        $("#tableSchedule").DataTable().columns.adjust().draw();
	}
	initDataTables();
	// ----- END DATATABLES -----


    // ----- GET PERSONNEL NOT IN BIOMETRICS -----
    function getPersonnelNotInBiometrics() {
        let result = [];
        $.ajax({
            method: "POST",
            url: `${base_url}/hris/employee_attendance/getEmployeeNotInDevice`,
            dataType: "json",
            async: false,
            success: function(data) {
                result = data;
            }
        })
        return result;
    }
    // ----- END GET PERSONNEL NOT IN BIOMETRICS -----


    // ----- ALERT NOTICE CONTENT -----
    function alertNoticeContent() {
        let html = "";
        const noticePersonnels = getPersonnelNotInBiometrics();
        if (noticePersonnels && noticePersonnels.length > 0) {
            html += `
            <div class="d-flex justify-content-start align-items-center mb-2" id="dropdown_notice" show="true" style="cursor: pointer;">
                <i class="fad fa-caret-up mr-3"></i><div class="w-100 border-top"></div>
            </div>
            <div id="notice_content">`;
            noticePersonnels.map(emp => {
                const { employeeID = 0, employeeFirstname = "", employeeLastname = "" } = emp;
                if (employeeID != 1) {
                    const fullname = `${employeeFirstname} ${employeeLastname}`;
                    html += `
                    <div class="alert alert-warning alert-dismissible fade show w-100 mb-1" role="alert">
                        <div class="d-flex justify-content-start align-items-center">
                            <div class="font-weight-bold text-danger pr-2"><i class="fas fa-exclamation"></i> NOTICE:</div>
                            <div>
                                <span class="font-weight-bold">${fullname}</span> is not yet synced on the biometrics.
                            </div>
                        </div>
                        <button type="button" class="close alert-notice" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                }
            });
            html += `</div>`;
        }

        setTimeout(() => {
            $("#alert_notice_content").html(html);
        }, 500);
    }
    // ----- END ALERT NOTICE CONTENT -----


	// ----- TABLE CONTENT -----
	function organicTableContent() {
		preventRefresh(false);

		// Reset the unique datas
		uniqueData = [];

        $("#table_content").html(preloader);

        const employeeListData = getTableData(
            `hris_employee_list_tbl
                LEFT JOIN hris_department_tbl USING(departmentID)
                LEFT JOIN hris_designation_tbl USING(designationID)`,
            `employeeID, 
            employeeCode,
            employeeProfile,
            employeeUsername,
            employeeEmail,
            CONCAT(employeeFirstname, ' ', employeeLastname) AS fullname,
            employeeUnit, employeeBuilding, employeeStreet, employeeSubdivision, employeeBarangay, employeeProvince, employeeCity, employeeRegion, employeeCountry, employeeZipCode,
            employeeMobile,
            employeeEmail,
            employeeHiredDate,
            departmentName,
            designationName,
            employeeHourlyRate,
            employeeStatus,
            hris_employee_list_tbl.createdAt AS createdAt`,
            `isNonOrganic = 0 AND employeeID <> 1`
        );

		let html = `
        <table class="table table-bordered table-striped table-hover" id="tablePersonnelModule">
            <thead>
                <tr style="white-space:nowrap">
                    <th>Personnel Code</th>
                    <th>Full Name</th>
                    <th>Designation</th>
                    <th>Hourly Rate</th>
                    <th>Address</th>
                    <th>Mobile No.</th>
                    <th>Email Address</th>
                    <th>Hired Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>`;

        employeeListData.map((employee, index) => {

            let {
                employeeID,
                employeeCode,
                fullname,
                employeeUnit,
                employeeBuilding,
                employeeStreet,
                employeeSubdivision,
                employeeBarangay,
                employeeProvince,
                employeeCity,
                employeeRegion,
                employeeCountry,
                employeeZipCode,
                employeeMobile,
                employeeUsername,
                employeeEmail,
                employeeHiredDate,
                employeeProfile    = "default.jpg",
                departmentName     = "-",
                designationName    = "-",
                employeeHourlyRate = 0,
                employeeStatus     = 0,
                createdAt
            } = employee;

            let unique = {
                id: employeeID,
                employeeUsername,
                employeeEmail
            }
            uniqueData.push(unique);

            let profile     = employeeProfile != null ? employeeProfile : "default.jpg";
            let profilePath = `${base_url}assets/upload-files/profile-images/${profile}`;
            let profileImg  = `<img 
                src="${profilePath}"
                class="rounded rounded-circle"
                style="width: 50px;
                    height: 50px">`;
            let address = `${employeeUnit ? titleCase(employeeUnit)+", " : ""}${titleCase(employeeBuilding) +" "}${titleCase(employeeStreet)+", "}${titleCase(employeeSubdivision)+", "}${titleCase(employeeBarangay)+", "}${titleCase(employeeCity)+", "}${titleCase(employeeProvince)+", "}${titleCase(employeeCountry)+", "}${titleCase(employeeZipCode)}`;

            html += `
            <tr class="btnEdit" id="${encryptString(employeeID)}">
                <td>${employeeCode}</td>
                <td>
                    <div class="d-flex justify-content-start align-items-center">
                        ${profileImg} 
                        <span class="ml-2">${fullname}<span>
                    </div>    
                </td>
                <td>
                    <div>
                        ${designationName || '-'}
                    </div>
                    <small style="color:#848482;">${departmentName || '-'}</small>
                </td>
                <td class="text-right font-weight-bold">${formatAmount(employeeHourlyRate, true)}</td>
                <td>${address}</td>
                <td>${employeeMobile}</td>
                <td>${employeeEmail}</td>
                <td>${moment(employeeHiredDate).format("MMMM DD, YYYY")}</td>
                <td>${statusStyle(employeeStatus)}</td>
            </tr>`
        })

        html += `
            </tbody>
        </table>`;

        setTimeout(() => {
            $("#table_content").html(html);
            initDataTables();
        }, 500);
	}
	// ----- END TABLE CONTENT -----


    // ----- NON-ORGANIC TABLE CONTENT -----
    function nonOrganicTableContent() {
        preventRefresh(false);

		// Reset the unique datas
		uniqueData = [];

        $("#table_content").html(preloader);

        const employeeListData = getTableData(
            `hris_employee_list_tbl
                LEFT JOIN hris_department_tbl USING(departmentID)
                LEFT JOIN hris_designation_tbl USING(designationID)`,
            `employeeID, 
            employeeCode,
            employeeProfile,
            employeeFirstname,
            employeeMiddlename,
            employeeLastname,
            departmentName,
            designationName,
            employeeStatus,
            hris_employee_list_tbl.createdAt AS createdAt`,
            `isNonOrganic = 1 AND employeeID <> 0`
        );

		let html = `
        <table class="table table-bordered table-striped table-hover" id="tablePersonnelModule2">
            <thead>
                <tr style="white-space:nowrap">
                    <th>Personnel Code</th>
                    <th>Full Name</th>
                    <th>Designation</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>`;

        employeeListData.map((employee, index) => {

            let {
                employeeID,
                employeeCode,
                employeeFirstname,
                employeeMiddlename,
                employeeLastname,
                departmentName  = "-",
                designationName = "-",
                employeeStatus  = 0,
                createdAt
            } = employee;

            let unique = {
                multiple: {
                    id: employeeID,
                    employeeFirstname,
                    employeeMiddlename,
                    employeeLastname,
                },
            }
            uniqueData.push(unique);

            let profilePath = `${base_url}assets/upload-files/profile-images/default.jpg`;
            let profileImg  = `<img 
                src="${profilePath}"
                class="rounded rounded-circle"
                style="width: 50px;
                    height: 50px">`;
            let fullname = `${employeeFirstname ? employeeFirstname+" " : ""}${employeeMiddlename ? employeeMiddlename+" " : ""}${employeeLastname ? employeeLastname+" " : ""}`

            html += `
            <tr class="btnEdit" id="${encryptString(employeeID)}">
                <td>${employeeCode}</td>
                <td>
                    <div class="d-flex justify-content-start align-items-center">
                        ${profileImg} 
                        <span class="ml-2">${fullname}<span>        
                    </div>
                </td>
                <td>
                    <div>
                        ${designationName || '-'}
                    </div>
                    <small style="color:#848482;">${departmentName || '-'}</small>
                </td>
                <td>${statusStyle(employeeStatus)}</td>
            </tr>`
        })

        html += `
            </tbody>
        </table>`;

        setTimeout(() => {
            $("#table_content").html(html);
            initDataTables();
        }, 500);
    }
    // ----- END NON-ORGANIC TABLE CONTENT -----


    // ----- PAGE CONTENT -----
    function pageContent() {
        let html = `
        <div id="alert_notice_content"></div>
        <div class="table-responsive mt-4" id="table_content"></div>`;
        $("#page_content").html(html);
        organicTableContent();
        alertNoticeContent();
    }
    pageContent();
    // ----- END PAGE CONTENT -----


    // ----- CIVIL STATUS OPTIONS -----
    function civilStatusOptions(civilstatus = null) {
        let options = ["Single", "Married", "Widowed", "Divorced", "Separated"];
        return options.map(option => {
            return `
            <option 
                value="${option}"
                ${option == civilstatus.trim() ? "selected" : ""}>
                ${option}
            </option>`;
        }).join("");
    }
    // ----- END CIVIL STATUS OPTIONS -----


    // ----- CITIZENSHIP OPTIONS -----
    const citizenshipList = function() {
		let result = [];
		$.ajax({
			method: "GET",
			url: `${base_url}assets/json/countries.json`,
			async: false,
			dataType: "json",
			success: function (data) {
				result = data;
			},
		});
		return result;
	}();

    function citizenshipOptions(nationality = null) {
        return citizenshipList.map(citizenship => {
            return `
            <option 
                value="${citizenship.nationality}" 
                ${citizenship.nationality == nationality ? "selected" : ""}>
                ${citizenship.nationality}
            </option>`
        })
    }
    // ----- END CITIZENSHIP OPTIONS -----


    // ----- REMOVE ALERT NOTICE -----
    $(document).on("click", `.alert-notice`, function() {
        setTimeout(() => {
            let hasContent = $("#notice_content").text().trim().length > 0;
            if (!hasContent) {
                $("#alert_notice_content").empty();
            }
        }, 1000);
    })
    // ----- END REMOVE ALERT NOTICE -----


    // ----- DROPDOWN NOTICE -----
    $(document).on("click", `#dropdown_notice`, function() {
        const show = $(this).attr("show") == "true";
        if (show) {
            $(this).find('i').removeClass("fa-caret-up").addClass("fa-caret-down");
            $(this).attr("show", "false");
        } else {
            $(this).find('i').removeClass("fa-caret-down").addClass("fa-caret-up");
            $(this).attr("show", "true");
        }
        $(`#notice_content`).toggle(500);
    })
    // ----- END DROPDOWN NOTICE -----


    // ----- CHANGE GENDER -----
    $(document).on("change", "[name=employeeGender]", function() {
        const gender = $(this).val();
        if (gender != "Male" && gender != "Female") {
            $("[name=employeeOtherGender]").removeAttr("disabled");
            $("[name=employeeOtherGender]").attr("required", "true");
            $("[name=employeeOtherGender]").focus();
        } else {
            $("[name=employeeOtherGender]").removeClass("is-invalid").removeClass("is-valid");
            $("[name=employeeOtherGender]").parent().find(".invalid-feedback").text("");
            $("[name=employeeOtherGender]").attr("disabled", "true");
            $("[name=employeeOtherGender]").removeAttr("required");
            $("[name=employeeOtherGender]").val('');
        }
    })
    // ----- END CHANGE GENDER -----


    // ----- PHILIPPINE ADDRESSES -----
    const address = function() {
		let result = [];
		$.ajax({
			method: "GET",
			url: `${base_url}assets/json/ph-address.json`,
			async: false,
			dataType: "json",
			success: function (data) {
				result = data;
			},
		});
		return result;
	}();
    // ----- END PHILIPPINE ADDRESSES -----


    // ----- REGION OPTIONS -----
    const phRegion = [
		{ key: "01",    name: "REGION I"    },
		{ key: "02",    name: "REGION II"   },
		{ key: "03",    name: "REGION III"  },
		{ key: "4A",    name: "REGION IV-A" },
		{ key: "4B",    name: "REGION IV-B" },
		{ key: "05",    name: "REGION V"    },
		{ key: "06",    name: "REGION VI"   },
		{ key: "07",    name: "REGION VII"  },
		{ key: "08",    name: "REGION VIII" },
		{ key: "09",    name: "REGION IX"   },
		{ key: "10",    name: "REGION X"    },
		{ key: "11",    name: "REGION XI"   },
		{ key: "12",    name: "REGION XII"  },
		{ key: "13",    name: "REGION XIII" },
		{ key: "BARMM", name: "BARMM"       },
		{ key: "CAR",   name: "CAR"         },
		{ key: "NCR",   name: "NCR"         },
	];

    function regionOptions(regionKey = null) {
		let html = phRegion.map((region) => {
			return `
            <option 
                value="${region.key}" 
                ${regionKey == region.key ? "selected" : ""}>
                ${region.name}
            </option>`;
		});
        return html.join("");
    }

    $(document).on("change", "[name=employeeRegion]", function () {
		const region = $(this).val();

		if (region) {
			const provinceOptionsHTML = provinceOptions(false, region);
			$("[name=employeeProvince]").html(provinceOptionsHTML);
		} else {
			const provinceOptionsHTML = provinceOptions(false, "", true);
			$("[name=employeeProvince]").html(provinceOptionsHTML);
		}

		const cityOptionsHTML = cityOptions(false, "", "", true);
		$("[name=employeeCity]").html(cityOptionsHTML);

		const barangayOptionsHTML = barangayOptions(false, "", "", "", true);
		$("[name=employeeBarangay]").html(barangayOptionsHTML);
	});
    // ----- END REGION OPTIONS -----


    // ----- PROVINCE OPTIONS -----
    function provinceOptions(provinceKey = false, regionKey = null, doEmpty = false) {
		let html = !provinceKey && `<option value="" selected>Select Province</option>`;
		if (!doEmpty) {
			const provinceList = regionKey && Object.keys(address[regionKey].province_list);
			provinceList &&
				provinceList.map((item) => {
					html += `
                    <option 
                        value="${item}" 
                        ${provinceKey == item && "selected"}>
                        ${item}
                    </option>`;
				});
		}
		return html;
    }

    $(document).on("change", "[name=employeeProvince]", function () {
		const regionKey   = $("[name=employeeRegion]").val();
		const provinceKey = $(this).val();

		if (provinceKey) {
			const cityOptionsHTML = cityOptions(false, regionKey, provinceKey);
			$("[name=employeeCity]").html(cityOptionsHTML);
		} else {
			const cityOptionsHTML = cityOptions(false, "", "", true);
			$("[name=employeeCity]").html(cityOptionsHTML);
		}

		const barangayOptionsHTML = barangayOptions(false, "", "", "", true);
		$("[name=employeeBarangay]").html(barangayOptionsHTML);
	});
    // ----- END PROVINCE OPTIONS -----


    // ----- CITY OPTIONS -----
    function cityOptions(municipalityKey = false, regionKey = null, provinceKey = null, doEmpty = false) {
		let html = !municipalityKey && `<option value="" selected>Select City/Municipality</option>`;
		if (!doEmpty) {
			const municipalityList = regionKey && provinceKey && Object.keys(address[regionKey].province_list[provinceKey].municipality_list);
			municipalityList &&
				municipalityList.map((item) => {
					html += 
                    `<option 
                        value="${item}" 
                        ${municipalityKey == item && "selected"}>
                        ${item}
                    </option>`;
				});
		}
		return html;
    }

    $(document).on("change", "[name=employeeCity]", function () {
		const regionKey   = $("[name=employeeRegion]").val();
		const provinceKey = $("[name=employeeProvince]").val();
		const cityKey     = $(this).val();

		if (cityKey) {
			const barangayOptionsHTML = barangayOptions(false, regionKey, provinceKey, cityKey);
			$("[name=employeeBarangay]").html(barangayOptionsHTML);
		} else {
			const barangayOptionsHTML = barangayOptions(false, "", "", "", true);
			$("[name=employeeBarangay]").html(barangayOptionsHTML);
		}
	});
    // ----- END CITY OPTIONS -----


    // ----- CITY OPTIONS -----
    function barangayOptions(barangayKey = false, regionKey = null, provinceKey = null, cityKey = null, doEmpty = false) {
		let html = !barangayKey && `<option value="" selected>Select Barangay</option>`;
		if (!doEmpty) {
			const barangayList = regionKey && provinceKey && cityKey && address[regionKey].province_list[provinceKey].municipality_list[cityKey].barangay_list;
			barangayList &&
				barangayList.map((item) => {
					html += 
                    `<option 
                        value="${item}" 
                        ${barangayKey == item && "selected"}>
                        ${item}
                    </option>`;
				});
		}
		return html;
    }
    // ----- END CITY OPTIONS -----


    // ----- DEPARTMENT OPTIONS -----
    const departmentList = getTableData("hris_department_tbl", "departmentID, departmentName", "departmentStatus = 1 AND departmentID <> 1");

    function departmentOptions(id = null) {
        let html = departmentList.map(department => {
            return `
            <option
                value="${department.departmentID}"
                ${department.departmentID == id ? "selected" : ""}>
                ${department.departmentName}
            </option>`;
        });
        return html.join("");
    }

    $(document).on("change", "[name=departmentID]", function() {
        const departmentID = $(this).val();
        const designationOptionsHTML = designationOptions(null, departmentID, true);
        $("[name=designationID]").html(designationOptionsHTML);
    })
    // ----- END DEPARTMENT OPTIONS -----


    // ----- DESIGNATION OPTIONS -----
    const designationList = getTableData("hris_designation_tbl", "designationID, designationName, departmentID", "designationStatus = 1 AND designationID <> 1");

    function designationOptions(id = null, departmentID = null, display = false) {
        let html = `<option value="" selected disabled>Select Designation</option>`;
        if (display) {
            html += designationList.filter(designation => designation.departmentID == departmentID).map(designation => {
                return `
                <option
                    value="${designation.designationID}"
                    ${designation.designationID == id ? "selected" : ""}>
                    ${designation.designationName}
                </option>`;
            });
        }
        return html;
    }
    // ----- END DESIGNATION OPTIONS -----


    // ----- PERSONNEL STATUS -----
    function employeeStatuses(statusID = null) {
        let statuses = [
            { id: 0, value: "Resigned"     },
            { id: 1, value: "Active"       },
            { id: 2, value: "Probationary" },
            { id: 3, value: "AWOL"         },
            { id: 4, value: "Retired"      },
            { id: 5, value: "Suspended"    },
            { id: 6, value: "Terminated"   },
            { id: 7, value: "Rendering"    },
            // 7 - NON-ORGANIC
        ]
        return statuses.map(status => {
            return `
            <option
                value="${status.id}"
                ${status.id == statusID ? "selected" : ""}
                ${!statusID && status.id == 1 ? "selected" : ""}>
                ${status.value}
            </option>`
        })
    }
    // ----- END PERSONNEL STATUS -----


    // ----- SELECT PROFILE IMAGE -----
    function previewImage(input, defaultImage = "default.jpg") {
        if (input.files && input.files[0]) {
            const filesize = input.files[0].size/1024/1024; // Size in MB
            const filetype = input.files[0].type;
            if (filesize > 10) {
                $(input).val("");
                $('#previewImage').attr('src', `${base_url}assets/upload-files/profile-images/${defaultImage}`);
                showNotification("danger", "File size must be less than or equal to 10mb");
            } else if (filetype.indexOf("image") == -1) {
                $(input).val("");
                $('#previewImage').attr('src', `${base_url}assets/upload-files/profile-images/${defaultImage}`);
                showNotification("danger", "Invalid file type");
            } else {
                let reader = new FileReader();
                reader.onload = function(e) {
                    $('#previewImage').attr('src', e.target.result);
                }
                reader.readAsDataURL(input.files[0]); 
            }
        }

        if ($("[name=employeeProfile]").val()) {
            $("#removeProfile").removeClass("d-none").addClass("d-block");
        } else {
            $("#removeProfile").removeClass("d-block").addClass("d-none");
        }
    }

    $(document).on("change", "[name=employeeProfile]", function() {
        const defaultImage = $(this).attr("default");
        previewImage(this, defaultImage);
    })
    // ----- END SELECT PROFILE IMAGE -----


    // ----- REMOVE E-SIGNATURE -----
    $(document).on("click", `.btnRemoveSignature`, function() {
        $(`#displaySignature`).empty();
        $(`#displaySignature`).css("display", "none");
        $(`[name="employeeSignature"]`).val("");
        $(`[name="employeeSignature"]`).removeAttr("signature");
    })
    // ----- END REMOVE E-SIGNATURE -----


    // ----- SELECT E-SIGNATURE -----
    $(document).on("change", "[name=employeeSignature]", function() {
        if (this.files && this.files[0]) {
            const filesize = this.files[0].size/1024/1024; // Size in MB
            const filetype = this.files[0].type;
            const filename = this.files[0].name;
            if (filesize > 10) {
                $(this).val("");
                showNotification("danger", "File size must be less than or equal to 10mb");
            } else if (filetype.indexOf("image") == -1) {
                $(this).val("");
                showNotification("danger", "Invalid file type");
            } else {
                $(`#displaySignature`).css("display", "block");
                $(`#displaySignature`).html(displayPersonnelSignature(filename, false));
            }
        }
    })
    // ----- END SELECT E-SIGNATURE -----


    // ----- REMOVE PROFILE IMAGE -----
    $(document).on("click", "#removeProfile", function() {
        $("[name=employeeProfile]").val("");
        $(`[name="employeeProfile"]`).attr("default", "default.jpg");
        $('#previewImage').attr('src', `${base_url}assets/upload-files/profile-images/default.jpg`);

        if ($("[name=employeeProfile]").val()) {
            $("#removeProfile").removeClass("d-none").addClass("d-block");
        } else {
            $("#removeProfile").removeClass("d-block").addClass("d-none");
        }
    })
    // ----- END REMOVE PROFILE IMAGE -----

    
    // ----- DISPLAY PERSONNEL SIGNATURE -----
    function displayPersonnelSignature(employeeSignature = null, link = true) {
        let html = ``;
        if (employeeSignature && employeeSignature != null && employeeSignature != "null" && employeeSignature != "undefined") {
            let otherAttr = link ? `
            href="${base_url+"assets/upload-files/signatures/"+employeeSignature}" 
            target="_blank"` : `href="javascript:void(0)"`;
            html = `
            <div class="d-flex justify-content-start align-items-center p-0">
                <span class="btnRemoveSignature pr-2 display-image-remove"><i class="fas fa-close"></i></span>
                <a class="filename display-image-filename"
                    title="${employeeSignature}"
                    ${otherAttr}>
                    ${employeeSignature}
                </a>
			</div>`
        }
        return html;
    }
    // ----- END DISPLAY PERSONNEL SIGNATURE -----


    // ----- PERSONNEL INFORMATION TAB -----
    function employeeInformationTab(data = false) {

        let {
            employeeID          = "",
            employeeProfile     = "default.jpg",
            employeeFirstname   = "",
            employeeMiddlename  = "",
            employeeLastname    = "",
            employeeBirthday    = "",
            employeeGender      = "",
            employeeCitizenship = "",
            employeeCivilStatus = "",
            employeeHiredDate   = "",
            employeeRegion      = "",
            employeeProvince    = "",
            employeeCity        = "",
            employeeBarangay    = "",
            employeeUnit        = "",
            employeeBuilding    = "",
            employeeStreet      = "",
            employeeSubdivision = "",
            employeeCountry     = "",
            employeeZipCode     = "",
            departmentID        = "",
            designationID       = "",
            employeeEmail       = "",
            employeeMobile      = "",
            employeeSignature   = "",
            employeeStatus      = "",
        } = data;

        let profile = employeeProfile != null ? employeeProfile : "default.jpg";
        const disabledHiredDate = employeeHiredDate ? "disabled" : "";
        // const disabledHiredDate = "";

        let html = `
        <div class="forms-group">
            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-12 pb-4">

                            <div class="d-flex justify-content-center flex-column align-items-center">
                                <div class="img-fluid" id="previewImageParent">
                                    <span class="${profile != "default.jpg" && allowedUpdate ? "d-block" : "d-none"}" id="removeProfile">x</span>
                                    <img class="rounded" id="previewImage" src="${base_url}assets/upload-files/profile-images/${profile}">
                                </div>
                                <div>
                                    <input 
                                        type="file"
                                        class="form-control validate"
                                        name="employeeProfile"
                                        id="employeeProfile"
                                        default="${profile}"
                                        accept=".png, .svg, .jpg, .jpeg, .gif">
                                </div>
                            </div>

                        </div>
                        <div class="col-lg-8 col-md-8 col-sm-12">
                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label>First Name <code>*</code></label>
                                        <input type="text"
                                            class="form-control validate"
                                            name="employeeFirstname"
                                            id="employeeFirstname"
                                            data-allowcharacters="[a-z][A-Z][.][,][-]['][ ]"
                                            minlength="2"
                                            maxlength="75"
                                            autocomplete="off"
                                            required
                                            value="${employeeFirstname}">
                                        <div class="invalid-feedback d-block" id="invalid-employeeFirstname"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label>Middle Name</label>
                                        <input type="text"
                                            class="form-control validate"
                                            name="employeeMiddlename"
                                            id="employeeMiddlename"
                                            data-allowcharacters="[a-z][A-Z][.][,][-]['][ ]"
                                            minlength="2"
                                            maxlength="75"
                                            autocomplete="off"
                                            value="${employeeMiddlename ?? ""}">
                                        <div class="invalid-feedback d-block" id="invalid-employeeMiddlename"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label>Last Name <code>*</code></label>
                                        <input type="text"
                                            class="form-control validate"
                                            name="employeeLastname"
                                            id="employeeLastname"
                                            data-allowcharacters="[a-z][A-Z][.][,][-]['][ ]"
                                            minlength="2"
                                            maxlength="75"
                                            autocomplete="off"
                                            required
                                            value="${employeeLastname}">
                                        <div class="invalid-feedback d-block" id="invalid-employeeLastname"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label>Birthdate <code>*</code></label>
                                        <input type="button"
                                            class="form-control validate daterange text-left"
                                            name="employeeBirthday"
                                            id="employeeBirthday"
                                            autocomplete="off"
                                            required
                                            value="${employeeBirthday ? moment(employeeBirthday).format("MMMM DD, YYYY") : ""}">
                                        <div class="invalid-feedback d-block" id="invalid-employeeBirthday"></div>
                                    </div>
                                </div>
                                <div class="col-lg-8 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label>Gender <code>*</code></label>
                                        <div class="d-flex align-items-center">
                                            <div style="flex: 1">
                                                <input type="radio" value="Female" name="employeeGender" ${employeeGender ? (employeeGender == "Female" ? "checked" : "") : "checked"}> <span>Female</span>
                                            </div>
                                            <div class="px-2" style="flex: 1">
                                                <input type="radio" value="Male" name="employeeGender" ${employeeGender == "Male" ? "checked" : ""}> <span>Male</span>
                                            </div>
                                            <div class="d-flex" style="flex: 3">
                                                <div class="d-flex align-items-center pr-2">
                                                    <input type="radio" value="Others" name="employeeGender" ${employeeGender ? (employeeGender != "Male" && employeeGender != "Female" ? "checked" : "") : ""}> <span class="ml-2">Others</span>
                                                </div>
                                                <div class="form-group mb-0">
                                                    <input 
                                                        type="text" 
                                                        class="form-control validate ml-2" 
                                                        placeholder="Please Specify" name="employeeOtherGender"
                                                        id="employeeOtherGender"
                                                        data-allowcharacters="[a-z][A-Z][ ]"
                                                        minlength="2"
                                                        maxlength="50"
                                                        ${employeeGender ? (employeeGender == "Male" || employeeGender == "Female" ? "disabled" : "") : "disabled"}
                                                        value="${employeeGender == "Male" || employeeGender == "Female" ? "" : employeeGender}">
                                                    <div class="invalid-feedback" id="invalid-employeeOtherGender"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="invalid-feedback d-block" id="invalid-employeeGender"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label>Citizenship <code>*</code></label>
                                        <select class="form-control validate select2"
                                            style="width: 100%"
                                            name="employeeCitizenship"
                                            id="employeeCitizenship"
                                            required>
                                            <option value="" selected disabled>Select Citizenship</option>
                                            ${citizenshipOptions(employeeCitizenship)}
                                        </select>
                                        <div class="invalid-feedback d-block" id="invalid-employeeCitizenship"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-12">
                                    <div class="form-group">
                                        <label>Civil Status <code>*</code></label>
                                        <select class="form-control validate select2"
                                            style="width: 100%"
                                            name="employeeCivilStatus"
                                            id="employeeCivilStatus"
                                            required>
                                            <option value="" selected disabled>Select Civil Status</option>
                                            ${civilStatusOptions(employeeCivilStatus)}
                                        </select>
                                        <div class="invalid-feedback d-block" id="invalid-employeeLastname"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label>Hired Date <code>*</code></label>
                                        <input type="button"
                                            class="form-control validate daterange text-left"
                                            name="employeeHiredDate"
                                            id="employeeHiredDate"
                                            autocomplete="off"
                                            required
                                            value="${employeeHiredDate ? moment(employeeHiredDate).format("MMMM DD, YYYY") : ""}"
                                            ${disabledHiredDate}>
                                        <div class="invalid-feedback d-block" id="invalid-employeeHiredDate"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Unit No.</label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeUnit"
                            id="employeeUnit"
                            data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][ ]"
                            minlength="1"
                            maxlength="10"
                            autocomplete="off"
                            value="${employeeUnit ?? ""}">
                        <div class="invalid-feedback d-block" id="invalid-employeeUnit"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Building/House No. <code>*</code></label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeBuilding"
                            id="employeeBuilding"
                            data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][ ]"
                            minlength="2"
                            maxlength="75"
                            autocomplete="off"
                            required
                            value="${employeeBuilding}">
                        <div class="invalid-feedback d-block" id="invalid-employeeBuilding"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Street Name <code>*</code></label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeStreet"
                            id="employeeStreet"
                            data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][ ]"
                            minlength="2"
                            maxlength="75"
                            autocomplete="off"
                            required
                            value="${employeeStreet}">
                        <div class="invalid-feedback d-block" id="invalid-employeeStreet"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Subdivision Name <code>*</code></label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeSubdivision"
                            id="employeeSubdivision"
                            data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][ ]"
                            minlength="2"
                            maxlength="75"
                            autocomplete="off"
                            required
                            value="${employeeSubdivision}">
                        <div class="invalid-feedback d-block" id="invalid-employeeSubdivision"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Region <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="employeeRegion"
                            id="employeeRegion"
                            required>
                            <option value="" selected disabled>Select Region</option>
                            ${regionOptions(employeeRegion)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-employeeRegion"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Province <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="employeeProvince"
                            id="employeeProvince"
                            required>
                            ${provinceOptions(employeeProvince, employeeRegion)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-employeeProvince"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>City/Municipality <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="employeeCity"
                            id="employeeCity"
                            required>
                            ${cityOptions(employeeCity, employeeRegion, employeeProvince)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-employeeCity"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Barangay <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="employeeBarangay"
                            id="employeeBarangay"
                            required>
                            ${barangayOptions(employeeBarangay, employeeRegion, employeeProvince, employeeCity)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-employeeBarangay"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Country <code>*</code></label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeCountry"
                            id="employeeCountry"
                            data-allowcharacters="[a-z][A-Z][.][,][-][()]['][ ]"
                            minlength="2"
                            maxlength="75"
                            autocomplete="off"
                            required
                            value="${employeeCountry}">
                        <div class="invalid-feedback d-block" id="invalid-employeeCountry"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Zip Code <code>*</code></label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeZipCode"
                            id="employeeZipCode"
                            data-allowcharacters="[0-9]"
                            minlength="4"
                            maxlength="4"
                            autocomplete="off"
                            required
                            value="${employeeZipCode}">
                        <div class="invalid-feedback d-block" id="invalid-employeeZipCode"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Department <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="departmentID"
                            id="departmentID"
                            required>
                            <option value="" selected disabled>Select Department</option>
                            ${departmentOptions(departmentID)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-departmentID"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Designation <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="designationID"
                            id="designationID"
                            required>
                            ${designationOptions(designationID, departmentID, true)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-designationID"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Signature</label>
                        <input type="file"
                            class="form-control validate"
                            name="employeeSignature"
                            id="employeeSignature"
                            signature="${employeeSignature}"
                            accept="image/*">
                        <div class="invalid-feedback d-block" id="invalid-employeeSignature"></div>
                        <div class="signature display-image" id="displaySignature" style="display: ${employeeSignature && employeeSignature != "null" && employeeSignature != "undefined" ? "block" : "none"}">
                            ${displayPersonnelSignature(employeeSignature)}
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Email Address <code>*</code></label>
                        <input type="email"
                            class="form-control validate"
                            data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][/][@][_]"
                            minlength="2"
                            maxlength="100"
                            name="employeeEmail"
                            id="employeeEmail"
                            autocomplete="off"
                            placeholder="sample@email.com"
                            required
                            unique="${employeeID}"
                            title="Email"
                            value="${employeeEmail}">
                        <div class="invalid-feedback d-block" id="invalid-employeeEmail"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Mobile No. <code>*</code></label>
                        <input type="text"
                            class="form-control inputmask"
                            mask="0\\999-999-9999"
                            data-allowcharacters="[0-9]"
                            minlength="13"
                            maxlength="13"
                            name="employeeMobile"
                            id="employeeMobile"
                            autocomplete="off"
                            required
                            value="${employeeMobile}">
                        <div class="invalid-feedback d-block" id="invalid-employeeMobile"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="form-group">
                        <label>Status <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="employeeStatus"
                            id="employeeStatus"
                            employeeID="${employeeID}">
                            ${employeeStatuses(employeeStatus)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-employeeStatus"></div>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL INFORMATION TAB -----


    // ----- CONFIRM PASSWORD -----
    function comparePassword() {
        const password        = $("[name=employeePassword]").val();
        const confirmPassword = $("[name=employeeConfirmPassword]").val();
        const validated = $("[name=employeeConfirmPassword]").hasClass("validated");
        if (password.length > 0) {
            if (password == confirmPassword) {
                $("#invalid-employeeConfirmPassword").text("");
                if (validated) {
                    $("[name=employeeConfirmPassword]").removeClass("is-invalid").addClass("is-valid");
                } else {
                    $("[name=employeeConfirmPassword]").removeClass("is-valid").removeClass("is-invalid");
                }
            } else {
                $("#employeeConfirmPassword").removeClass("is-valid").addClass("is-invalid");
                $("#invalid-employeeConfirmPassword").text("The password does not match.");
            }
        }
    }

    $(document).on("keyup", "[name=employeeConfirmPassword]", function() {
        comparePassword();
    })
    // ----- END CONFIRM PASSWORD -----


    // ----- TOGGLE PASSWORD -----
    $(document).on("click", ".btnTogglePassword", function() {
        const show = $(this).children().first().hasClass("fas fa-eye");
        if (show) {
            $(this).children().first().removeClass("fas fa-eye").addClass("fas fa-eye-slash");
            $(this).closest(".input-group").find("[type=password]").first().attr("type", "text");
        } else {
            $(this).children().first().removeClass("fas fa-eye-slash").addClass("fas fa-eye");
            $(this).closest(".input-group").find("[type=text]").first().attr("type", "password");
        }
    })
    // ----- END TOGGLE PASSWORD -----


    // ----- PERSONNEL ACCOUNT TAB -----
    function employeeAccountTab(data = false) {

        let {
            employeeID       = "",
            employeeUsername = "",
            employeePassword = "",
        } = data;

        let html = `
        <div class="forms-group">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label>Username <code>*</code></label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">
                                <i class="fas fa-user"></i></span>
                            </div>
                            <input type="text"
                                class="form-control validate"
                                name="employeeUsername"
                                id="employeeUsername"
                                data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][/][@][_][ ]"
                                minlength="2"
                                maxlength="75"
                                required
                                unique="${employeeID}"
                                title="Username"
                                value="${employeeUsername}">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeeUsername"></div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label>Password <code>*</code></label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">
                                <i class="fas fa-lock"></i></span>
                            </div>
                            <input type="password"
                                class="form-control validate"
                                name="employeePassword"
                                id="employeePassword"
                                data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][/][@][_][ ]"
                                minlength="2"
                                maxlength="75"
                                required
                                value="${employeePassword}">
                            <div class="input-group-prepend bg-transparent">
                                <span class="input-group-text bg-transparent border-left-0">
                                    <a href="javascript: void(0)" class="btnTogglePassword" show="false" tabindex="-1"><i class="text-primary fas fa-eye"></i></a>
                                </span>
                            </div>
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeePassword"></div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label>Confirm Password <code>*</code></label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">
                                <i class="fas fa-lock"></i></span>
                            </div>
                            <input type="password"
                                class="form-control"
                                name="employeeConfirmPassword"
                                id="employeeConfirmPassword"
                                data-allowcharacters="[a-z][A-Z][0-9][.][,][-][()]['][/][@][_][ ]"
                                minlength="2"
                                maxlength="75"
                                required
                                value="${employeePassword}">
                            <div class="input-group-prepend bg-transparent">
                                <span class="input-group-text bg-transparent border-left-0">
                                    <a href="javascript: void(0)" class="btnTogglePassword" show="false" tabindex="-1"><i class="text-primary fas fa-eye"></i></a>
                                </span>
                            </div>
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeeConfirmPassword"></div>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL ACCOUNT TAB -----


    // ----- BANK NAME OPTIONS -----
    const bankList = getTableData("fms_bank_tbl", "bankID, bankName, bankNumber", "bankStatus = 1");

    function bankOptions(id = null) {
        let html = bankList.map(bank => {
            return `
            <option
                value="${bank.bankID}"
                format="${bank.bankNumber}"
                ${bank.bankID == id ? "selected" : ""}>
                ${bank.bankName}
            </option>`;
        });
        return html.join("");
    }

    function applyBankFormat(format = null) {
		if (format) {
			let numbers   = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
			let formatArr = format.split("");
			let newFormat = formatArr.map(char => {
				return numbers.includes(String(char)) ? "9" : char;
			})
			return newFormat.join("");
		}
		return "";
	}

    $(document).on("change", "[name=bankID]", function() {
		$(`[name="employeeBankAccountNo"]`).val("");
		const format = $('option:selected', this).attr("format");
		const newFormat = applyBankFormat(format);
		$("[name=employeeBankAccountNo]").attr("mask", newFormat);
		$("[name=employeeBankAccountNo]").attr("minlength", newFormat.length);
		$("[name=employeeBankAccountNo]").attr("maxlength", newFormat.length);
        $(`[name="employeeBankAccountName"], [name="employeeBankAccountNo"]`).removeAttr("disabled");
		initInputmask("employeeBankAccountNo");
	})
    // ----- END BANK NAME OPTIONS -----


    // ----- CHANGE BASIC SALARY -----
    $(document).on("keyup", "[name=employeeBasicSalary]", function() {
        const workingDays = +$(this).attr("workingDays");
        const salary      = +$(this).val().replaceAll(",", "");
        const dailyRate   = salary / (workingDays == 6 ? 26 : 22);
        const hourlyRate  = dailyRate / 8;
        $("[name=employeeDailyRate]").val(dailyRate.toFixed(2));
        $("[name=employeeHourlyRate]").val(hourlyRate.toFixed(2));
    })
    // ----- END CHANGE BASIC SALARY -----


    // ----- PERSONNEL PAYROLL TAB -----
    function employeePayrollTab(data = false) {

        let {
            employeeBasicSalary     = "",
            employeeDailyRate       = "",
            employeeHourlyRate      = "",
            employeeAllowance       = "",
            bankID                  = "",
            employeeBankAccountName = "",
            employeeBankAccountNo   = "",
            employeeTIN             = "",
            employeeSSS             = "",
            employeePhilHealth      = "",
            employeePagibig         = "",
        } = data;

        let workingDays = (systemSetting && systemSetting.length ? systemSetting.filter(stg => stg.workingDays)?.[0]?.workingDays : 5) || 5;

        let html = `
        <div class="forms-group">
            <div class="row">
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>Basic Salary <code>*</code></label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">₱</span>
                            </div>
                            <input type="text"
                                class="form-control amount"
                                name="employeeBasicSalary"
                                id="employeeBasicSalary"
                                min="0"
                                max="9999999999"
                                workingDays="${workingDays}"
                                required
                                value="${employeeBasicSalary}">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeeBasicSalary"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>Daily Rate</label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                                <span class="input-group-text bg-transparent border-right-0">₱</span>
                            </div>
                            <input type="text"
                                class="form-control amount"
                                name="employeeDailyRate"
                                id="employeeDailyRate"
                                min="0"
                                max="9999999999"
                                disabled
                                value="${employeeDailyRate}">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeeDailyRate"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>Hourly Rate</label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                                <span class="input-group-text bg-transparent border-right-0">₱</span>
                            </div>
                            <input type="text"
                                class="form-control amount"
                                name="employeeHourlyRate"
                                id="employeeHourlyRate"
                                min="0"
                                max="9999999999"
                                disabled
                                value="${employeeHourlyRate}">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeeHourlyRate"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>Allowance</label>
                        <div class="input-group">
                            <div class="input-group-prepend bg-transparent">
                            <span class="input-group-text bg-transparent border-right-0">₱</span>
                            </div>
                            <input type="text"
                                class="form-control amount"
                                name="employeeAllowance"
                                id="employeeAllowance"
                                min="0"
                                max="9999999999"
                                value="${employeeAllowance}">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-employeeAllowance"></div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="form-group">
                        <label>Bank Name</label>
                        <select class="form-control select2 validate"
                            style="width: 100%"
                            name="bankID"
                            id="bankID">
                            <option value="" selected disabled>Select Bank Name</option>
                            ${bankOptions(bankID)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-bankID"></div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="form-group">
                        <label>Bank Account Name</label>
                        <input type="text"
                            class="form-control validate"
                            name="employeeBankAccountName"
                            id="employeeBankAccountName"
                            data-allowcharacters="[a-z][A-Z][.][,][-][ ]"
                            minlength="2"
                            maxlength="50"
                            value="${employeeBankAccountName ?? ""}"
                            ${bankID ? "" : "disabled"}>
                        <div class="invalid-feedback d-block" id="invalid-employeeBankAccountName"></div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="form-group">
                        <label>Bank Account No.</label>
                        <input type="text"
                            class="form-control inputmask"
                            name="employeeBankAccountNo"
                            id="employeeBankAccountNo"
                            data-allowcharacters="[0-9]"
                            minlength="2"
                            maxlength="50"
                            value="${employeeBankAccountNo}"
                            ${bankID ? "" : "disabled"}>
                        <div class="invalid-feedback d-block" id="invalid-employeeBankAccountNo"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>Tax Identification No.</label>
                        <input type="text"
                            class="form-control inputmask"
                            mask="999-999-999"
                            name="employeeTIN"
                            id="employeeTIN"
                            data-allowcharacters="[0-9]"
                            minlength="11"
                            maxlength="11"
                            placeholder="000-000-000"
                            value="${employeeTIN}">
                        <div class="invalid-feedback d-block" id="invalid-employeeTIN"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>SSS No.</label>
                        <input type="text"
                            class="form-control inputmask"
                            mask="99-9999999-9"
                            name="employeeSSS"
                            id="employeeSSS"
                            data-allowcharacters="[0-9]"
                            minlength="12"
                            maxlength="12"
                            placeholder="00-0000000-0"
                            value="${employeeSSS}">
                        <div class="invalid-feedback d-block" id="invalid-employeeSSS"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>PhilHealth No.</label>
                        <input type="text"
                            class="form-control inputmask"
                            mask="99-999999999-9"
                            name="employeePhilHealth"
                            id="employeePhilHealth"
                            data-allowcharacters="[0-9]"
                            minlength="14"
                            maxlength="14"
                            placeholder="00-000000000-0"
                            value="${employeePhilHealth}">
                        <div class="invalid-feedback d-block" id="invalid-employeePhilHealth"></div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12">
                    <div class="form-group">
                        <label>Pag-IBIG MID No.</label>
                        <input type="text"
                            class="form-control inputmask"
                            mask="9999-9999-9999"
                            name="employeePagibig"
                            id="employeePagibig"
                            data-allowcharacters="[0-9]"
                            minlength="14"
                            maxlength="14"
                            placeholder="0000-0000-0000"
                            value="${employeePagibig}">
                        <div class="invalid-feedback d-block" id="invalid-employeePagibig"></div>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL PAYROLL TAB -----


    // ----- KEYUP LEAVE CREDIT -----
    $(document).on("keyup", `[name="leaveCredit"]`, function() {
        const tableRow       = $(this).closest("tr");
        const leaveCredit    = +$(this).val()?.replaceAll(",", "");
        let leaveAccumulated = tableRow.find(`[name="leaveAccumulated"]`).val()?.replaceAll(",", "");
            leaveAccumulated = leaveAccumulated == "-" ? 0 : +leaveAccumulated;
        const totalLeave       = leaveCredit + leaveAccumulated;
        tableRow.find(`[name="leaveType"]`).val(totalLeave);
    })
    // ----- END KEYUP LEAVE CREDIT -----


    // ----- PERSONNEL LEAVE BALANCE -----
    const leaveTypeList = getTableData("hris_leave_tbl", "leaveID, leaveName", "leaveStatus = 1");

    function employeeLeaveBalance(data = false) {
        
        let {
            employeeID      = "",
            employeeRanking = null
        } = data;

        let getLeaveBalance = [];
        if (data) {
            getLeaveBalance = getTableData(
                "hris_employee_leave_tbl", 
                "", 
                `employeeID = ${employeeID}`);
        }

        const leaveBalance = () => {
            let html = leaveTypeList.map((leave, index) => {
                let { leaveName, leaveID } = leave;
                let leaveCredit = 0, leaveAccumulated = 0;
                if (data) {
                    getLeaveBalance.filter(lv => lv.leaveID == leaveID).map(leave => {
                        leaveCredit      = +leave.leaveCredit;
                        leaveAccumulated = +leave.leaveAccumulated;
                    });
                }

                // const max = leaveName.toLowerCase().replaceAll(" ", "")?.trim() == "sickleave" ? 5 : 30;
                const max = 30;
                let displayLeaveAccumulated = leaveID != 1 ? "-" : leaveAccumulated.toFixed(2);

                return `
                <tr class="leaveTypeTable"
                    leaveID="${leaveID}">
                    <td>${index+1}</td>
                    <td>${leaveName}</td>
                    <td>
                        <div class="form-group">
                            <input type="text"
                                class="form-control text-center"
                                name="leaveAccumulated"
                                id="leaveAccumulated${index}"
                                leaveid="${leaveID}"
                                min="0"
                                max="${max}"
                                data-allowcharacters="[0-9]"
                                minlength="1"
                                maxlength="5"
                                value="${displayLeaveAccumulated}"
                                disabled>
                            <div class="d-block invalid-feedback" id="invalid-leaveAccumulated${index}"></div>
                        </div> 
                    </td>
                    <td>
                        <div class="form-group">
                            <input type="text"
                                class="form-control input-quantity text-center"
                                name="leaveCredit"
                                id="leaveCredit${index}"
                                leaveid="${leaveID}"
                                min="0"
                                max="${max}"
                                data-allowcharacters="[0-9]"
                                minlength="1"
                                maxlength="5"
                                value="${leaveCredit}"
                                ${leaveID == 1 || leaveID == 2 ? "disabled" : ""}>
                            <div class="d-block invalid-feedback" id="invalid-leaveCredit${index}"></div>
                        </div> 
                    </td>
                    <td>
                        <div class="form-group">
                            <input type="text"
                                class="form-control input-quantity text-center"
                                name="leaveType"
                                id="leaveType${index}"
                                leaveid="${leaveID}"
                                min="0"
                                max="${max}"
                                data-allowcharacters="[0-9]"
                                minlength="1"
                                maxlength="5"
                                value="${(leaveCredit + leaveAccumulated).toFixed(2)}"
                                disabled>
                            <div class="d-block invalid-feedback" id="invalid-leaveType${index}"></div>
                        </div> 
                    </td>
                </tr>`;
            });
            return html.join("");
        }

        const getRanking = (employeeRanking = null) => {
            let html = "<option selected disabled>Select Job Level</option>";
            let rankingOptions = [
                {
                    name:    "Rank and File",
                    balance: 5
                },
                {
                    name:    "Officer",
                    balance: 7
                },
                {
                    name:    "Managerial",
                    balance: 9
                },
                {
                    name:    "Executive",
                    balance: 11
                },
            ];
            rankingOptions.map(rank => {
                html += `<option 
                    value   = "${rank.name}" 
                    balance = "${rank.balance}"
                    ${rank.name == employeeRanking ? "selected" : ""}>${rank.name}</option>`;
            })
            return html;
        }

        let html = `
        <div class="forms-group">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label>Job Level <code>*</code></label>
                        <select class="form-control validate select2"
                            name="employeeRanking"
                            id="employeeRanking"
                            required>
                            ${getRanking(employeeRanking)}
                        </select>
                        <div class="invalid-feedback d-block" id="invalid-employeeRanking"></div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered" id="tableLeaveBalance">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Leave Type</th>
                                    <th>Accumulated</th>
                                    <th>Leave Count</th>
                                    <th>Total Leave</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${leaveBalance()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL LEAVE BALANCE -----


    // ----- SELECT SCHEDULE -----
    $(document).on("change", "[name=scheduleID]", function() {
        $("#displaySchedule").html(preloader);
        const scheduleID   = $(this).val();
        const scheduleData = displaySchedule(scheduleID);
        setTimeout(() => {
            $("#displaySchedule").html(scheduleData);
            initDataTables();
        }, 300);
    })
    // ----- END SELECT SCHEDULE -----


    // ----- PERSONNEL SCHEDULE -----
    const scheduleList = getTableData("hris_schedule_setup_tbl", "*", "scheduleStatus = 1");

    function scheduleOptions(id = null) {
        let html = scheduleList.map(schedule => {
            return `
            <option 
                value="${schedule.scheduleID}"
                ${schedule.scheduleID == id ? "selected" : ""}>
                ${schedule.scheduleName}
            </option>`;
        })
        return html.join("");
    } 

    function displaySchedule(id = null) {
        let html = "";
        
        if (id) {
            const scheduleData = scheduleList.filter(schedule => schedule.scheduleID == id).map(schedule => {
                let {
                    mondayStatus,    mondayFrom,    mondayTo,
                    tuesdayStatus,   tuesdayFrom,   tuesdayTo,
                    wednesdayStatus, wednesdayFrom, wednesdayTo,
                    thursdayStatus,  thursdayFrom,  thursdayTo,
                    fridayStatus,    fridayFrom,    fridayTo,
                    saturdayStatus,  saturdayFrom,  saturdayTo,
                    sundayStatus,    sundayFrom,    sundayTo,
                } = schedule;
                const monday    = mondayStatus    == 1 ? `${moment("2021-01-01 "+mondayFrom).format("hh:mmA")}-${moment("2021-01-01 "+mondayTo).format("hh:mmA")}` : "-";
                const tuesday   = tuesdayStatus   == 1 ? `${moment("2021-01-01 "+tuesdayFrom).format("hh:mmA")}-${moment("2021-01-01 "+tuesdayTo).format("hh:mmA")}` : "-";
                const wednesday = wednesdayStatus == 1 ? `${moment("2021-01-01 "+wednesdayFrom).format("hh:mmA")}-${moment("2021-01-01 "+wednesdayTo).format("hh:mmA")}` : "-";
                const thursday  = thursdayStatus  == 1 ? `${moment("2021-01-01 "+thursdayFrom).format("hh:mmA")}-${moment("2021-01-01 "+thursdayTo).format("hh:mmA")}` : "-";
                const friday    = fridayStatus    == 1 ? `${moment("2021-01-01 "+fridayFrom).format("hh:mmA")}-${moment("2021-01-01 "+fridayTo).format("hh:mmA")}` : "-";
                const saturday  = saturdayStatus  == 1 ? `${moment("2021-01-01 "+saturdayFrom).format("hh:mmA")}-${moment("2021-01-01 "+saturdayTo).format("hh:mmA")}` : "-";
                const sunday    = sundayStatus    == 1 ? `${moment("2021-01-01 "+sundayFrom).format("hh:mmA")}-${moment("2021-01-01 "+sundayTo).format("hh:mmA")}` : "-";

                return `
                <tr>
                    <td>1</td>
                    <td>Monday</td>
                    <td>${monday}</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Tuesday</td>
                    <td>${tuesday}</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Wednesday</td>
                    <td>${wednesday}</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Thursday</td>
                    <td>${thursday}</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Friday</td>
                    <td>${friday}</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Saturday</td>
                    <td>${saturday}</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>Sunday</td>
                    <td>${sunday}</td>
                </tr>`;
            })
            html += `
            <div class="table-responsive">
                <table class="table table-striped table-bordered" id="tableSchedule">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Day</th>
                            <th>Time-in and Time-out</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${scheduleData}
                    </tbody>
                </table>
            </div>`;
        } else {
            html += `
            <div class="d-flex flex-column align-items-center justify-content-center">
                <img src="${base_url}assets/modal/schedule.svg" heigth="300" width="300">
                <h5>Please select schedule to continue</h5>
            </div>`
        }
        return html;
    }
    

    function employeeSchedule(data = false) {
        let { scheduleID = "" } = data;

        let html = `
        <div class="forms-group">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label>Schedule <code>*</code></label>
                        <select class="form-control validate select2"
                            style="width: 100%"
                            name="scheduleID"
                            id="scheduleID"
                            required>
                            <option value="" selected disabled>Select Schedule</option>
                            ${scheduleOptions(scheduleID)}
                        </select>
                        <div class="d-block invalid-feedback" id="invalid-scheduleID"></div>
                    </div>
                    <div id="displaySchedule">${displaySchedule()}</div>
                </div>
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL SCHEDULE -----


    // ----- PERSONNEL ACCESSIBILITY -----
    const moduleList = getTableData("gen_module_list_tbl", "moduleID, moduleName", "moduleStatus = 1");

    function displayAccessibility(employeeID = null) {
        let getPersonnelAccessibility = [];
        if (employeeID) {
            getPersonnelAccessibility = getTableData(
                `hris_employee_permission_tbl`,
                "",
                `employeeID = ${employeeID}`
            );
        }

        let html = moduleList.map(module => {
            let { moduleID, moduleName } = module;

            let checked = employeeID == 1 ? "checked" : "";
            let showStatus   = checked, 
                createStatus = checked, 
                readStatus   = checked, 
                updateStatus = checked, 
                deleteStatus = checked, 
                printStatus  = checked,
                disabled     = checked;

            let defaultModule = ["88", "144", "108", "3"].includes(moduleID);

            if (employeeID) {
                getPersonnelAccessibility
                .filter(mdl => mdl.moduleID == moduleID)
                .map(mdl2 => {
                    showStatus   = mdl2.showStatus   == 1 || employeeID == 1 || defaultModule ? "checked" : "";
                    createStatus = mdl2.createStatus == 1 || employeeID == 1 || defaultModule ? "checked" : "";
                    readStatus   = mdl2.readStatus   == 1 || employeeID == 1 || defaultModule ? "checked" : "";
                    updateStatus = mdl2.updateStatus == 1 || employeeID == 1 || defaultModule ? "checked" : "";
                    deleteStatus = mdl2.deleteStatus == 1 || employeeID == 1 || defaultModule ? "checked" : "";
                    printStatus  = mdl2.printStatus  == 1 || employeeID == 1 || defaultModule ? "checked" : "";
                });

                // ----- IF THE USER IS ADMIN -----
                disabled = employeeID == 1 ? "disabled" : "";
                // ----- END IF THE USER IS ADMIN -----
            } else {
                showStatus   = defaultModule ? "checked" : "";
                createStatus = defaultModule ? "checked" : "";
                readStatus   = defaultModule ? "checked" : "";
                updateStatus = defaultModule ? "checked" : "";
                deleteStatus = defaultModule ? "checked" : "";
                printStatus  = defaultModule ? "checked" : "";
            }

            return `
            <tr class="module" moduleid="${moduleID}">
                <td>${moduleName}</td>
                <td class="text-center">
                    <input type="checkbox" name="checkall" ${disabled}>
                </td>
                <td class="text-center">
                    <input type="checkbox" name="show" moduleid="${moduleID}" ${showStatus} ${disabled}>
                </td>
                <td class="text-center">
                    <input type="checkbox" name="read" moduleid="${moduleID}" ${readStatus} ${disabled}>
                </td>
                <td class="text-center">
                    <input type="checkbox" name="create" moduleid="${moduleID}" ${createStatus} ${disabled}>
                </td>
                <td class="text-center">
                    <input type="checkbox" name="update" moduleid="${moduleID}" ${updateStatus} ${disabled}>
                </td>
                <td class="text-center">
                    <input type="checkbox" name="delete" moduleid="${moduleID}" ${deleteStatus} ${disabled}>
                </td>
                <td class="text-center">
                    <input type="checkbox" name="print" moduleid="${moduleID}" ${printStatus} ${disabled}>
                </td>
            </tr>`;
        })
        return html.join("");
    }

    function employeeAccessibility(data = false) {
        let { employeeID = "" } = data;

        let html = `
        <div class="forms-group">
            <div class="row">
                <div class="col-12">
                    <div class="table-responsive">
                        <table class="table table-striped table-bordered" id="tableAccessibility" >
                            <thead>
                                <tr>
                                    <th>Module Name</th>
                                    <th>Check All</th>
                                    <th>Show All</th>
                                    <th>View</th>
                                    <th>Add</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Print</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${displayAccessibility(employeeID)}
                            </tbody>
                        </table>
                        <div class="mt-2">
                            <b class="text-warning">NOTE: </b><span>The <i>"Show All"</i> checkbox is for viewing of all approved document for that module.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL ACCESSIBILITY -----


    // ----- UPLOAD FILE -----
    function getFileTypeDisplay(type = null, name = null, documentType = "Contract and Appraisal", employeeID = null) {
        if (type && name) {
            const displayImage = type == "image" ? "image.svg" : "file.svg";

            const title = employeeID ? `
            <a class="text-secondary pt-2 mb-0 fileLink"
                href="${base_url}assets/upload-files/documents/${name}"
                target="_blank"
                title="${name}">
                ${name}
            </a>` : `
            <p class="text-secondary pt-2 mb-0 fileLink"
                title="${name}">
                ${name}
            </p>`;

            let button = "";
            if (isImHumanResource()) {
                button = `
                <span 
                    class        = "removeDocument" 
                    key          = "${name}"
                    documentType = "${documentType}"
                    employeeID   = "${employeeID}">x</span>`;
            }

            return `
            <div class="col-lg-2 col-md-3 col-sm-4 mt-2 mb-4 document" filecontent>
                <div class="text-center">
                    ${button}
                    <img src="${base_url}/assets/modal/${displayImage}" width="50" height="50" alt="${name}">
                    ${title}
                </div>
            </div>`;
        }
        return "";
    }

    function displayFile(documentType = "Contract and Appraisal", employeeID = null, firstReload = false) {
        let documentContentID = {
            "Contract and Appraisal": {
                input:     "contractAppraisal",
                contentID: "contractAppraisalContent"
            },
            "Personnel Memoranda": {
                input:     "employeeMemoranda",
                contentID: "employeeMemorandaContent"
            },
            "Training and Development": {
                input:     "trainingDevelopment",
                contentID: "trainingDevelopmentContent"
            },
            "Others": {
                input:     "others",
                contentID: "othersContent"
            },
        };
        let html = "";

        const isHasContent = () => {
            const hasContent = $(`#${documentContentID[documentType].contentID}`).text()?.trim().length > 0;
            if (!hasContent) {

                let text = "There is no available documents yet";
                if (isImHumanResource()) {
                    text = `
                    Click <a href="javascript: void(0)" class="btnUpload" input="${documentContentID[documentType].input}" documentType="${documentType}">Upload</a> button to upload documents.`;
                }

                html = `
                <div class="col-12 text-center" files="none">
                    <img src="${base_url}assets/modal/fileupload.svg" width="200" height="200">
                    <p style="
                        font-size: 1.1rem;
                        margin-top: 10px;">
                        ${text}
                    </p>
                </div>`;
                if (!firstReload) {
                    $(`#${documentContentID[documentType].contentID}`).html(html);
                }
                return html;
            } else {
                return "";
            }
        }

        if (employeeID != null && employeeID != undefined && employeeID != "") {
            let documentData = getTableData(
                "hris_employee_documents_tbl",
                "",
                `employeeID = ${employeeID}`);
    
            if (firstReload) {
                Object.keys(documentContentID).filter(type => type == documentType).map(contentID => {
                    html += documentData.filter(document => document.documentType == contentID).map(document => {
                        const { filetype, filename } = document;

                        // ----- STORING OLD FILES -----
                        if (documentType == "Contract and Appraisal") {
                            contractAppraisalFilename.push(filename);
                        } else if (documentType == "Personnel Memoranda") {
                            employeeMemorandaFilename.push(filename);
                        } else if (documentType == "Training and Development") {
                            trainingDevelopmentFilename.push(filename);
                        } else if (documentType == "Others") {
                            othersFilename.push(filename);
                        }
                        // ----- END STORING OLD FILES -----

                        return getFileTypeDisplay(filetype, filename, contentID, employeeID);
                    }).join("");
                })
                if (html.length == 0) {
                    html = isHasContent();
                }
            } else {
                isHasContent();
            }
        } else {
            isHasContent();
        }
        return html;
    }
    

    $(document).on("click", ".removeDocument", function() {
        const documentType = $(this).attr("documentType");
        const employeeID   = $(this).attr("employeeID");
        const key          = $(this).attr("key");
        $(this).closest("[filecontent]").fadeOut(300, function() {
            $(this).remove();
            if (documentType == "Contract and Appraisal") {
                contractAppraisalFilename = contractAppraisalFilename.filter(file => file != key);
                contractAppraisalFiles    = contractAppraisalFiles.filter(file => file.name != key);
            } else if (documentType == "Personnel Memoranda") {
                employeeMemorandaFilename = employeeMemorandaFilename.filter(file => file != key);
                employeeMemorandaFiles    = employeeMemorandaFiles.filter(file => file.name != key);
            } else if (documentType == "Training and Development") {
                trainingDevelopmentFilename = trainingDevelopmentFilename.filter(file => file != key);
                trainingDevelopmentFiles    = trainingDevelopmentFiles.filter(file => file.name != key);
            } else if (documentType == "Others") {
                othersFilename = othersFilename.filter(file => file != key);
                othersFiles    = othersFiles.filter(file => file.name != key);
            }
            displayFile(documentType, employeeID);
        });
    })

    $(document).on("click", ".btnUpload", function() {
        const input        = $(this).attr("input");
        const documentType = $(this).attr("documentType");
        $(`[type=file][name=${input}]`).trigger("click");
    })

    $(document).on("change", ".uploadFile", function(e) {
        const contentID    = $(this).attr("content");
        const documentType = $(this).attr("documentType");
        const files        = this.files || false;
        if (files) {
            for (var i=0; i<files.length; i++) {
                const filesize    = files[i].size/1024/1024;
                const filenameArr = files[i].name.split(".");
                const filename    = filenameArr[0];
                const extension   = filenameArr[1];
                const filetypeArr = files[i].type.split("/");
                const filetype    = filetypeArr[0];
                if (filesize > 10) {
                    showNotification("danger", `File size must be less than or equal to 10mb`);
                } else {
                    let html = getFileTypeDisplay(filetype, filenameArr.join("."), documentType);
                    let hasContent = $(`#${contentID}`).find("[files=none]").length > 0;
                    if (hasContent) {
                        $(`#${contentID}`).html(html);
                    } else {
                        $(`#${contentID}`).append(html);
                    }

                    if (documentType == "Contract and Appraisal") {
                        contractAppraisalFilename.push(filenameArr.join("."));
                        contractAppraisalFiles.push(files[i]);
                    } else if (documentType == "Personnel Memoranda") {
                        employeeMemorandaFilename.push(filenameArr.join("."));
                        employeeMemorandaFiles.push(files[i]);
                    } else if (documentType == "Training and Development") {
                        trainingDevelopmentFilename.push(filenameArr.join("."));
                        trainingDevelopmentFiles.push(files[i]);
                    } else if (documentType == "Others") {
                        othersFilename.push(filenameArr.join("."));
                        othersFiles.push(files[i]);
                    }
                }
            }
        }
        $(this).val("");
    });
    // ----- END UPLOAD FILE -----


    // ----- CHECK ALL ACCESSIBILITY -----
    $(document).on("change", `[type="checkbox"]:not([name="checkall"])`, function() {
        $tr = $(this).closest("tr");
        let isCheckedAll = $tr.find(`[type="checkbox"]:not([name="checkall"]):checked`).length == 5;
        if (!isCheckedAll) {
            $tr.find(`[name="checkall"]`).prop("checked", false);
        }
    })

    $(document).on("change", `[name="checkall"]`, function() {
        const isChecked = this.checked;
        $tr = $(this).closest("tr");
        if (isChecked) {
            $tr.find(`[type="checkbox"]:not([name="checkall"])`).prop("checked", true);
        } else {
            $tr.find(`[type="checkbox"]:not([name="checkall"])`).prop("checked", false);
        }
    })
    // ----- END CHECK ALL ACCESSIBILITY -----


    // ----- CHANGE STATUS -----
    $(document).on("change", `[name="employeeStatus"]`, function() {
        const employeeID = $(this).attr("employeeID");
        const status     = $(this).val();
        // ----- CHANGING THE STATUS OF ADMIN -----
        if (employeeID && employeeID == 1 && status != 1) {
            showNotification("danger", "Administrator status cannot be changed!");
            $(this).val(1).trigger("change");
        }
        // ----- END CHANGING THE STATUS OF ADMIN -----
    })
    // ----- END CHANGE STATUS -----


    // ----- PERSONNEL DOCUMENTS -----
    function employeeDocuments(data = false) {
        let { employeeID = "" } = data;
        let documentTypes = [
            {
                title:     "Contract and Appraisal",   
                input:     "contractAppraisal",
                contentID: "contractAppraisalContent",
            },
            {
                title:     "Personnel Memoranda",    
                input:     "employeeMemoranda",   
                contentID: "employeeMemorandaContent",
            },
            {
                title:     "Training and Development", 
                input:     "trainingDevelopment",
                contentID: "trainingDevelopmentContent",
            },
            {
                title:     "Others",           
                input:     "others",        
                contentID: "othersContent",
            }
        ];
        let documentContent = documentTypes.map(document => {
            let { title, input, contentID } = document;

            let button = "";
            if (isImHumanResource()) {
                button = `
                <button class    = "btn btn-secondary btnUpload" 
                    input        = "${input}" 
                    documentType = "${title}" 
                    content      = "${contentID}">
                    <i class="fas fa-file-upload"></i> Upload
                </button>`;
            }

            return `
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5>${title}</h5>
                            <div>
                                <input 
                                    type="file" 
                                    class="d-none uploadFile" 
                                    name="${input}"
                                    multiple
                                    accept="image/*, .docx, .doc, .pdf, .xlsx, .xls"
                                    content="${contentID}"
                                    documentType="${title}">
                                ${button}
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row" id="${contentID}">
                            ${displayFile(title, employeeID, true)}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join("");

        let html = `
        <div class="forms-group">
            <div class="row">
                ${documentContent}
            </div>
        </div>`;
        return html;
    }
    // ----- END PERSONNEL DOCUMENTS -----


    // ----- MODAL CONTENT -----
    function modalContent(data = false, type = "organicTab") {
        contractAppraisalFilename   = [], contractAppraisalFiles   = [];
        employeeMemorandaFilename   = [], employeeMemorandaFiles   = [];
        trainingDevelopmentFilename = [], trainingDevelopmentFiles = [];
        othersFilename              = [], othersFiles              = [];

        let button = data
			? `
        <button 
            class="btn btn-update px-5 p-2" 
            id="btnUpdate" 
            redirect="${type}"
            employeeID="${encryptString(data.employeeID)}"><i class="fas fa-save"></i>
            Update
        </button>`
			: `
        <button class="btn btn-save px-5 p-2" id="btnSave" redirect="${type}"><i class="fas fa-save"></i> Save</button>`;

        let html = "";
        
        if (type == "organicTab") {
            html = `
            <div class="modal-body">
                <ul class="nav nav-tabs nav-tabs-bottom nav-justified border" id="addtabs">
                    <li class="nav-item">
                        <a class="nav-link modal-tab border active" href="#information-tab" data-toggle="tab" style="border-bottom: none;">Information</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link modal-tab border" href="#account-tab" data-toggle="tab" style="border-bottom: none;">Account</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link modal-tab border" href="#payroll-tab" data-toggle="tab" style="border-bottom: none;">Payroll</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link modal-tab border" href="#leave-balance-tab" data-toggle="tab" style="border-bottom: none;">Leave Balance</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link modal-tab border" href="#schedule-tab" data-toggle="tab" style="border-bottom: none;">Schedule</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link modal-tab border" href="#accessibility-tab" data-toggle="tab" style="border-bottom: none;">Accessibility</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link modal-tab border" href="#documents-tab" data-toggle="tab" style="border-bottom: none;">Documents</a>
                    </li>
                </ul>
                <div class="tab-content pt-4" style="min-height: 28vh;">
                    <div class="tab-pane show active" id="information-tab">
                        ${employeeInformationTab(data)}
                    </div>
                    <div class="tab-pane" id="account-tab">
                        ${employeeAccountTab(data)}
                    </div>
                    <div class="tab-pane" id="payroll-tab">
                        ${employeePayrollTab(data)}
                    </div>
                    <div class="tab-pane" id="leave-balance-tab">
                        ${employeeLeaveBalance(data)}
                    </div>
                    <div class="tab-pane" id="schedule-tab">
                        ${employeeSchedule(data)}
                    </div>
                    <div class="tab-pane" id="accessibility-tab">
                        ${employeeAccessibility(data)}
                    </div>
                    <div class="tab-pane" id="documents-tab">
                        ${employeeDocuments(data)}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${button}
                <button class="btn btn-cancel btnCancel px-5 p-2" ><i class="fas fa-ban"></i> Cancel</button>
            </div>`;
        } else {

            const {
                employeeID,
                employeeFirstname  = "", 
                employeeMiddlename = "", 
                employeeLastname   = "", 
                employeeStatus     = 0,
                departmentID,
                designationID
            } = data;

            html = `
            <div class="modal-body">
                <div class="form-group">
                    <label>First Name <code>*</code></label>
                    <input type="text"
                        class="form-control validate"
                        name="employeeFirstname"
                        id="employeeFirstname"
                        data-allowcharacters="[a-z][A-Z][.][,][-]['][ ]"
                        minlength="2"
                        maxlength="75"
                        autocomplete="off"
                        required
                        title="Personnel"
                        unique="${employeeID}"
                        value="${employeeFirstname || ""}">
                    <div class="invalid-feedback d-block" id="invalid-employeeFirstname"></div>
                </div>
                <div class="form-group">
                    <label>Middle Name</label>
                    <input type="text"
                        class="form-control validate"
                        name="employeeMiddlename"
                        id="employeeMiddlename"
                        data-allowcharacters="[a-z][A-Z][.][,][-]['][ ]"
                        minlength="2"
                        maxlength="75"
                        autocomplete="off"
                        title="Personnel"
                        unique="${employeeID}"
                        value="${employeeMiddlename || ""}">
                    <div class="invalid-feedback d-block" id="invalid-employeeMiddlename"></div>
                </div>
                <div class="form-group">
                    <label>Last Name <code>*</code></label>
                    <input type="text"
                        class="form-control validate"
                        name="employeeLastname"
                        id="employeeLastname"
                        data-allowcharacters="[a-z][A-Z][.][,][-]['][ ]"
                        minlength="2"
                        maxlength="75"
                        autocomplete="off"
                        required
                        title="Personnel"
                        unique="${employeeID}"
                        value="${employeeLastname || ""}">
                    <div class="invalid-feedback d-block" id="invalid-employeeLastname"></div>
                </div>
                <div class="form-group">
                    <label>Department <code>*</code></label>
                    <select class="form-control validate select2"
                        style="width: 100%"
                        name="departmentID"
                        id="departmentID"
                        required>
                        <option value="" selected disabled>Select Department</option>
                        ${departmentOptions(departmentID)}
                    </select>
                    <div class="invalid-feedback d-block" id="invalid-departmentID"></div>
                </div>
                <div class="form-group">
                    <label>Designation <code>*</code></label>
                    <select class="form-control validate select2"
                        style="width: 100%"
                        name="designationID"
                        id="designationID"
                        required>
                        ${designationOptions(designationID, departmentID, true)}
                    </select>
                    <div class="invalid-feedback d-block" id="invalid-designationID"></div>
                </div>
                <div class="form-group">
                    <label>Status <code>*</code></label>
                    <select class="form-control validate select2"
                        style="width: 100%"
                        name="employeeStatus"
                        id="employeeStatus"
                        employeeID="${employeeID}">
                        ${employeeStatuses(employeeStatus)}
                    </select>
                    <div class="invalid-feedback d-block" id="invalid-employeeStatus"></div>
                </div>
            </div>
            <div class="modal-footer">
                ${button}
                <button class="btn btn-cancel btnCancel px-5 p-2" ><i class="fas fa-ban"></i> Cancel</button>
            </div>`;
        }

        return html;

    }
    // ----- END MODAL CONTENT -----


    // ----- GET MODAL DATA -----
    function getPersonnelInformationData() {
        let employeeProfile       = $("[name=employeeProfile]").val();
        const employeeFirstname   = $("[name=employeeFirstname]").val()?.trim();
        const employeeMiddlename  = $("[name=employeeMiddlename]").val()?.trim();
        const employeeLastname    = $("[name=employeeLastname]").val()?.trim();
        let employeeBirthday      = $("[name=employeeBirthday]").val()?.trim();
        let employeeGender        = $("[name=employeeGender]:checked").val();
        const employeeCitizenship = $("[name=employeeCitizenship]").val();
        const employeeCivilStatus = $("[name=employeeCivilStatus]").val();
        let employeeHiredDate     = $("[name=employeeHiredDate]").val()?.trim();
        const employeeRegion      = $("[name=employeeRegion]").val();
        const employeeProvince    = $("[name=employeeProvince]").val();
        const employeeCity        = $("[name=employeeCity]").val();
        const employeeBarangay    = $("[name=employeeBarangay]").val();
        const employeeUnit        = $("[name=employeeUnit]").val()?.trim();
        const employeeBuilding    = $("[name=employeeBuilding]").val()?.trim();
        const employeeStreet      = $("[name=employeeStreet]").val()?.trim();
        const employeeSubdivision = $("[name=employeeSubdivision]").val()?.trim();
        const employeeCountry     = $("[name=employeeCountry]").val()?.trim();
        const employeeZipCode     = $("[name=employeeZipCode]").val()?.trim();
        const departmentID        = $("[name=departmentID]").val();
        const designationID       = $("[name=designationID]").val();
        const employeeEmail       = $("[name=employeeEmail]").val()?.trim();
        const employeeMobile      = $("[name=employeeMobile]").val()?.trim();
        const employeeStatus      = $("[name=employeeStatus]").val();
        let employeeSignature     = $("[name=employeeSignature]").val();

        employeeProfile   = employeeProfile ? $("[name=employeeProfile]")[0].files[0].name : $("[name=employeeProfile]").attr("default");
        employeeSignature = employeeSignature ? $("[name=employeeSignature]")[0].files[0].name : $("[name=employeeSignature]").attr("signature");
        employeeBirthday  = moment(employeeBirthday).format("YYYY-MM-DD");
        employeeHiredDate = moment(employeeHiredDate).format("YYYY-MM-DD");
        employeeGender    = employeeGender == "Others" ? $("[name=employeeOtherGender]").val()?.trim() : employeeGender;
        // employeeSignature = employeeSignature ? $("[name=employeeSignature]")[0]?.files[0] : null;
        const file          = employeeProfile   ? $("[name=employeeProfile]")[0].files[0]   : null;
        const signatureFile = employeeSignature ? $("[name=employeeSignature]")[0].files[0] : null;
        
        return {
            employeeProfile, employeeFirstname, employeeMiddlename, employeeLastname, employeeBirthday, employeeGender, employeeCitizenship, employeeCivilStatus, employeeHiredDate, employeeRegion, employeeProvince, employeeCity, employeeBarangay, employeeUnit, employeeBuilding, employeeStreet, employeeSubdivision, employeeCountry, employeeZipCode, departmentID, designationID, employeeEmail, employeeMobile, employeeStatus, file, employeeSignature, signatureFile
        };
    }

    function getPersonnelAccountData() {
        const employeeUsername = $("[name=employeeUsername]").val()?.trim();
        const employeePassword = $("[name=employeePassword]").val()?.trim();
        const employeeEncryptedPassword = encryptString(employeePassword);

        return {
            employeeUsername, employeePassword, employeeEncryptedPassword
        };
    }

    function getPersonnelPayrollData() {
        const employeeBasicSalary     = +$("[name=employeeBasicSalary]").val().replaceAll(",", "");
        const employeeDailyRate       = +$("[name=employeeDailyRate]").val().replaceAll(",", "");
        const employeeHourlyRate      = employeeDailyRate / 8;
        const employeeAllowance       = +$("[name=employeeAllowance]").val().replaceAll(",", "");
        const bankID                  = $("[name=bankID]").val();
        const employeeBankAccountName = $("[name=employeeBankAccountName]").val()?.trim();
        const employeeBankAccountNo   = $("[name=employeeBankAccountNo]").val();
        const employeeTIN             = $("[name=employeeTIN]").val();
        const employeeSSS             = $("[name=employeeSSS]").val();
        const employeePhilHealth      = $("[name=employeePhilHealth]").val();
        const employeePagibig         = $("[name=employeePagibig]").val();

        return {
            employeeBasicSalary, employeeDailyRate, employeeHourlyRate, employeeAllowance, bankID, employeeBankAccountName, employeeBankAccountNo, employeeTIN, employeeSSS, employeePhilHealth, employeePagibig
        }
    }

    function getPersonnelLeaveBalanceData() {
        const employeeRanking       = $(`[name="employeeRanking"]`).val();
        const employeeRankingCredit = $(`[name="employeeRanking"] option:selected`).attr("balance");
        let result = [];
        $(`tr.leaveTypeTable`).each(function() {
            let leaveAccumulated = $(`[name="leaveAccumulated"]`, this).val();
                leaveAccumulated = leaveAccumulated == "-" ? 0 : leaveAccumulated?.replaceAll(",", "");
            let temp = {
                leaveTypeID:      $(this).attr("leaveID"),
                leaveBalance:     $(`[name="leaveCredit"]`, this).val()?.replaceAll(",", ""),
                leaveAccumulated,
            };
            result.push(temp);
        })

        return { employeeRanking, employeeRankingCredit, balance: result};
    }

    function getPersonnelScheduleData() {
        return $("[name=scheduleID]").val();
    }

    function getPersonnelAccessibilityData() {
        let result = [];
        $(".module").each(function() {
            const moduleID = $(this).attr("moduleid");
            const showStatus    = $(`[name=show][moduleid=${moduleID}]`).prop("checked") ? 1 : 0;
            const createStatus  = $(`[name=create][moduleid=${moduleID}]`).prop("checked") ? 1 : 0;
            const readStatus    = $(`[name=read][moduleid=${moduleID}]`).prop("checked") ? 1 : 0;
            const updateStatus  = $(`[name=update][moduleid=${moduleID}]`).prop("checked") ? 1 : 0;
            const deleteStatus  = $(`[name=delete][moduleid=${moduleID}]`).prop("checked") ? 1 : 0;
            const printStatus   = $(`[name=print][moduleid=${moduleID}]`).prop("checked") ? 1 : 0;
            result.push({moduleID, showStatus, createStatus, readStatus, updateStatus, deleteStatus, printStatus});
        })
        return result;
    }
    async function getPersonnelData() {
        let formData = new FormData();
        const informationData = getPersonnelInformationData();
        Object.keys(informationData).map(informationKey => {
            formData.append(informationKey, informationData[informationKey]);
        })
        const accountData = getPersonnelAccountData();
        Object.keys(accountData).map(accountKey => {
            formData.append(accountKey, accountData[accountKey]);
        })
        const payrollData = getPersonnelPayrollData();
        Object.keys(payrollData).map(payrollKey => {
            formData.append(payrollKey, payrollData[payrollKey]);
        })
        const leaveBalanceData = getPersonnelLeaveBalanceData();
        formData.append(`employeeRanking`, leaveBalanceData.employeeRanking);
        formData.append(`employeeRankingCredit`, leaveBalanceData.employeeRankingCredit);
        leaveBalanceData.balance.map((leave, index) => {
            const { leaveTypeID, leaveBalance, leaveAccumulated } = leave;
            formData.append(`leaveCredit[${index}][leaveTypeID]`, leaveTypeID);
            formData.append(`leaveCredit[${index}][leaveBalance]`, leaveBalance);
            formData.append(`leaveCredit[${index}][leaveAccumulated]`, leaveAccumulated);
        })
        formData.append("scheduleID", getPersonnelScheduleData());
        const accessiblityData = getPersonnelAccessibilityData();
        accessiblityData.map((accessibility, index) => {
            const { moduleID, showStatus, createStatus, readStatus, updateStatus, deleteStatus, printStatus } = accessibility;
            formData.append(`accessibility[${index}][moduleID]`, moduleID);
            formData.append(`accessibility[${index}][showStatus]`, showStatus);
            formData.append(`accessibility[${index}][createStatus]`, createStatus);
            formData.append(`accessibility[${index}][readStatus]`, readStatus);
            formData.append(`accessibility[${index}][updateStatus]`, updateStatus);
            formData.append(`accessibility[${index}][deleteStatus]`, deleteStatus);
            formData.append(`accessibility[${index}][printStatus]`, printStatus);
        })
        contractAppraisalFiles.map((file, index) => {
            formData.append(`contractappraisalfiles[${index}]`, file);
        })
        contractAppraisalFilename.map((filename, index) => {
            formData.append(`contractappraisalfilename[${index}]`, filename);
        })
        employeeMemorandaFiles.map((file, index) => {
            formData.append(`employeememorandafiles[${index}]`, file);
        })
        employeeMemorandaFilename.map((filename, index) => {
            formData.append(`employeememorandafilename[${index}]`, filename);
        })
        trainingDevelopmentFiles.map((file, index) => {
            formData.append(`trainingdevelopmentfiles[${index}]`, file);
        })
        trainingDevelopmentFilename.map((filename, index) => {
            formData.append(`trainingdevelopmentfilename[${index}]`, filename);
        })
        othersFiles.map((file, index) => {
            formData.append(`othersfiles[${index}]`, file);
        })
        othersFilename.map((filename, index) => {
            formData.append(`othersfilename[${index}]`, filename);
        })
        return await formData;
    }
    // ----- END GET MODAL DATA -----


    // ----- OPEN ADD MODAL -----
	$(document).on("click", "#btnAdd", function () {
		preventRefresh(true);

        let modalTitle = "";
        const tab = $(`.nav-link.page-tab.active`).attr("redirect");
        if (tab == "organicTab") {
            modalTitle = "ADD PERSONNEL (ORGANIC)";
            $("#modal_employee_module .modal-dialog").removeClass("modal-md").addClass("modal-xl");
        } else {
            modalTitle = "ADD PERSONNEL (NON-ORGANIC)";
            $("#modal_employee_module .modal-dialog").removeClass("modal-xl").addClass("modal-md");
        }

        $("#modal_employee_module .page-title").text(modalTitle);
        $("#modal_employee_module").modal("show");
        $("#modal_employee_module_content").html(preloader);
        const content = modalContent(false, tab);
        $("#modal_employee_module_content").html(content);
        initAll();
        const disabledFutureDates = {
            autoUpdateInput:  false,
            singleDatePicker: true,
            showDropdowns:    true,
            autoApply:        true,
            locale: {
                format: "MMMM DD, YYYY",
            },
            maxDate: moment(new Date).format("MMMM DD, YYYY"),
        }
        initDateRangePicker("#employeeBirthday", disabledFutureDates);
        initDateRangePicker("#employeeHiredDate", disabledFutureDates);
        initDataTables();
		
	});
	// ----- END OPEN ADD MODAL -----


    // ----- NAV LINK -----
	$(document).on("click", ".nav-link.page-tab", function () {
		const tab = $(this).attr("redirect");
		if (tab == "organicTab") {
			organicTableContent();
		} else  {
			nonOrganicTableContent();
		}
	});
	// ----- END NAV LINK -----


    // ----- FOCUS ERROR FORM -----
    function displayErrorTab() {
        const input = $("#modal_employee_module").find(".is-invalid").first();
        const tabID = input.closest(".tab-pane").attr("id");
        $(`a[href="#${tabID}"]`).tab("show");
        input.focus();

        $("#tableLeaveBalance").DataTable().columns.adjust().draw();
        $("#tableAccessibility").DataTable().columns.adjust().draw();
        $("#tableSchedule").DataTable().columns.adjust().draw();
    }
    // ----- END FOCUS ERROR FORM -----


    // ----- SAVE MODAL -----
	$(document).on("click", "#btnSave", function () { 
		const validate = validateForm("modal_employee_module");
        
        const tab = $(this).attr("redirect");
        if (tab == "organicTab") {
            formButtonHTML(this, true);
            comparePassword();
            if (validate) {
                // ----- RESET SEARCH IN DATATABLE -----
                $(`[aria-controls="tableAccessibility"]`).val("");
                $('#tableAccessibility').DataTable().search("").draw();
                // ----- RESET SEARCH IN DATATABLE -----
                setTimeout(() => {
                    getPersonnelData()
                    .then(data => {
                        formButtonHTML(this, false);
                        if (data) {
                            data.append("action", "insert");
                            data.append("employeeCode", generateCode("EMP", false, "hris_employee_list_tbl", "employeeID", "", true));
                            savePersonnelData(data, "add", organicTableContent);
                        } else {
                            showNotification("danger", "There was an error getting employee data");
                        }
                    })
                }, 100);
            } else {
                displayErrorTab();
                formButtonHTML(this, false);
            }
        } else {
            if (validate) {
                let data = getFormData("modal_employee_module", true);
                data[`tableData[employeeProfile]`] = "default.jpg";
                data[`tableData[isNonOrganic]`]    = 1;
                data[`tableData[createdAt]`]       = moment().format("YYYY-MM-DD HH:mm:ss");
                data[`tableData[createdBy]`]       = sessionID;
                data[`tableData[updatedBy]`]       = sessionID;
                data["tableData[employeeCode]"]    = generateCode("EMP", false, "hris_employee_list_tbl", "employeeID", "", true);
                data[`tableName`] = "hris_employee_list_tbl";
                let fullname = $(`[name="employeeFirstname"]`).val()?.trim() +" "+ $(`[name="employeeLastname"]`).val()?.trim();
                data[`feedback`]  = fullname;

                sweetAlertConfirmation("add", "Personnel", "modal_employee_module", null, data, true, nonOrganicTableContent);
            } 
        }
	});
	// ----- END SAVE MODAL -----


    // ----- SAVE MODAL -----
	$(document).on("click", "#btnUpdate", function () {
        const id = decryptString($(this).attr("employeeID"));
		const validate = validateForm("modal_employee_module");

        const tab = $(this).attr("redirect");
        if (tab == "organicTab") {
            formButtonHTML(this, true);
            comparePassword();
            if (validate) {
                // ----- RESET SEARCH IN DATATABLE -----
                $(`[aria-controls="tableAccessibility"]`).val("");
                $('#tableAccessibility').DataTable().search("").draw();
                // ----- RESET SEARCH IN DATATABLE -----
                setTimeout(() => {
                    getPersonnelData()
                    .then(data => {
                        formButtonHTML(this, false);
                        if (data) {
                            data.append("employeeID", id);
                            data.append("action", "update");
                            savePersonnelData(data, "edit", organicTableContent);
                        } else {
                            showNotification("danger", "There was an error getting employee data");
                        }
                    })
                }, 100);
            } else {
                displayErrorTab();
                formButtonHTML(this, false);
            }
        } else {
            if (validate) {
                let data = getFormData("modal_employee_module", true);
                data[`tableData[updatedBy]`] = sessionID;
                data[`tableName`]   = "hris_employee_list_tbl";
                data[`whereFilter`] = `employeeID = ${id}`;
                let fullname = $(`[name="employeeFirstname"]`).val()?.trim() +" "+ $(`[name="employeeLastname"]`).val()?.trim();
                data[`feedback`] = fullname;

                sweetAlertConfirmation("update", "Personnel", "modal_employee_module", null, data, true, nonOrganicTableContent);
            } 
        }

        
	});
	// ----- END SAVE MODAL -----
    

    // ----- OPEN EDIT MODAL -----
	$(document).on("click", ".btnEdit", function () {
		preventRefresh(true);

        let modalTitle = "";
        const tab = $(`.nav-link.page-tab.active`).attr("redirect");
        if (tab == "organicTab") {
            modalTitle = "EDIT PERSONNEL (ORGANIC)";
            $("#modal_employee_module .modal-dialog").removeClass("modal-md").addClass("modal-xl");
        } else {
            modalTitle = "EDIT PERSONNEL (NON-ORGANIC)";
            $("#modal_employee_module .modal-dialog").removeClass("modal-xl").addClass("modal-md");
        }

		const id = decryptString($(this).attr("id"));
		$("#modal_employee_module .page-title").text(modalTitle);
        $("#modal_employee_module").modal("show");
		$("#modal_employee_module_content").html(preloader);

        setTimeout(() => {
            if ($('#modal_employee_module').hasClass('show')) {
                const employeeData = getTableData(
                    `hris_employee_list_tbl`,
                    `*`,
                    `employeeID = ${id}`
                );
                
                if (employeeData) {
                    try {
                        const content = modalContent(employeeData[0], tab);
                        setTimeout(() => {
                            $("#modal_employee_module_content").html(content);
                            initAll();

                            if (tab == "organicTab") {
                                employeeData[0].bankID && employeeData[0].bankID != 0 && $("[name=bankID]").trigger("change");
                                $("[name=employeeBankAccountNo]").val(employeeData[0].employeeBankAccountNo);
                                employeeData[0].scheduleID && employeeData[0].scheduleID != 0 && $("[name=scheduleID]").trigger("change");
                                const disabledFutureDates = {
                                    autoUpdateInput:  false,
                                    singleDatePicker: true,
                                    showDropdowns:    true,
                                    autoApply:        true,
                                    locale: {
                                        format: "MMMM DD, YYYY",
                                    },
                                    maxDate: moment(new Date).format("MMMM DD, YYYY"),
                                }
                                const daterangepickerBirthday  = { ...disabledFutureDates, startDate: moment(employeeData[0]?.employeeBirthday)  };
                                const daterangepickerHireddate = { ...disabledFutureDates, startDate: moment(employeeData[0]?.employeeHiredDate) };
                                initDateRangePicker("#employeeBirthday", daterangepickerBirthday);
                                initDateRangePicker("#employeeHiredDate", daterangepickerHireddate);
                            } 
                            initDataTables();
        
                            if (!allowedUpdate) {
                                $("#modal_employee_module_content").find("input, select, textarea").each(function() {
                                    $(this).attr("disabled", true);
                                })
                                $("#modal_employee_module_content").find(`<code>*</code>`).hide();
                                $("#btnUpdate").hide();
                            }
        
                        }, 500);
                    } catch (error) {
                        showNotification("danger", `${error}`);
                        let html = `
                        <div class="w-100 text-center text-danger py-5">
                            <h5 style="font-weight: bold; font-size: 1.2rem;">${error}</h5>
                        </div>`;
                        $("#modal_employee_module_content").html(html);
                    }
        
                } else {
                    showNotification("danger", "There was an error fetching employee data.");
                }
            }
        }, 500);
        
	});
	// ----- END OPEN EDIT MODAL -----


    // ------- CANCEL MODAL--------
	$(document).on("click", ".btnCancel", function () {
		let formEmpty = isFormEmpty("modal_employee_module");
		if (!formEmpty) {
			sweetAlertConfirmation("cancel", "Personnel", "modal_employee_module");
		} else {
			preventRefresh(false);
			$("#modal_employee_module").modal("hide");
		}
	});
	// -------- END CANCEL MODAL-----------


/* ---------------------------------------------------------- */


    // ----- SAVE PERSONNEL -----
    function getConfirmation(action = "insert") {
        const title = "Personnel";
        let swalText, swalImg;
    
        switch (action) {
            case "add":
                swalTitle = `ADD ${title.toUpperCase()}`;
                swalText  = `Are you sure that you want to add a new ${title.toLowerCase()} to the system?`;
                swalImg   = `${base_url}assets/modal/add.svg`;
                break;
            case "edit":
                swalTitle = `UPDATE ${title.toUpperCase()}`;
                swalText  = `Are you sure that you want to update the ${title.toLowerCase()} to the system?`;
                swalImg   = `${base_url}assets/modal/update.svg`;
                break;
            default:
                swalTitle = `DISCARD CHANGES`;
                swalText  = "Are you sure that you want to cancel this process?";
                swalImg   = `${base_url}assets/modal/cancel.svg`;
                break;
        }
        return Swal.fire({
            title:              swalTitle,
            text:               swalText,
            imageUrl:           swalImg,
            imageWidth:         200,
            imageHeight:        200,
            imageAlt:           "Custom image",
            showCancelButton:   true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor:  "#1a1a1a",
            cancelButtonText:   "No",
            confirmButtonText:  "Yes"
        })
    }
    
    function savePersonnelData(data, method = "add", callback = false) {
        $("#modal_employee_module").modal("hide");
        if (data) {
            const confirmation = getConfirmation(method);
            confirmation.then(res => {
                if (res.isConfirmed) {
                    $("#loader").show();
                    setTimeout(() => {
                        $.ajax({
                            method:      "POST",
                            url:         `${base_url}hris/employee_module/saveEmployeeData`,
                            data,
                            processData: false,
                            contentType: false,
                            global:      false,
                            cache:       false,
                            async:       false,
                            dataType:    "json",
                            beforeSend: function() {
                                $("#loader").show();
                            },
                            success: function(data) {
                                let result = data.split("|");
                
                                let isSuccess   = result[0];
                                let message     = result[1];
                                let insertedID  = result[2];
                                let dateCreated = result[3];

                                const employeeFirstname = $("[name=employeeFirstname]").val()?.trim();
                                const employeeLastname  = $("[name=employeeLastname]").val()?.trim();
                                const employeeID        = insertedID && insertedID > 1 ? (insertedID - 1) : 999999999;
        
                                let swalTitle;
                                if (method == "add") {
                                    swalTitle = `${getFormCode("EMP", dateCreated, employeeID)} added successfully!`;
                                } else if (method == "edit") {
                                    swalTitle = `${getFormCode("EMP", dateCreated, employeeID)} updated successfully!`;
                                } 
                
                                if (isSuccess == "true") {
                                    setTimeout(() => {
                                        $("#loader").hide();
                                        closeModals();
                                        Swal.fire({
                                            icon:              "success",
                                            title:             swalTitle,
                                            showConfirmButton: false,
                                            timer:             2000,
                                        });
                                        callback && callback();
                                    }, 500);
                                } else {
                                    setTimeout(() => {
                                        $("#loader").hide();
                                        Swal.fire({
                                            icon:              "danger",
                                            title:             message,
                                            showConfirmButton: false,
                                            timer:             2000,
                                        });
                                    }, 500);
                                }
                            },
                            error: function() {
                                setTimeout(() => {
                                    $("#loader").hide();
                                    showNotification("danger", "System error: Please contact the system administrator for assistance!");
                                }, 500);
                            }
                        }).done(function() {
                            setTimeout(() => {
                                $("#loader").hide();
                            }, 500);
                        })
                    }, 500);
                } else {
                    if (res.isDismissed) {
                        $("#modal_employee_module").modal("show");
                    }
                }
            });
        }
    } 
    // ----- END SAVE PERSONNEL -----

})


