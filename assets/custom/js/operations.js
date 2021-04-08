// ----- SQL -----
const database = (sql) => {
	if (sql) {
		const key = prompt(
			"Please enter password:",
			"YOU ARE NOT ALLOWED TO DO THIS!"
		);
		if (key != null || key != "") {
			const encryptKey = encryptString(key);
			if (
				decryptString(encryptKey) ==
				decryptString("U2FsdGVkX1/bAiO4H60pg3oTTlI43QSPzNcbbImFWro=")
			) {
				let result = [];
				$.ajax({
					method: "POST",
					url: `${base_url}operations/database`,
					data: { sql },
					async: false,
					dataType: "json",
					success: function (data) {
						if (data) {
							data.map((item) => {
								result.push(item);
							});
						}
					},
					error: function (err) {
						showNotification(
							"danger",
							"System error: Please contact the system administrator for assistance!"
						);
					},
				});
				return result;
			} else {
				alert("ERROR! I TOLD YOU");
				console.log("INCORRECT KEY!");
				return false;
			}
		}
		alert("ERROR! I TOLD YOU");
		console.log("INCORRECT KEY!");
		return false;
	}
	return false;
};
// ----- END SQL -----


// ----- GET DATABASE TABLE DATA -----
const getTableData = (
	tableName = null,
	columnName = "",
	searchFilter = "",
	orderBy = "",
	groupBy = "",
	others = ""
) => {
	let path = `${base_url}operations/getTableData`;
	let data = {
		tableName,
		columnName,
		searchFilter,
		orderBy,
		groupBy,
		others,
	};
	let result = [];
	if (tableName) {
		$.ajax({
			method: "POST",
			url: path,
			data,
			async: false,
			dataType: "json",
			success: function (data) {
				if (data) {
					data.map((item) => {
						result.push(item);
					});
				}
			},
			error: function (err) {
				showNotification(
					"danger",
					"System error: Please contact the system administrator for assistance!"
				);
			},
		});
	}
	return result;
};
// ----- END GET DATABASE TABLE DATA -----


// ----- GET DATABASE TABLE DATA -----
const getTableDataLength = (
	tableName = null,
	columnName = "",
	searchFilter = "",
	orderBy = "",
	groupBy = "",
	others = ""
) => {
	let path = `${base_url}operations/getTableDataLength`;
	let data = {
		tableName,
		columnName,
		searchFilter,
		orderBy,
		groupBy,
		others,
	};
	let result = 0;
	if (tableName) {
		$.ajax({
			method: "POST",
			url: path,
			data,
			async: false,
			success: function (data) {
				if (data) {
					result = data;
				}
			},
			error: function (err) {
				showNotification(
					"danger",
					"System error: Please contact the system administrator for assistance!"
				);
			},
		});
	}
	return result;
};
// ----- END GET DATABASE TABLE DATA -----


// ----- GET LAST CODE -----
const getTableLastCode = (tableName = false, columnName = false, whereFilter = "") => {
	if (tableName && columnName) {
		// let table = getTableDataLength(tableName, "createdAt");
		let result = 0;
		let lastID = getTableData(
			tableName,
			columnName,
			whereFilter,
			"createdAt DESC",
			"",
			"LIMIT 1"
		);

		if (lastID.length > 0) {
			// let lastID = getTableData(
			// 	tableName,
			// 	"",
			// 	whereFilter,
			// 	"createdAt DESC",
			// 	"",
			// 	"LIMIT 1"
			// );
			if (lastID && lastID.length > 0) {
				const columnValue = lastID[0][columnName];
				const arrValue = columnValue.split("-");
				result = +arrValue[2];
			} else {
				result = 0;
			}
		}

		return result;
	}
	return "Invalid arguments";
};
// ----- END GET LAST CODE -----


// ----- GENERATE CODE -----
const generateCode = (
	firstStr    = "STR",
	lastID      = false,
	tableName   = false,
	columnName  = false,
	whereFilter = ""
) => {
	let id;
	if (!lastID && tableName && columnName) {
		id = getTableLastCode(tableName, columnName, whereFilter) + 1;
	} else {
		id = lastID ? lastID + 1 : 1;
	}

	id = id.toString();
	let lastStr = "00001";
	if (id.length <= 0) {
		return `${firstStr}-${moment().format("YY")}-${lastStr}`;
	} else if (id.length > 0 && id.length < 5) {
		lastStr = "0".repeat(5 - id.length) + id;
		return `${firstStr}-${moment().format("YY")}-${lastStr}`;
	} else {
		return `${firstStr}-${moment().format("YY")}-${id}`;
	}
};
// ----- END GENERATE CODE -----


// ----- SAVE/UPDATE/DELETE TABLE DATA -----
const saveUpdateDeleteDatabaseFormData = async (
	data,
	path,
	feedback = false,
	swalTitle
) => {
	let result = await $.ajax({
		method: "POST",
		url: path,
		data,
		processData: false,
		contentType: false,
		global: false,
		cache: false,
		async: false,
		dataType: "json",
		beforeSend: function () {
			$("#loader").show();
		},
		success: function (data) {
			let result = data.split("|");
			let isSuccess = result[0],
				message = result[1],
				id = result[2] ? result[2] : null;

			if (isSuccess == "true") {
				if (feedback) {
					feedback = feedback.split("|");
					feedbackClass = feedback[0];
					feedbackMsg = feedback[1];
					setTimeout(() => {
						$("#loader").hide();
						closeModals();
						if (swalTitle) {
							Swal.fire({
								icon: feedbackClass,
								title: swalTitle,
								text: feedbackMsg,
								showConfirmButton: false,
								timer: 2000,
							});
						} else {
							Swal.fire({
								icon: feedbackClass,
								title: feedbackMsg,
								showConfirmButton: false,
								timer: 2000,
							});
						}
					}, 500);
				} else {
					setTimeout(() => {
						$("#loader").hide();
						closeModals();
						Swal.fire({
							icon: "success",
							title: message,
							showConfirmButton: false,
							timer: 2000,
						});
					}, 500);
				}
			} else {
				$("#loader").hide();
				Swal.fire({
					icon: "danger",
					title: message,
					showConfirmButton: false,
					timer: 2000,
				});
			}
		},
		error: function (err) {
			showNotification(
				"danger",
				"System error: Please contact the system administrator for assistance!"
			);
			$("#loader").hide();
		},
	});
	return (await result) ? result : false;
};


const saveUpdateDeleteDatabaseFormDatav1 = async (
	data,
	path,
	feedback = false,
	swalTitle
) => {
	let flag;
	$.ajax({
		method: "POST",
		url: path,
		data,
		processData: false,
		contentType: false,
		global: false,
		cache: false,
		async: false,
		dataType: "json",
		beforeSend: function () {
			$("#loader").show();
		},
		success: function (data) {
			let result = data.split("|");
			let isSuccess = result[0],
				message = result[1],
				id = result[2] ? result[2] : null;

			if (isSuccess == "true") {
				if (feedback) {
					feedback = feedback.split("|");
					feedbackClass = feedback[0];
					feedbackMsg = feedback[1];
					setTimeout(() => {
						closeModals();
						showNotification(feedbackClass, feedbackMsg);
						flag = true;
						$("#loader").hide();
					}, 500);
				} else {
					setTimeout(() => {
						closeModals();
						showNotification("success", message);
						flag = true;
						$("#loader").hide();
					}, 500);
				}
			} else {
				flag = false;
				showNotification("danger", message);
				$("#loader").hide();
			}
		},
		error: function (err) {
			flag = false;
			showNotification(
				"danger",
				"System error: Please contact the system administrator for assistance!"
			);
			$("#loader").hide();
		},
	});
	return await flag;
};


const saveUpdateDeleteDatabaseObject = async (
	data,
	path,
	feedback = false,
	swalTitle
) => {
	let result = await $.ajax({
		method: "POST",
		url: path,
		data,
		async: false,
		dataType: "json",
		beforeSend: function () {
			$("#loader").show();
		},
		success: function (data) {
			let result = data.split("|");
			let isSuccess = result[0],
				message = result[1],
				id = result[2] ? result[2] : null;

			if (isSuccess == "true") {
				if (feedback) {
					feedback = feedback.split("|");
					feedbackClass = feedback[0];
					feedbackMsg = feedback[1];
					setTimeout(() => {
						$("#loader").hide();
						closeModals();
						if (swalTitle) {
							Swal.fire({
								icon: feedbackClass,
								title: swalTitle,
								text: feedbackMsg,
								showConfirmButton: false,
								timer: 2000,
							});
						} else {
							Swal.fire({
								icon: feedbackClass,
								title: feedbackMsg,
								showConfirmButton: false,
								timer: 2000,
							});
						}
					}, 500);
				} else {
					setTimeout(() => {
						$("#loader").hide();
						closeModals();
						Swal.fire({
							icon: "success",
							title: message,
							showConfirmButton: false,
							timer: 2000,
						});
					}, 500);
				}
			} else {
				$("#loader").hide();
				Swal.fire({
					icon: "danger",
					title: message,
					showConfirmButton: false,
					timer: 2000,
				});
			}
		},
		error: function (err) {
			showNotification(
				"danger",
				"System error: Please contact the system administrator for assistance!"
			);
			$("#loader").hide();
		},
	});
	return (await result) ? result : false;
};


const saveUpdateDeleteDatabaseObjectv1 = async (
	data,
	path,
	feedback = false,
	swalTitle
) => {
	let flag;
	$.ajax({
		method: "POST",
		url: path,
		data,
		async: false,
		dataType: "json",
		beforeSend: function () {
			$("#loader").show();
		},
		success: function (data) {
			let result = data.split("|");
			let isSuccess = result[0],
				message = result[1],
				id = result[2] ? result[2] : null;

			if (isSuccess == "true") {
				if (feedback) {
					feedback = feedback.split("|");
					feedbackClass = feedback[0];
					feedbackMsg = feedback[1];
					setTimeout(() => {
						closeModals();
						showNotification(feedbackClass, feedbackMsg);
						flag = true;
						$("#loader").hide();
					}, 500);
				} else {
					setTimeout(() => {
						closeModals();
						showNotification("success", message);
						flag = true;
						$("#loader").hide();
					}, 500);
				}
			} else {
				flag = false;
				showNotification(
					"danger",
					"System error: Please contact the system administrator for assistance!"
				);
				$("#loader").hide();
			}
		},
		error: function (err) {
			flag = false;
			showNotification(
				"danger",
				"System error: Please contact the system administrator for assistance!"
			);
			$("#loader").hide();
		},
	});
	return await flag;
};


const insertTableData = async (
	data,
	object = false,
	feedback = false,
	swalTitle = false
) => {
	let path = `${base_url}operations/insertTableData`;
	return !object
		? await saveUpdateDeleteDatabaseFormData(data, path, feedback, swalTitle)
		: await saveUpdateDeleteDatabaseObject(data, path, feedback, swalTitle);
};


const insertTableDatav1 = async (
	data,
	object = false,
	feedback = false,
	swalTitle = false
) => {
	$("#loader").show();
	let path = `${base_url}operations/insertTableData`;
	return !object
		? await saveUpdateDeleteDatabaseFormDatav1(data, path, feedback, swalTitle)
		: await saveUpdateDeleteDatabaseObjectv1(data, path, feedback, swalTitle);
};


const updateTableData = async (
	data,
	object = false,
	feedback = false,
	swalTitle = false
) => {
	let path = `${base_url}operations/updateTableData`;
	return !object
		? await saveUpdateDeleteDatabaseFormData(data, path, feedback, swalTitle)
		: await saveUpdateDeleteDatabaseObject(data, path, feedback, swalTitle);
};


const updateTableDatav1 = async (
	data,
	object = false,
	feedback = false,
	swalTitle = false
) => {
	$("#loader").show();
	let path = `${base_url}operations/updateTableData`;
	return !object
		? await saveUpdateDeleteDatabaseFormDatav1(data, path, feedback, swalTitle)
		: await saveUpdateDeleteDatabaseObjectv1(data, path, feedback, swalTitle);
};


const deleteTableData = async (
	data,
	object    = false,
	feedback  = false,
	swalTitle = false
) => {
	$("#loader").show();
	let path = `${base_url}operations/deleteTableData`;
	return !object
		? await saveUpdateDeleteDatabaseFormData(data, path, feedback, swalTitle)
		: await saveUpdateDeleteDatabaseObject(data, path, feedback, swalTitle);
};
// ----- END SAVE/UPDATE/DELETE TABLE DATA -----


// ----- INSERT NOTIFICATION -----
const insertNotificationData = (data) => {
	if (data) {
		$.ajax({
			method: "POST",
			url: `${base_url}operations/insertNotificationData`,
			data,
			dataType: 'json',
			async: false,
			success: function(data) {}
		})
	}
	return false;
}
// ----- END INSERT NOTIFICATION -----


// ----- GET EMPLOYEE DATA -----
const getEmployeeData = employeeID => {
	if (employeeID) {
		const data = getTableData(`
			hris_employee_list_tbl AS helt
				LEFT JOIN hris_department_tbl USING(departmentID)
				LEFT JOIN hris_designation_tbl USING(designationID)`, `
			CONCAT(employeeFirstname, ' ', employeeLastname) AS fullname,
			departmentName,
			designationName`, "employeeID="+employeeID);
		return (data && data[0]) || null;
	}
	return null;
}
// ----- END GET EMPLOYEE DATA -----


// ----- EMPLOYEE PERMISSIONS -----
const getEmployeePermission = (moduleID, method) => {
	if (moduleID && method) {
		const data = getTableData("hris_employee_permission_tbl", "createStatus, readStatus, updateStatus, deleteStatus, printStatus", `employeeID = ${sessionID} AND moduleID = ${moduleID}`);
		if (data.length > 0) {
			switch(method) {
				case "create":
					return data[0].createStatus == 1 ? true : false;
				case "read":
					return data[0].readStatus   == 1 ? true : false;
				case "update":
					return data[0].updateStatus == 1 ? true : false;
				case "delete":
					return data[0].deleteStatus == 1 ? true : false;
				case "print":
					return data[0].printStatus  == 1 ? true : false;
				default: 
					return false;
			}
		}
	}
	return false;
}

const isCreateAllowed = (moduleID = 60) => {
	return getEmployeePermission(moduleID, "create");
}

const isReadAllowed = (moduleID = 60) => {
	return getEmployeePermission(moduleID, "read");
}

const isUpdateAllowed = (moduleID = 60) => {
	return getEmployeePermission(moduleID, "update");
}

const isDeleteAllowed = (moduleID = 60) => {
	return getEmployeePermission(moduleID, "delete");
}

const isPrintAllowed = (moduleID = 60) => {
	return getEmployeePermission(moduleID, "print");
}
// ----- END EMPLOYEE PERMISSIONS -----