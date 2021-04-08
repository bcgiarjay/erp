// ----- SAVE FORM/DOCUMENT ----
async function saveFormData(action, method, data, isObject, swalTitle) {
	if (action && method && data && isObject) {
		let path =
			action == "insert"
				? `${base_url}operations/insertTableData`
				: `${base_url}operations/updateTableData`;
		return !isObject
			? await saveUpdateDeleteDatabaseFormData(data, path, false, swalTitle)
			: await saveUpdateDeleteDatabaseObject(data, path, false, swalTitle);
	} else {
		return "Failed to save document!";
	}
}
// ----- END SAVE FORM/DOCUMENT ----


// ----- FORM/DOCUMENT CONFIRMATION -----
function formConfirmation(
	method = "", // save|cancelform|approve|reject|submit|cancel
	action = "",
	title = "",
	modalID = "",
	containerID = "",
	data = null,
	isObject = true,
	callback = false,
	notificationData = false,
	buttonElement = null
) {
	buttonElement && formButtonHTML(buttonElement, false);
	if (method && action && title && (modalID || containerID)) {
		method = method.toLowerCase();
		action = action.toLowerCase() == "update" ? "update" : "insert";

		modalID && $("#" + modalID).modal("hide");

		let swalText, swalImg;
		switch (method) {
			case "save":
				swalTitle = `SAVE ${title.toUpperCase()}`;
				swalText = "Are you sure to save this document?";
				swalImg = `${base_url}assets/modal/draft.svg`;
				break;
			case "submit":
				swalTitle = `SUBMIT ${title.toUpperCase()}`;
				swalText = "Are you sure to submit this document?";
				swalImg = `${base_url}assets/modal/add.svg`;
				break;
			case "approve":
				swalTitle = `APPROVE ${title.toUpperCase()}`;
				swalText = "Are you sure to approve this document?";
				swalImg = `${base_url}assets/modal/approve.svg`;
				break;
			case "reject":
				swalTitle = `DENY ${title.toUpperCase()}`;
				swalText = "Are you sure to deny this document?";
				swalImg = `${base_url}assets/modal/reject.svg`;
				break;
			case "cancelform":
				swalTitle = `CANCEL ${title.toUpperCase()} DOCUMENT`;
				swalText = "Are you sure to cancel this document?";
				swalImg = `${base_url}assets/modal/cancel.svg`;
				break;
			default:
				swalTitle = `CANCEL ${title.toUpperCase()}`;
				swalText = "Are you sure that you want to cancel this process?";
				swalImg = `${base_url}assets/modal/cancel.svg`;
				break;
		}
		Swal.fire({
			title: swalTitle,
			text: swalText,
			imageUrl: swalImg,
			imageWidth: 200,
			imageHeight: 200,
			imageAlt: "Custom image",
			showCancelButton: true,
			confirmButtonColor: "#dc3545",
			cancelButtonColor: "#1a1a1a",
			cancelButtonText: "No",
			confirmButtonText: "Yes",
			// allowOutsideClick:  false,
		}).then((result) => {
			if (result.isConfirmed) {
				if (method != "cancel") {
					let saveData = saveFormData(
						action,
						method,
						data,
						isObject,
						swalTitle
					);
					saveData.then((res) => {
						if (res) {
							callback && callback();

							notificationData && insertNotificationData(notificationData);
						} else {
							Swal.fire({
								icon: "danger",
								title: "Failed!",
								text: result[1],
								showConfirmButton: false,
								timer: 2000,
							});
						}
					});
				} else {
					Swal.fire({
						icon: "success",
						title: swalTitle,
						showConfirmButton: false,
						timer: 2000,
					});
				}
			} else {
				containerID && $("#" + containerID).show();
				modalID && $("#" + modalID).modal("show");
			}
		});
	} else {
		showNotification("danger", "Invalid arguments!");
	}
}
// ----- END FORM/DOCUMENT CONFIRMATION -----


// ----- CANCEL FORM -----
function cancelForm(
	method = "",
	action = "",
	title = "",
	modalID = "",
	containerID = "",
	data = null,
	isObject = true,
	callback = false,
	buttonElement = null
) {
	buttonElement && formButtonHTML(buttonElement, false);
	if (method && action && title && (modalID || containerID)) {
		modalID && $("#" + modalID).modal("hide");

		Swal.fire({
			title: `SAVE AS DRAFT`,
			text: `Do you want to save your changes for filing this ${title.toLowerCase()}?`,
			imageUrl: `${base_url}assets/modal/add.svg`,
			imageWidth: 200,
			imageHeight: 200,
			imageAlt: "Custom image",
			showCancelButton: true,
			confirmButtonColor: "#dc3545",
			cancelButtonColor: "#1a1a1a",
			cancelButtonText: "No",
			confirmButtonText: "Yes",
			// allowOutsideClick: false,
		}).then((result) => {
			if (result.isConfirmed) {
				const formID = modalID ? modalID : containerID;
				const validate = validateForm(formID);
				if (validate) {
					let saveData = saveFormData(
						action,
						method,
						data,
						isObject,
						`SAVE ${title.toUpperCase()}`
					);
					saveData.then((res) => {
						if (res) {
							callback && callback();
						} else {
							Swal.fire({
								icon: "danger",
								title: "Failed!",
								text: result[1],
								showConfirmButton: false,
								timer: 2000,
							});
						}
					});
				} else {
					modalID && $("#" + modalID).modal("show");
				}
			} else {
				if (result.dismiss === "cancel") {
					modalID && $("#" + modalID).modal("hide");
					containerID && $("#" + containerID).hide();
					callback && callback();
				}
			}
		});
	} else {
		showNotification("danger", "Invalid arguments");
	}
}
// ----- END CANCEL FORM -----


// ----- BUTTON LOADER -----
let submitHTML = "";
function formButtonHTML(elem, process = true) {
	submitHTML = process ? $(elem).html() : submitHTML;
	let disabled = process ? true : false;
	let loaderHTML = `<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i> Please wait...`;
	let html = process ? loaderHTML : submitHTML;
	$(elem).attr("disabled", disabled);
	$(elem).html(html);
}
// ----- END BUTTON LOADER -----


// ----- GET MODULE APPROVER -----
function getModuleApprover(module = null) {
	let getData;

	let [ columnName, columnValue ] = [ "designationID", sessionDesignationID ]; // CHANGE IT TO DESIGNATION

	if (module) {
		if (typeof module === "number") {
			getData = getTableData("gen_approval_setup_tbl", "", `moduleID = ${module} AND ${columnName} = ${columnValue}`);
		} 
		if (typeof module === "string") {
			getData = getTableData("gen_approval_setup_tbl", "", `LOWER(moduleName) = BINARY LOWER ("${module}") AND ${columnName} = ${columnValue}`);
		}

		if (getData.length > 0) {
			let approverID    = getData[0]["userAccountID"] ? getData[0]["userAccountID"] : "";
			let approverIDArr = approverID ? approverID.split("|") : [];
				approverIDArr = approverIDArr.filter(item => item != '0');
			let index = approverIDArr.indexOf(sessionID);
			if (index === -1) {
				return approverIDArr.join("|");
			} else {
				return approverIDArr.slice(index+1).join("|");
			}
		}
	}
	return "";
}
// ----- GET MODULE APPROVER -----


// ----- IS IM APPROVER -----
function isImApprover(moduleApprover = null) {
	if (moduleApprover) {
		const moduleApproverArr = moduleApprover.split("|");
		return moduleApproverArr.find((id) => id === sessionID) ? true : false;
	}
	return false;
}

function isImModuleApprover(tableName = false, columnName = false) {
	if (tableName && columnName) {
		const dataLength = getTableDataLength(tableName, "", `FIND_IN_SET('${sessionID}', REPLACE(${columnName}, '|', ','))`);
		return dataLength > 0 ? true : false;
	}
	return false;
}
// ----- END IS IM APPROVER -----


// ----- IS IM LAST APPROVER -----
function isImLastApprover(approversID = null, approversDate = null) {
	if (approversID) {
		let idArr = approversID.split("|");
		let idLength = idArr.length;
		let dateArr = approversDate ? approversDate.split("|") : [];
		let dateLength = dateArr.length+1;
		return idLength == dateLength;
	}
	return false;
}
// ----- END IS IM LAST APPROVER -----


// ----- CURRENT APPROVER -----
function isImCurrentApprover(approversID = null, approversDate = null, status = null) {
	if (approversID && status != 3) {
		const index = approversDate ? approversDate.split("|").length + 1 : 1;
		const approversIDArr = approversID.split("|");
		const id = approversIDArr[index - 1];
		return id === sessionID ? true : false;
	}
	return false;
}
// ----- END CURRENT APPROVER -----


// ----- CURRENT APPROVER -----
function getCurrentApprover(approversID = null, approversDate = null, status = null) {
	if (approversID && status == 1) {
		const index = approversDate ? approversDate.split("|").length : 0;
		const approversIDArr = approversID.split("|");
		const id = approversIDArr[index];
		return getEmployeeFullname(id);
	}
	return "-";
}
// ----- END CURRENT APPROVER -----


// ----- IS DOCUMENT ALREADY APPROVED -----
function isAlreadyApproved(approversID = null, approversDate = null) {
	if (approversID) {
		const approversIDArr = approversID ? approversID.split("|") : [];
		const approversDateArr = approversDate ? approversDate.split("|") : [];
		const index = approversIDArr.indexOf(sessionID);
		return approversDateArr[index] ? true : false;
	}
	return false;
}
// ----- END IS DOCUMENT ALREADY APPROVED -----


// ----- FUNCTION UPDATE DATE -----
function updateApproveDate(date) {
	let dateToday = moment().format("YYYY-MM-DD HH:mm:ss");
	if (date) {
		let dateArr = date.split("|");
		dateArr.push(dateToday);
		return dateArr.join("|");
	}
	return dateToday;
}
// ----- END FUNCTION UPDATE DATE -----


// ----- UPDATE APPROVERS STATUS -----
function updateApproveStatus(approversStatus, status) {
	if (approversStatus) {
		let approversStatusArr = approversStatus.split("|");
		approversStatusArr.push(status);
		return approversStatusArr.join("|");
	}
	return status;
}
// ----- END UPDATE APPROVERS STATUS -----


// ----- DATE APPROVED -----
function getDateApproved(status, approversID = false, approversDate = false) {
	if (status && approversID && approversDate) {
		if (status == 2) {
			const dateArr = approversDate.split("|");
			const index = dateArr.length-1;
			return moment(dateArr[index]).format("MMMM DD, YYYY hh:mm:ss A");
		}
	}
	return "---";
}
// ----- END DATE APPROVED -----


function getApproversStatus(approversID, approversStatus, approversDate) {
	let html = "";
	if (approversID) {
		let idArr     = approversID.split("|");
		let statusArr = approversStatus ? approversStatus.split("|") : [];
		let dateArr   = approversDate ? approversDate.split("|") : [];
		html += `<div class="row mt-4">`;

		idArr && idArr.map((item, index) => {
			let date   = dateArr[index] ? moment(dateArr[index]).format("MMMM DD, YYYY hh:mm:ss A") : "";
			let status = statusArr[index] ? statusArr[index] : "";
			let statusBadge = "";
			if (date && status) {
				if (status == 2) {
					statusBadge = `<span class="badge badge-info">Approved - ${date}</span>`;
				} else if (status == 3) {
					statusBadge = `<span class="badge badge-danger">Denied - ${date}</span>`;
				}
			}

			html += `
			<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12">
				<div class="d-flex justify-content-start align-items-center">
					<span class="font-weight-bold">${getEmployeeFullname(item)}</span> <small>&nbsp;- Level ${index + 1} Approver</small>
				</div>
				${statusBadge}
			</div>`;
		})

		// statusArr && statusArr.map((item, index) => {
		// 	let date = moment(dateArr[index]).format("MMMM DD, YYYY hh:mm:ss A");
		// 	let statusBadge = item == 2 ? `
		// 	<span class="badge badge-info">
		// 		Approved - ${date}</span>` : `
		// 	<span class="badge badge-danger">
		// 		Denied - ${date}</span>`;

		// 	html += `
		// 	<div class="col-xl-3 col-lg-3 col-md-4 col-sm-12">
		// 		<div class="d-flex justify-content-start align-items-center">
		// 			<span class="font-weight-bold">${getEmployeeFullname(idArr[index])}</span> <small>&nbsp;- Level ${index + 1} Approver</small>
		// 		</div>
		// 		${statusBadge}
		// 	</div>`;
		// })

		html += `</div>`;
	}
	return html;
}


// ----- BADGE STATUS -----
function getStatusStyle(status = 1) {
	switch (status) {
		case "1":
			return `<span class="badge badge-outline-info w-100">For Approval</span>`;
		case "2":
			return `<span class="badge badge-info w-100">Approved</span>`;
		case "3":
			return `<span class="badge badge-danger w-100">Denied</span>`;
		case "4":
			return `<span class="badge badge-primary w-100">Cancelled</span>`;
		case "0":
		default:
			return `<span class="badge badge-warning w-100">Draft</span>`;
	}
}
// ----- END BADGE STATUS -----


// ----- GET APPROVER -----
function getNotificationEmployeeID(id, date, first = false) {
	if (id) {
		let idArr = id.split("|");
		let index = date && date != null ? date.split("|").length : 1;
		return first ? idArr[0] : idArr[index];
	}
	return null;
}
// ----- END GET APPROVER -----


// ----- GET FULLNAME -----
function getEmployeeFullname(employeeID) {
	if (employeeID) {
		let data = getTableData("hris_employee_list_tbl", "CONCAT(employeeFirstname, ' ', employeeLastname) AS fullname", "employeeID = "+employeeID);
		if (data) {
			return data[0].fullname;
		}
	}
	return "";
}
// ----- END GET FULLNAME -----
