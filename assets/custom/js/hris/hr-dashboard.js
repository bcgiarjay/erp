$(document).ready(function() {

    function getOverbreakData(){
        let returnData = [];
        let html;
            $.ajax({
            method:      "POST",
            url:         `hr_dashboard/getOverbreakData`,
            async:   false,
            dataType:    "json",
            beforeSend: function() {
            
            },
            success: function(data) {
                returnData = data;
            },
            error: function() {
                setTimeout(() => {
                    $("#loader").hide();
                    showNotification("danger", "System error: Please contact the system administrator for assistance!");
                }, 500);
            }
        });
    
        let tbodyData = `<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                            <img src="${base_url}assets/modal/no-data.gif" style="max-width: 300px;
                                width: auto;
                                min-width: 100px;
                                height: auto;" alt="No data available.">
                            <span class="font-weight-bold">No data available.</span>
                        </div>`;
        if(returnData){
            tbodyData = "";
            returnData.map((value,index)=>{
                tbodyData += `
                            <tr>
                                <td>${value.employeeCode}</td>
                                <td>
                                    ${value.fullname}<br>
                                    <small><strong>${value.departmentName}<strong/></small><br>
                                    <small>${value.departmentName}</small>
                                </td>
                                <td class="text-center">${value.breakDuration}</td>
                            </tr>
                            `;
            });
        }
        html = `
        <table class="table table-bordered table-striped table-hover" id="overbreakTable" style="font-size:95%">
            <thead>
                <tr style="white-space: nowrap">
                    <th>Employee No.</th>
                    <th>Employee Name</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                ${tbodyData}
            </tbody>
        </tbody>
        `;  

        return html;
        
    }
    
    
    //------ MODULE FUNCTION IS ALLOWED UPDATE-----

    const allowedUpdate = isUpdateAllowed(70);
    if(!allowedUpdate){
        $("#page_content").find("input, select, textarea").each(function(){
            $(this).attr("disabled",true);
        });
        $("#btnSubmit").hide();
    }

    //------ END MODULE FUNCTION IS ALLOWED UPDATE-----

// ----- MODULE APPROVER -----
const moduleApprover = getModuleApprover("HR Dashboard");
// ----- END MODULE APPROVER -----


// ---- GET EMPLOYEE DATA -----
const allEmployeeData = getAllEmployeeData();
const employeeData = (id) => {
    if (id) {
        let data = allEmployeeData.filter(employee => employee.employeeID == id);
        let { employeeID, fullname, designation, department } = data && data[0];
        return { employeeID, fullname, designation, department };
    }
    return {};
}
const employeeFullname = (id) => {
    if (id != "-") {
        let data = employeeData(id);
        return data.fullname || "-";
    }
    return "-";
}
// ---- END GET EMPLOYEE DATA -----


// // ----- IS DOCUMENT REVISED -----
// function isDocumentRevised(id = null) {
//     if (id) {
//         const revisedDocumentsID = getTableData("fms_check_voucher_tbl", "revisevoucherID", "revisevoucherID IS NOT NULL");
//         return revisedDocumentsID.map(item => item.revisevoucherID).includes(id);
//     }
//     return false;
// }
// // ----- END IS DOCUMENT REVISED -----


// ----- VIEW DOCUMENT -----
function viewDocument(view_id = false, readOnly = false, isRevise = false, isFromCancelledDocument = false) {
    const loadData = (id, isRevise = false, isFromCancelledDocument = false) => {
        const tableData = getTableData("hris_salary_release_tbl", "", "salaryReleaseID=" + id);

        if (tableData.length > 0) {
            let {
                employeeID,
                payrollHoldStatus
            } = tableData[0];

            let isReadOnly = true, isAllowed = true;

            if (employeeID != sessionID) {
                isReadOnly = true;
                if (payrollHoldStatus == 0 || payrollHoldStatus == 4) {
                    isAllowed = false;
                }
            } else if (employeeID == sessionID) {
                if (payrollHoldStatus == 0) {
                    isReadOnly = false;
                } else {
                    isReadOnly = true;
                }
            } else {
                isReadOnly = readOnly;
            }

            if (isAllowed) {
                if (isRevise && employeeID == sessionID) {
                    pageContent(true, tableData, isReadOnly, true, isFromCancelledDocument);
                    updateURL(encryptString(id), true, true);
                } else {
                    pageContent(true, tableData, isReadOnly);
                    updateURL(encryptString(id));
                }
            } else {
                pageContent();
                updateURL();
            }
            
        } else {
            pageContent();
            updateURL();
        }
    }

    if (view_id) {
        let id = decryptString(view_id);
            id && isFinite(id) && loadData(id, isRevise, isFromCancelledDocument);
    } else {
        let url   = window.document.URL;
        let arr   = url.split("?view_id=");
        let isAdd = url.indexOf("?add");
        if (arr.length > 1) {
            let id = decryptString(arr[1]);
                id && isFinite(id) && loadData(id);
        } else if (isAdd != -1) {
            arr = url.split("?add=");
            if (arr.length > 1) {
                let id = decryptString(arr[1]);
                    id && isFinite(id) && loadData(id, true);
            } else {
                pageContent(true);
            }
        }
    }
    
}

function updateURL(view_id = 0, isAdd = false, isRevise = false) {
    if (view_id && !isAdd) {
        window.history.pushState("", "", `${base_url}hris/hr_dashboard?view_id=${view_id}`);
    } else if (isAdd) {
        if (view_id && isRevise) {
            window.history.pushState("", "", `${base_url}hris/hr_dashboard?add=${view_id}`);
        } else {
            window.history.pushState("", "", `${base_url}hris/hr_dashboard?add`);
        }
    } else {
        window.history.pushState("", "", `${base_url}hris/hr_dashboard`);
    }
}
// ----- END VIEW DOCUMENT -----

// const bankList = getTableData(
//     "fms_bank_tbl", 
//     "bankName,bankID",
//     "bankStatus = 1");


// GLOBAL VARIABLE - REUSABLE 
const dateToday = () => {
    return moment(new Date).format("YYYY-MM-DD HH:mm:ss");
};

// ----- DATATABLES -----
function initDataTables() {
    // if ($.fn.DataTable.isDataTable("#tableForApprroval")) {
    //     $("#tableForApprroval").DataTable().destroy();
    // }

    if ($.fn.DataTable.isDataTable("#tableMyForms")) {
        $("#tableMyForms").DataTable().destroy();
    }

    // var table = $("#tableForApprroval")
    //     .css({ "min-width": "100%" })
    //     .removeAttr("width")
    //     .DataTable({
    //         proccessing: false,
    //         serverSide: false,
    //         scrollX: true,
    //         sorting: [],
    //         scrollCollapse: true,
    //         columnDefs: [
    //             { targets: 0,  width: 100 },
    //             { targets: 1,  width: 150 },
    //             { targets: 2,  width: 120 },
    //             { targets: 3,  width: 250 },
    //             { targets: 4,  width: 150 },
    //             { targets: 5,  width: 250 },
    //             { targets: 6,  width: 80  },
    //             { targets: 7,  width: 220 },
    //         ],
    //     });

    var table = $("#tableMyForms")
        .css({ "min-width": "100%" })
        .removeAttr("width")
        .DataTable({
            proccessing: false,
            serverSide: false,
            scrollX: true,
            sorting: [],
            scrollCollapse: true,
            columnDefs: [
                { targets: 0,  width: 100 },
                { targets: 1,  width: 200 },
                { targets: 2,  width: 200 },
                { targets: 3,  width: 200 },
                { targets: 4,  width: 80 },
            ],
        });

    // var table = $("#tableInventoryReceivingItems")
    //     .css({ "min-width": "100%" })
    //     .removeAttr("width")
    //     .DataTable({
    //         proccessing: false,
    //         serverSide: false,
    //         scrollX: true,
    //         sorting: false,
    //         searching: false,
    //         paging: false,
    //         ordering: false,
    //         info: false,
    //         scrollCollapse: true,
    //         columnDefs: [
    //             { targets: 0,  width: 100 },
    //             { targets: 1,  width: 150 },
    //             { targets: 2,  width: 120 },
    //             { targets: 3,  width: 120 },
    //             { targets: 4,  width: 120  }
                
    //         ],
    //     });

    //     var table = $("#tableInventoryReceivingItems0")
    //     .css({ "min-width": "100%" })
    //     .removeAttr("width")
    //     .DataTable({
    //         proccessing: false,
    //         serverSide: false,
    //         paging: false,
    //         info: false,
    //         scrollX: true,
    //         scrollCollapse: true,
    //         columnDefs: [
    //             { targets: 0,  width: 100 },
    //             { targets: 1,  width: 150 },
    //             { targets: 2,  width: 120 },
    //             { targets: 3,  width: 120 },
    //             { targets: 4,  width: 120  }
              
    
    //         ],
    //     });

}
// ----- END DATATABLES -----


// ----- HEADER CONTENT -----
function headerTabContent(display = true) {
    if (display) {
        // if (isImModuleApprover("hris_salary_release_tbl", "approversID")) {
        //     let count = getCountForApproval("hris_salary_release_tbl", "payrollHoldStatus");
        //     let displayCount = count ? `<span class="ml-1 badge badge-danger rounded-circle">${count}</span>` : "";
            // <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#forApprovalTab" redirect="forApprovalTab">For Approval ${displayCount}</a></li>
            let html = `
            <div class="bh_divider appendHeader"></div>
            <div class="row clearfix appendHeader">
                <div class="col-12">
                    <ul class="nav nav-tabs">
                        <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#forApprovalTab" redirect="forApprovalTab">Employee Management</a></li>
                        <li class="nav-item"><a class="nav-link " data-toggle="tab" href="#myFormsTab" redirect="myFormsTab">Recruitment Dashboard</a></li>
                    </ul>
                </div>
            </div>`;
            $("#headerContainer").append(html);
        // }
    } else {
        $("#headerContainer").find(".appendHeader").remove();
    }
}
// ----- END HEADER CONTENT -----


// // ----- HEADER BUTTON -----
// function headerButton(isAdd = true, text = "Add", isRevise = false, isFromCancelledDocument = false) {
//     let html;
//     if (isAdd) {
//         if(isCreateAllowed(70)){

//             html =``;
//             // html = `
//             // <button type="button" class="btn btn-default btn-add" id="btnAdd"><i class="icon-plus"></i> &nbsp;${text}</button>`;
//         }
//     } else {
//         html = `
//         <button type="button" class="btn btn-default btn-light" id="btnBack" revise="${isRevise}" cancel="${isFromCancelledDocument}"><i class="fas fa-arrow-left"></i> &nbsp;Back</button>`;
//     }
//     $("#headerButton").html(html);
// }
// // ----- END HEADER BUTTON -----


// ----- FOR APPROVAL CONTENT -----
function forApprovalContent() {
    $("#tableForApprovalParent").html(preloader);

    const countActiveOrganicEmployee = getTableData(`hris_employee_list_tbl`,
    `COUNT(employeeID) AS employeeActiveOrganic`,
    `(employeeStatus = 1 OR employeeStatus = 2) AND scheduleID != 0  `);

    const countActiveNonOrganicEmployee = getTableData(`hris_employee_list_tbl`,
    `COUNT(employeeID) AS employeeActiveNonOrganic`,
    `(employeeStatus = 1 OR employeeStatus = 2) AND scheduleID = 0  `);

    const countPendingLeave = getTableData(`hris_leave_request_tbl`,
    `COUNT(leaveRequestStatus) AS pendingleaves`,
    `leaveRequestStatus = 2 AND (day(leaveRequestDateFrom)=day(now()) OR day(leaveRequestDateTo)=day(now()))`);

    const countPendingOvertmine = getTableData(`hris_overtime_request_tbl`,
    `COUNT(overtimeRequestStatus) AS pendingovertime`,
    `overtimeRequestStatus = 2 AND day(overtimeRequestDate)=day(now())`);

    const getEvents = getTableData(`hris_event_calendar_tbl`,
    `eventCalendarName,
    CASE 
    WHEN year(eventCalendarDateFrom)=year(now()) THEN eventCalendarDateFrom
    WHEN year(eventCalendarDateTo)=year(now()) THEN eventCalendarDateTo
    END AS eventDate`,
    `year(eventCalendarDateFrom)=year(now()) OR year(eventCalendarDateTo)=year(now())`,
    `eventDate ASC`);



    const getLate = getTableData(`hris_timekeeping_items_tbl`,
    ` COUNT(lateDuration) as lates , scheduleDate`,
    ` lateDuration > 0 AND day(scheduleDate)=day(now())`,
    ``,
    ``);
  const getAbsent = getTableData(`hris_timekeeping_items_tbl`,
    ` COUNT(timekeepingItemStatus) as absent,scheduleDate`,
    `  timekeepingItemStatus = 'ABSENT' AND day(scheduleDate)=day(now())`,
    ``,
    ``);


    const task = getTableData(`pms_employeetaskoard_tbl as pet
    LEFT JOIN pms_timeline_task_list_tbl as ptt ON ptt.taskID = pet.taskID AND ptt.timelineBuilderID = pet.timelineBuilderID
    LEFT JOIN pms_timeline_management_tbl as ptm  ON ptm.taskID = ptt.taskID
    LEFT JOIN pms_milestone_list_tbl as pml ON pml.projectMilestoneID = pet.projectMilestoneID 
    LEFT JOIN pms_milestone_builder_tbl as pmb ON pmb.milestoneBuilderID = pet.milestoneBuilderID OR pmb.milestoneBuilderID = ptt.milestoneBuilderID `, 
    `DISTINCT taskboardID,ptt.taskID,assignedEmployee,ptt.taskName,pet.taskStatus,pml.projectMilestoneName,CASE 
    WHEN pet.taskStartDates = "" THEN ptt.taskEndDate
    WHEN pet.taskStartDates !="" THEN pet.taskStartDates
    END taskStartDate,
    phaseCode `, 
    "assignedEmployee = "+sessionID);

    const subTask = getTableData(`pms_employeetaskoard_details_tbl as ped
    LEFT JOIN pms_timeline_management_tbl as ptm  ON ptm.taskID = ped.taskID
    LEFT JOIN pms_milestone_list_tbl as pml ON pml.projectMilestoneID = ped.projectMilestoneID
    LEFT JOIN pms_milestone_builder_tbl as pmb ON pmb.milestoneBuilderID = ped.milestoneBuilderID`, 
    `DISTINCT subtaskboardID,ped.taskID,subTaskAssignee,ped.subTaskName,ped.subTaskStatus,pml.projectMilestoneName,ped.subTaskStartDates,phaseCode`, 
    ` FIND_IN_SET(${sessionID},replace(ped.subTaskAssignee,'|',','))`);





let html = `        <div class="row clearfix row-deck">
                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="fas fa-users"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Organic</div>
                                        <h4 class="number mb-0">${countActiveOrganicEmployee[0].employeeActiveOrganic || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="far fa-user-hard-hat"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Non-organic</div>
                                        <h4 class="number mb-0">${countActiveNonOrganicEmployee[0].employeeActiveNonOrganic || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="fas fa-user-clock"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Leave</div>
                                        <h4 class="number mb-0">${countPendingLeave[0].pendingleaves || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="fas fa-stopwatch"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Overtime</div>
                                        <h4 class="number mb-0">${countPendingOvertmine[0].pendingovertime || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="fas fa-watch"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Late</div>
                                        <h4 class="number mb-0">${getLate[0].late || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div class="col-xl-2 col-lg-4 col-md-4 col-sm-12">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="fas fa-user-times"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Absent</div>
                                        <h4 class="number mb-0">${getAbsent[0].absent || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    <div class="row clearfix row-deck">
                        <div class="col-xl-6 col-lg-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">NO. OF EMPLOYEE (DEPARTMENT)</h2>
                                </div>
                                <div class="body">
                                    <div id="apex-basic-employee"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-6">
                            <div class="card">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">NO. OF EMPLOYEE (GENDER)</h2>
                                </div>
                                <div class="body">
                                    <div id="apex-employee-gender"></div>
                                </div>      
                            </div>
                        </div>

                        <div class="col-xl-3 col-lg-6">
                            <div class="card">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">YEARLY EVENTS</h2>
                                </div>

                                <div class="card-body" style="color:black;height: 400px; overflow-y: auto;"> `;

                                if(getEvents.length > 0){
                                    getEvents.map((event)=>{

                                        let{
                                            eventCalendarName,
                                            eventDate
                                        } = event;

                                            html+=`<div class="container card"  style="box-shadow:none !important;">
                                                <div class=" text-center mb-2 d-flex">
                                                    <div class=" square rounded bg-secondary" style="
                                                                            padding: 10px;
                                                                            width: min-content;
                                                                        "><small class="text-white font-weight-bolder m-0">${(moment(eventDate).format('MMM')).toUpperCase()}
                                                                        <h1 class="text-white font-weight-bolder">${moment(eventDate).format('DD')}</h1></small></div>
                                                                        <h6 class="font-weight-bolder p-0 pl-1 pt-3" style="width: fit-content;">${eventCalendarName}</h6>
                                                </div>
                                            </div>`;
                                    })
                                }else{
                                    html +=`<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                                    <img src="${base_url}assets/modal/no-data.gif" style="max-width: 300px;
                                        width: auto;
                                        min-width: 100px;
                                        height: auto;" alt="No event yet.">
                                    <span class="font-weight-bold">No event yet.</span>
                                </div>`
                                }
                                
                                    

                        html +=`</div>
                            </div>
                        </div>

                    </div>
                    
                    <div class="row clearfix row-deck">
                        <div class="col-xl-6 col-lg-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">NO. OF RESIGNED EMPLOYEE</h2>
                                </div>
                                <div class="body">
                                    <div id="apex-basic-employeeResign"></div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-6 col-lg-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">NO. OF EMPLOYEE (HIRED VS LEFT)</h2>
                                </div>
                                <div class="body">
                                    <div id="apex-employee-HiredAndLeft"></div>
                                </div>
                            </div>    
                        </div>

                        <div class="col-xl-12 col-lg-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">OVERBREAK MONITORING</h2>
                                </div>
                                <div class="body">
                                    ${getOverbreakData()}
                                </div>
                            </div>    
                        </div>
                    </div>`;


    setTimeout(() => {
        $("#tableForApprovalParent").html(html);
        noOfEmployeeHiredLeftChart();
        noOfEmployeeGenderChart();
        noOfEmployeeChart();
        noOfEmployeeResignChart();

        var table = $("#overbreakTable").css({"min-width": "100%"}).removeAttr('width').DataTable({
            proccessing:    false,
            serverSide:     false,
            scrollX:        true,
            scrollCollapse: true,
            lengthMenu: [ 50, 75, 100, 150],
            columnDefs: [
                { targets: 0, width:  110 },
                { targets: 2, width: 80 },
            ],
        });
        return html;
    }, 300);

}
// ----- END FOR APPROVAL CONTENT -----


// ---- FUNCIRON FOR EMPLOYEE PER DEPARTMENT CHART ------//
function noOfEmployeeChart(){

    const getListEmployeeData = getTableData(`hris_employee_list_tbl as employee`,
    ` COUNT(employeeID) AS employee, 
    (SELECT departmentName FROM hris_department_tbl WHERE departmentID = employee.departmentID)  AS departmentName`,
    ` employeeStatus = 1 OR employeeStatus = 2`,
    ``,
    `departmentID`);

    var listEmployee =[];
    var listDepartment =[];
    var listColorDepartment =[];

    var seriesData = [];

    
    getListEmployeeData.map((employeeList,index)=>{
        let obj ={};
        var randomColor = Math.floor(Math.random()*16777215).toString(16);

        let{
            employee,
            departmentName
        }= employeeList;
        
        listColorDepartment[index] = ("#"+randomColor);
        listDepartment[index] =departmentName; 
        listEmployee[index] = employee;

        obj['name'] =departmentName;
        obj["data"] = [employee];

        seriesData.push(obj);
    

    })


    // console.log(seriesData)


    // var options = {
    //     chart: {
    //         height: 300,
    //         type: 'bar',
    //     },
    //     colors: listColorDepartment,
    //     plotOptions: {
    //         bar: {
    //             horizontal: false,
    //             columnWidth: '20%',
    //             endingShape: 'flat'	
    //         },
    //     },
    //     dataLabels: {
    //         enabled: false,
    //     },
    //     stroke: {
    //         show: true,
    //         width: 2,
    //         colors: ['transparent']
    //     },
    //     series: seriesData,
    //     xaxis: {
    //         categories: listDepartment,
    //     },
    //     yaxis: {
    //         title: {
    //             text: 'Department Record/s'
    //         }
    //     },
    //     fill: {
    //         opacity: 1

    //     },
    //     tooltip: {
    //         y: {
    //             formatter: function (val) {
    //                 return  val + " employee/s"
    //             }
    //         }
    //     }
    // }

    var options = {
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        colors: listColorDepartment,
        grid: {
            yaxis: {
                lines: {
                    show: false,
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        // series: [{
        //     data: listEmployee
        // }],
        series:seriesData,
        xaxis: {
            categories: [''],
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#apex-basic-employee"),
        options
    );

    setTimeout(() => {
    chart.render();
     
    }, 300);
    
}

// ---- FUNCIRON FOR RESIGN EMPLOYEE CHART ------//
function noOfEmployeeResignChart(){

    const getListEmployeeData = getTableData(`hris_employee_list_tbl as employee`,
    ` COUNT(employeeID) AS employee, 
    (SELECT departmentName FROM hris_department_tbl WHERE departmentID = employee.departmentID)  AS departmentName`,
    ` employeeStatus = 0`,
    ``,
    `departmentID`);

    var listEmployee =[];
    var listDepartment =[];
    var listColorDepartment =[];

    var seriesData = [];
    
    getListEmployeeData.map((employeeList,index)=>{
        let obj ={};
        var randomColor = Math.floor(Math.random()*16777215).toString(16);

        let{
            employee,
            departmentName
        }= employeeList;
        
        listColorDepartment[index] = ("#"+randomColor);
        listDepartment[index] =departmentName; 

        obj["name"] = departmentName;
        obj["data"] = [employee];

        seriesData.push(obj);
    

    })


    var options = {
        chart: {
            height: 300,
            type: 'bar',
        },
        colors: listColorDepartment,
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
                endingShape: 'flat'	
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        series:seriesData,
        xaxis: {
            categories: [''],
        },
        yaxis: {
            title: {
                text: 'Department Record/s'
            }
        },
        fill: {
            opacity: 1

        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return  val + " employee/s"
                }
            }
        }
    }

    // var options = {
    //     chart: {
    //         height: 350,
    //         type: 'bar',
    //         toolbar: {
    //             show: false,
    //         },
    //     },
    //     colors: listColorDepartment,
    //     grid: {
    //         yaxis: {
    //             lines: {
    //                 show: false,
    //             }
    //         },
    //         padding: {
    //             top: 0,
    //             right: 0,
    //             bottom: 0,
    //             left: 0
    //         },
    //     },
    //     plotOptions: {
    //         bar: {
    //             horizontal: true,
    //         }
    //     },
    //     dataLabels: {
    //         enabled: false
    //     },
    //     // series: [{
    //     //     data: listEmployee
    //     // }],
    //     series:seriesData,
    //     xaxis: {
    //         categories: [''],
    //     }
    // }

    var chart = new ApexCharts(
        document.querySelector("#apex-basic-employeeResign"),
        options
    );

    setTimeout(() => {
    chart.render();
     
    }, 300);
    
}

// --- NO OF EMPLOYEE GENDER ----//
function noOfEmployeeGenderChart(){

    const getMaleCount = getTableData(`hris_employee_list_tbl`,
    `COUNT(employeeID) AS maleCount`,
    `(employeeStatus = 1 OR employeeStatus = 2) AND employeeGender = 'Male'`);

    const getFemaleCount = getTableData(`hris_employee_list_tbl`,
    `COUNT(employeeID) AS femaleCount`,
    `(employeeStatus = 1 OR employeeStatus = 2) AND employeeGender = 'Female'`);





    if(getMaleCount.length > 0 || getFemaleCount.length > 0){
 
        var options = {
            chart: {
                height: 300,
                type: 'donut',
            },
            labels: ["Male","Female"],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                show: true,
            },
            colors: ["#0db3d9","#cf64a6"],
            // series: [getMaleCount[0].maleCount,getFemaleCount[0].femaleCount],
            series: [parseFloat(getMaleCount[0].maleCount),parseFloat(getFemaleCount[0].femaleCount)],
    
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    
       var chart = new ApexCharts(
            document.querySelector("#apex-employee-gender"),
            options
        );
        
        chart.render();
    }else{
        let html =`<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                <img src="${base_url}assets/modal/no-data.gif" style="max-width: 300px;
                    width: auto;
                    min-width: 100px;
                    height: auto;" alt="No event yet.">
                <span class="font-weight-bold">No employee available.</span>
            </div>`

            $("#apex-employee-gender").html(html);
    }

    
}

// --- NO OF EMPLOYEE HIRED AND LEFT ----//
function noOfEmployeeHiredLeftChart (){

    const getCountEmployeeHired = getTableData(`hris_employee_list_tbl`,
    `COUNT(employeeID) AS employeeHired`,
    `employeeStatus = 1 OR employeeStatus = 2`);

    const getCountEmployeeLeft = getTableData(`hris_employee_list_tbl`,
    `COUNT(employeeID) AS employeeLeft`,
    `employeeStatus = 0 OR employeeStatus = 3 OR employeeStatus = 4  OR employeeStatus = 6`);





    if(getCountEmployeeHired.length > 0 || getCountEmployeeLeft.length > 0){
 
        var options = {
            chart: {
                height: 300,
                type: 'donut',
            },
            labels: ["Hired","Left"],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                show: true,
            },
            colors: ["#28a745","#dc3450"],
            series: [parseFloat(getCountEmployeeHired[0].employeeHired),parseFloat(getCountEmployeeLeft[0].employeeLeft)],
    
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    
       var chart = new ApexCharts(
            document.querySelector("#apex-employee-HiredAndLeft"),
            options
        );
        
        chart.render();
    }else{
        let html =`<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                <img src="${base_url}assets/modal/no-data.gif" style="max-width: 300px;
                    width: auto;
                    min-width: 100px;
                    height: auto;" alt="No event yet.">
                <span class="font-weight-bold">No employee available.</span>
            </div>`

            $("#apex-employee-HiredAndLeft").html(html);
    }

    
}

// // ---- EVENT FOR CHANGE YEAR PERIOD-----//
// $(document).on("change",".btnYear",function(){
//     let getYear = $(this).val(); 


//     $("#apex-basic-column").html(preloader); 
//     attendanceChart(getYear,getYear);
// })

// // -----  FUNCTION OPEN POSITION CHART ----//
function openPositionChart(){

    const getPosition = getTableData(` pms_personnel_requisition_tbl AS requisition
    LEFT JOIN hris_department_tbl AS dept
    ON dept.departmentID = requisition.departmentID
    LEFT JOIN hris_job_posting_tbl AS job
    ON job.requisitionID = requisition.requisitionID`,
    `  IFNULL(SUM(job.jobSlot),0) AS vacancy, dept.departmentName`,
    ``,
    ``,
    `departmentName`);


    // -- GET THE LENGTH OF DATA HAS VACANCY NUMBER----//
        var totalVacancy = 0;
        for (var i = 0; i < getPosition.length; i++) {
            totalVacancy += getPosition[i].vacancy << 0;
        }
    // -- GET THE LENGTH OF DATA HAS VACANCY NUMBER----//



    

    var openPositionVacancyData =[];
    var openPositionDepartmentData =[];
    var openPositionColorData =[];

    if(totalVacancy > 0){
        getPosition.map((positionList)=>{

            var randomColor = Math.floor(Math.random()*16777215).toString(16);

            let{
                vacancy,
                departmentName
            }= positionList;
            

            if(vacancy > 0 ){
                openPositionVacancyData.push(parseFloat(vacancy));
                openPositionDepartmentData.push(departmentName);
                openPositionColorData.push("#"+randomColor);
            }

    
        })

        var options = {
            chart: {
                height: 300,
                type: 'donut',
            },
            labels: openPositionDepartmentData.length > 0 ? openPositionDepartmentData : ["No open position available"],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                show: true,
            },
            colors: openPositionColorData.length > 0 ? openPositionColorData : ["#dc3450"],
            series: openPositionVacancyData.length > 0 ? openPositionVacancyData : [0],
    
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    
       var chart = new ApexCharts(
            document.querySelector("#apex-applicant-openPosition"),
            options
        );
        
        chart.render();
    }
    else{

        let html =`<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
            <img src="${base_url}assets/modal/no-data.gif" style="max-width: 300px;
                width: auto;
                min-width: 100px;
                height: auto;" alt="No event yet.">
            <span class="font-weight-bold">No open position available.</span>
        </div>`

        $("#apex-applicant-openPosition").html(html);
    }


}

// --- NO OF APPLICANTS ----//
function noOfApplicantChart(){

    const getNumPosition = getTableData(`web_applicant_list_tbl AS applicant`,
    `COUNT(applicantID) AS applicant, 
    (SELECT designationName FROM hris_designation_tbl WHERE designationID = applicantDesignationID) AS designationName`,
    `(applicantDesignationID != 0 AND applicantDesignationID IS NOT NULL)`,
    ``,
    `applicantDesignationID`);


    // -- GET THE LENGTH OF DATA HAS APPLICANT NUMBER----//
        var totalApplicantPosition = 0;
        for (var i = 0; i < getNumPosition.length; i++) {
            if(getNumPosition[i].designationName != null){
            totalApplicantPosition += getNumPosition[i].applicant << 0;
            }
        }
    // -- GET THE LENGTH OF DATA HAS APPLICANT NUMBER----//

    

    var numPositionCountData =[];
    var numPositionDesignationData =[];
    var numPositionColorData =[];

    if(totalApplicantPosition > 0){
        getNumPosition.map((positionList,index)=>{

            var randomColor = Math.floor(Math.random()*16777215).toString(16);

            let{
                applicant,
                designationName
            }= positionList;
            

            if(applicant > 0 ){
                numPositionCountData.push(parseFloat(applicant));
                numPositionDesignationData.push(designationName);
                numPositionColorData.push("#"+randomColor);
            }
        })

        var options = {
            chart: {
                height: 300,
                type: 'donut',
            },
            labels: numPositionDesignationData.length > 0 ? numPositionDesignationData : ["No  applicant available"],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                show: true,
            },
            colors: numPositionColorData.length > 0 ? numPositionColorData : ["#dc3450"],
            series: numPositionCountData.length > 0 ? numPositionCountData : [0],
    
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        }
    
       var chart = new ApexCharts(
            document.querySelector("#apex-applicant-listApplicant"),
            options
        );
        
        chart.render();
    }else{
        let html =`<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
                <img src="${base_url}assets/modal/no-data.gif" style="max-width: 300px;
                    width: auto;
                    min-width: 100px;
                    height: auto;" alt="No event yet.">
                <span class="font-weight-bold">No applicant available.</span>
            </div>`

            $("#apex-applicant-listApplicant").html(html);
    }

    
}


// ----- MY FORMS CONTENT -----
function myFormsContent() {
    $("#tableMyFormsParent").html(preloader);

    const countVacancyPosition = getTableData(`hris_job_posting_tbl`,
    ` IFNULL(SUM(jobSlot),0) AS vacancy`);

    const countPendingApplicants = getTableData(`web_applicant_list_tbl`,
    `COUNT(applicantStatus) as pendingApplicants`);

    const countPendingOvertmine = getTableData(`hris_overtime_request_tbl`,
    `COUNT(overtimeRequestStatus) AS pendingovertime`,
    `employeeID =${sessionID} AND overtimeRequestStatus   =0`);

    const listApplicants = getTableData(    `web_applicant_list_tbl AS applicant`, 
                                            `DISTINCT(applicant.applicantID),
                                            CONCAT('APPL-',SUBSTR(applicant.createdAt,3,2),'-',LPAD(applicant.applicantID, 5, '0')) AS applicantCode,
                                            CONCAT(applicant.applicantFirstname,' ', applicant.applicantLastname) AS fullname,
                                            (SELECT designationName FROM hris_designation_tbl WHERE designationID = applicantDesignationID ) AS designationName,
                                            (SELECT applicantInterviewerProgression FROM hris_applicant_interviewer_tbl AS subOne WHERE applicantID = applicant.applicantID AND 	applicantInterviewerNote IS NOT NULL ORDER BY subOne.applicantInterviewerID DESC LIMIT 1) as applicantInterviewerProgression,
                                            (SELECT applicantInterviewerStatus FROM hris_applicant_interviewer_tbl AS subOne WHERE applicantID = applicant.applicantID AND 	applicantInterviewerNote IS NOT NULL ORDER BY subOne.applicantInterviewerID DESC LIMIT 1) as applicantStatus`, 
                                            );




let html = `        <div class="row clearfix row-deck">
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="far fa-user-plus"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Vacant Position</div>
                                        <h4 class="number mb-0">${countVacancyPosition[0].vacancy || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="far fa-file-search"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Applicants</div>
                                        <h4 class="number mb-0">${countPendingApplicants[0].pendingApplicants || 0}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-6">
                            <div class="card top_widget">
                                <div class="body">
                                    <div class="icon"><i class="fas fa-users-class"></i> </div>
                                    <div class="content">
                                        <div class="text mb-2 text-uppercase">Currently Onboarding</div>
                                        <h4 class="number mb-0">${countPendingOvertmine[0].pendingovertime || 0 }</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                    </div>

                    <div class="row clearfix row-deck">
                    
                        <div class="col-xl-6 col-lg-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="header bg-primary ">
                                    <h2 class="font-weight-bold text-white">OPEN POSITION</h2>
                                    
                                </div>
                                <div class="body">
                                    <div id="apex-applicant-openPosition"></div>
                                </div>
                            </div>    
                        </div>

                        <div class="col-xl-6 col-lg-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="header bg-primary">
                                    <h2 class="font-weight-bold text-white">NO. OF APPLICANTS</h2>
                                </div>
                                <div class="body">
                                    <div id="apex-applicant-listApplicant"></div>
                                </div>
                            </div>    
                        </div>
                    </div>

                    <div class="row ">
                        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="card" style="box-shadow:none !important;">
                                <div class="card-header w-100 bg-primary text-white text-left">
                                    <h6 class="font-weight-bold">APPLICANT PROGRESSION</h6>
                                </div>

                            `;
                        
                            html += `
                                <div class="table table-responsive ">
                                    <table class="table table-bordered table-striped" id="tableMyForms">
                                        <thead>
                                            <tr style="white-space: nowrap">
                                                <th>Applicant Code</th>
                                                <th>Applicant Name</th>
                                                <th>Applied Position</th>
                                                <th>Progression</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody >`;
                                
                                    listApplicants.map((applicant) => {
                                        let {
                                            applicantCode,
                                            fullname,
                                            applicantInterviewerProgression,
                                            designationName,
                                            applicantStatus,
                                        } = applicant;
                                        if(applicantInterviewerProgression != "Job Order"){
                                            if(applicantStatus != "Waitlisted" || applicantStatus != "Cancelled"  ){
                                                html += `
                                                        <tr class="">
                                                            <td>${applicantCode || "-"}</td>
                                                            <td>${fullname || "-"}</td>
                                                            <td>${designationName || "-"}</td>
                                                            <td>${applicantInterviewerProgression || "-"}</td>
                                                            <td>${applicantStatus || "Pending"}</td>
                                                        </tr>`;
                                            }
                                        }
                                    });
                                
                                    html += `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                      `;


    setTimeout(() => {
        $("#tableMyFormsParent").html(html);
        initDataTables();
        openPositionChart();
        noOfApplicantChart();

        return html;
    }, 300);
}
// ----- END MY FORMS CONTENT -----


// // ----- FORM BUTTONS -----
// function formButtons(data = false, isRevise = false, isFromCancelledDocument = false) {
//     let button = "";
//     if (data) {
//         let {
//             voucherID     = "",
//             voucherStatus = "",
//             employeeID               = "",
//             approversID              = "",
//             approversDate            = "",
//             createdAt                = new Date
//         } = data && data[0];

//         let isOngoing = approversDate ? approversDate.split("|").length > 0 ? true : false : false;
//         if (employeeID === sessionID) {
//             if (voucherStatus == 0 || isRevise) {
//                 // DRAFT
//                 button = `
//                 <button 
//                     class="btn btn-submit px-5 p-2" 
//                     id="btnSubmit" 
//                     voucherID="${voucherID}"
//                     code="${getFormCode("CV", createdAt, voucherID)}"
//                     revise="${isRevise}" cancel="${isFromCancelledDocument}"><i class="fas fa-paper-plane"></i>
//                     Submit
//                 </button>`;

//                 if (isRevise) {
//                     button += `
//                     <button 
//                         class="btn btn-cancel  px-5 p-2" 
//                         id="btnCancel"
//                         revise="${isRevise}" cancel="${isFromCancelledDocument}"><i class="fas fa-ban"></i> 
//                         Cancel
//                     </button>`;
//                 } else {
//                     button += `
//                     <button 
//                         class="btn btn-cancel px-5 p-2"
//                         id="btnCancelForm" 
//                         voucherID="${voucherID}"
//                         code="${getFormCode("CV", createdAt, voucherID)}"
//                         revise=${isRevise}><i class="fas fa-ban"></i> 
//                         Cancel
//                     </button>`;
//                 }

                
//             } else if (voucherStatus == 1) {
//                 // FOR APPROVAL
//                 if (!isOngoing) {
//                     button = `
//                     <button 
//                         class="btn btn-cancel px-5 p-2"
//                         id="btnCancelForm" 
//                         voucherID="${voucherID}"
//                         code="${getFormCode("CV", createdAt, voucherID)}"
//                         status="${voucherStatus}"><i class="fas fa-ban"></i> 
//                         Cancel
//                     </button>`;
//                 }
//             } else if (voucherStatus == 2) {
//                 // DROP
//                 // button = `
//                 // <button type="button" 
//                 //     class="btn btn-cancel px-5 p-2"
//                 //     id="btnDrop" 
//                 //     voucherID="${encryptString(voucherID)}"
//                 //     code="${getFormCode("CV", createdAt, voucherID)}"
//                 //     status="${voucherStatus}"><i class="fas fa-ban"></i> 
//                 //     Drop
//                 // </button>`;
                
//             } else if (voucherStatus == 3) {
//                 // DENIED - FOR REVISE
//                 if (!isDocumentRevised(voucherID)) {
//                     button = `
//                     <button
//                         class="btn btn-cancel px-5 p-2"
//                         id="btnRevise" 
//                         voucherID="${encryptString(voucherID)}"
//                         code="${getFormCode("CV", createdAt, voucherID)}"
//                         status="${voucherStatus}"><i class="fas fa-clone"></i>
//                         Revise
//                     </button>`;
//                 }
//             } else if (voucherStatus == 4) {
//                 // CANCELLED - FOR REVISE
//                 if (!isDocumentRevised(voucherID)) {
//                     button = `
//                     <button
//                         class="btn btn-cancel px-5 p-2"
//                         id="btnRevise" 
//                         voucherID="${encryptString(voucherID)}"
//                         code="${getFormCode("CV", createdAt, voucherID)}"
//                         status="${voucherStatus}"
//                         cancel="true"><i class="fas fa-clone"></i>
//                         Revise
//                     </button>`;
//                 }
//             }
//         } else {
//             if (voucherStatus == 1) {
//                 if (isImCurrentApprover(approversID, approversDate)) {
//                     button = `
//                     <button 
//                         class="btn btn-submit px-5 p-2" 
//                         id="btnApprove" 
//                         voucherID="${encryptString(voucherID)}"
//                         code="${getFormCode("CV", createdAt, voucherID)}"><i class="fas fa-paper-plane"></i>
//                         Approve
//                     </button>
//                     <button 
//                         class="btn btn-cancel px-5 p-2"
//                         id="btnReject" 
//                         voucherID="${encryptString(voucherID)}"
//                         code="${getFormCode("CV", createdAt, voucherID)}"><i class="fas fa-ban"></i> 
//                         Deny
//                     </button>`;
//                 }
//             }
//         }
//     } else {
//         button = `
//         <button 
//             class="btn btn-submit px-5 p-2" 
//             id="btnSubmit"><i class="fas fa-paper-plane"></i> Submit
//         </button>
//         <button 
//             class="btn btn-cancel px-5 p-2" 
//             id="btnCancel"><i class="fas fa-ban"></i> 
//             Cancel
//         </button>`;
//     }
//     return button;
// }
// // ----- END FORM BUTTONS -----




// // ----- GET PURCHASE ORDER LIST -----
// function getPaymentRequestList(id = null, status = 0, display = true , voucherid= null) {
//     var exist = [];
//     var condition  ="";
    
//     // const paymentList = getTableData(
//     //     `fms_payment_request_tbl`,
//     //     "paymentRequestID ",`paymentStatus = 2`
//     // );
//     // paymentList.map(items=>{
//     //     exist.push(items.paymentRequestID);
//     // })

//     if(status === false){
        
//          condition  =`(ipot.paymentRequestStatus = 2 AND 
//             ((iir.voucherStatus != 1 AND 
//                 iir.voucherStatus != 0 AND 
//                 iir.voucherStatus != 3 AND 
//                 iir.voucherStatus != 4 AND 
//                 iir.voucherStatus != 5 AND 
//                 iir.voucherStatus != 2) OR 
//                 (iir.voucherStatus IS NULL)))`;
//     }
//     else{
        
//         condition  =`(ipot.paymentRequestStatus = 2 AND iir.paymentRequestID =${id} ) GROUP BY  ipot.paymentRequestID`;
//     }

//     const paymentRequestList = getTableData(
//         `fms_payment_request_tbl AS ipot
//             LEFT JOIN hris_employee_list_tbl AS helt  ON helt.employeeID = ipot.requestorID
//             LEFT JOIN hris_department_tbl AS dept ON dept.departmentID = helt.departmentID
//             LEFT JOIN hris_designation_tbl AS dsg ON dsg.designationID = helt.designationID
//             LEFT JOIN fms_check_voucher_tbl AS iir ON iir.paymentRequestID = ipot.paymentRequestID`,
//         `ipot.*, CONCAT(employeeFirstname, ' ', employeeLastname) AS fullname, dept.departmentName, dsg.designationName, 
//         helt.employeeUnit,
//         helt.employeeBuilding,
//         helt.employeeBarangay,
//         helt.employeeCity,
//         helt.employeeProvince,
//         helt.employeeCountry,
//         helt.employeeZipCode,
//         DATE_FORMAT(ipot.createdAt, '%M% %d, %Y') as requestorDate`,
//         `${condition}`
//     )

  
//     let html = '';
//     if (!status || status == 0) {
//         // html += paymentRequestList.filter(po => createdIRList.indexOf(po.purchaseOrderID) == -1 || po.purchaseOrderID == id).map(po => {
        
//         html += paymentRequestList.filter(payment => !exist.includes(payment.paymentRequestID) || payment.paymentRequestID == id).map(payment => {
// 			let address = `${payment.employeeUnit && titleCase(payment.employeeUnit)+" "}${payment.employeeBuilding && payment.employeeBuilding +" "}${payment.employeeBarangay && titleCase(payment.employeeBarangay)+", "}${payment.employeeCity && titleCase(payment.employeeCity)+", "}${payment.employeeProvince && titleCase(payment.employeeProvince)+", "}${payment.employeeCountry && titleCase(payment.employeeCountry)+", "}${payment.employeeZipCode && titleCase(payment.employeeZipCode)}`;

//             return `
//             <option 
//                 value      = "${payment.paymentRequestID}" 
//                 requestorname = "${payment.fullname}"
//                 department = "${payment.departmentName}"
//                 designation = "${payment.designationName}"
//                 address     = "${address}"
//                 checkvoucherid     = "${voucherid}"
//                 requestordate     = "${payment.requestorDate}"
//             ${payment.paymentRequestID == id && "selected"}>
//             ${getFormCode("PYRF", payment.createdAt, payment.paymentRequestID)}
//             </option>`;
//         })
//     } else {
//         html += paymentRequestList.map(payment => {
// 			let address = `${payment.employeeUnit && titleCase(payment.employeeUnit)+" "}${payment.employeeBuilding && payment.employeeBuilding +" "}${payment.employeeBarangay && titleCase(payment.employeeBarangay)+", "}${payment.employeeCity && titleCase(payment.employeeCity)+", "}${payment.employeeProvince && titleCase(payment.employeeProvince)+", "}${payment.employeeCountry && titleCase(payment.employeeCountry)+", "}${payment.employeeZipCode && titleCase(payment.employeeZipCode)}`;

//             return `
//             <option 
//             value      = "${payment.paymentRequestID}" 
//             requestorname = "${payment.fullname}"
//             department = "${payment.departmentName}"
//             designation = "${payment.designationName}"
//             address     = "${address}"
//             checkvoucherid     = "${voucherid}"
//             requestordate     = "${payment.requestorDate}"
//             ${payment.paymentRequestID == id && "selected"}>
//             ${getFormCode("PYRF", payment.createdAt, payment.paymentRequestID)}
//             </option>`;
//         })
//     }
//     return display ? html : paymentRequestList;
// }
// // ----- END GET PURCHASE ORDER LIST -----


// // ----- GET BUDGET SOURCE LIST -----
// function getBudgetSourceList(id = null, status = 0, display = true , voucherid= null) {
  
//     const budgetSourceList = getTableData(
//         `fms_chart_of_accounts_tbl AS chart 
//         LEFT JOIN fms_check_voucher_tbl AS fcv ON fcv.voucherBudgetSource = chart.chartOfAccountID `,
//         `chart.chartOfAccountID ,chart.accountName,chart.accountCode`,
//         `accountBudgetSource = 1 AND accountStatus =1`
//     )

//     let html = '';
   
//         html += budgetSourceList.map(budget => {

//             return `
//             <option 
//             value      = "${budget.chartOfAccountID}" 
//             accountname = "${budget.accountName}"
//             accountcode = "${budget.accountCode}"
//             checkvoucherid     = "${voucherid}"
//             ${budget.chartOfAccountID == id && "selected"}>
//             ${budget.accountName}
//             </option>`;
//         })
    
//     return display ? html : budgetSourceList;
// }
// // ----- END GET BUDGET SOURCE LIST -----

    // // ----- GET BANK LIST -----
    // function getBankList(id = null, display = true) {
    //     let html = `
	// 	<option 
	// 		value       = "0"
	// 		${id == "0" && "selected"}>Cash</option>`;
    //     html += bankList.map(employee => {
	// 		let bankName = `${employee.bankName}`;
	// 		let bankID = `${employee.bankID}`;

    //         return `
    //         <option 
    //             value       = "${employee.bankID}" 
    //             ${employee.bankID == id && "selected"}>
    //             ${employee.bankName}
    //         </option>`;
    //     })
    //     return display ? html : bankList;
    // }
    // // ----- END GET BANK LIST -----





// // ----- GET SERVICE ROW -----
// function getItemsRow(id, readOnly = false, voucherID = "") {
//     let html = "";
//     let requestItemsData;	
//     let purchaseOrder;	
//     let replenishmentList;	
//     if (voucherID) {
//         requestItemsData = getTableData(
//             `fms_check_voucher_details_tbl AS voucherdet
//             LEFT JOIN fms_check_voucher_tbl AS voucher USING(voucherID)`,
//             `voucher.paymentRequestID,
//             voucherdet.accountCode,
//             voucherdet.accountName,
//             voucherdet.debit,
//             voucherdet.credit,
//             voucher.voucherBudgetSource as chartOfAccountID,
//             voucherdet.balance`,
//             `voucherdet.voucherID = ${voucherID}`
//         )
//     } else {
//         replenishmentList = getTableData(
//             `fms_payment_request_tbl as  payment
//                 LEFT JOIN fms_finance_request_details_tbl AS  ffr ON ffr.pettyRepID = payment.pettyRepID
//                 LEFT JOIN fms_liquidation_tbl AS  flt ON flt.liquidationID  = ffr.liquidationID 
//                 LEFT JOIN fms_chart_of_accounts_tbl as chart ON chart.chartOfAccountID  = flt.chartOfAccountID `, 
//             "payment.paymentRequestID,chart.accountCode, chart.accountName,chart.chartOfAccountID,ffr.quantity * ffr.amount as amount", 
//             `payment.paymentRequestID = ${id} AND payment.paymentRequestStatus=2 AND payment.pettyRepID !=0 `
//         )

//         purchaseOrderList = getTableData(
//             `fms_payment_request_tbl as  payment
//             LEFT JOIN ims_purchase_order_tbl AS  ipo ON ipo.purchaseOrderID  = payment.purchaseOrderID 
//             LEFT JOIN fms_chart_of_accounts_tbl as chart ON chart.chartOfAccountID  = ipo.chartOfAccountID`, 
//             "payment.paymentRequestID,chart.accountCode, chart.accountName,chart.chartOfAccountID,ipo.grandTotalAmount as amount", 
//             `payment.paymentRequestID = ${id} AND payment.paymentRequestStatus=2 AND payment.purchaseOrderID !=0 `
//         )

//         if(purchaseOrderList.length){
//             requestItemsData = purchaseOrderList;
//         }else{
//             requestItemsData = replenishmentList;
//         }

            
//     }
//     if (requestItemsData.length > 0) {
//         requestItemsData.map((item, index) => {
       
//             let {
//                 paymentRequestID               = "",
//                 chartOfAccountID = "",
//                 accountCode                      = "",
//                 accountName                    = "",
//                 balance = "",
//                 debit="",
//                 credit="",
//                 amount = 0
//             } = item;

         
//             if (readOnly) {
//                 html += `
//                 <tr class="itemTableRow" paymentRequestID="${paymentRequestID}">
//                     <td>
//                         <div class="accountcode" accountid="${chartOfAccountID}"> ${accountCode || "-"}</div>
//                     </td>

//                     <td>
//                         <div class="accountname">${accountName || "-"}</div>
//                     </td>

//                     <td>
//                         <div class="debit  text-right">₱ ${debit || "-"}</div>
//                         <input type="hidden" name="debit" value="${debit || 0}">
//                     </td>

//                     <td>
//                         <div class="credit text-right" name="credit">₱ ${credit || "-"}</div>
//                         <input type="hidden" name="credit" value="${credit || 0}">
//                     </td>

//                     <td>
//                     <div class="balance text-right">₱ ${balance || "-"}</div>
//                     </td>
                   

//                 </tr>`;
//             } else {
//                 html += `
//                 <tr class="itemTableRow" paymentRequestID="${paymentRequestID}" >
			
//                 <td>
//                     <div class="accountcode" name="accountcode" accountid="${chartOfAccountID}" ${voucherID ? prevbudgetsource="${chartOfAccountID}" : ""} >${ accountCode || "-"}</div>
//                 </td>

//                 <td>
//                     <div class="accountname" name="accountname">${ accountName || "-"}</div>
//                 </td>
               
// 				<td>
//                  <div class="input-group">
//                     <div class="input-group-prepend">
//                         <span class="input-group-text">₱</span>
//                     </div>
//                     <input type="text" 
//                     class="form-control amount"  
//                     data-allowcharacters="[0-9]" 
//                     min="0" max="${voucherID ? debit : amount}"
//                     minlength="1" 
//                     maxlength="13" 
//                     id="debit${index}" 
//                     name="debit" 
//                     value="${voucherID ? debit : amount}" 
//                     ${credit !=0 ? "" : "disabled"} 
//                     style="text-align: right;">
//                     <div class="invalid-feedback d-block" id="invalid-debit${index}"></div>
//                 </div>
//                 </td>

//                 <td>
//                 <div class="input-group">
//                     <div class="input-group-prepend">
//                         <span class="input-group-text">₱</span>
//                     </div>
//                     <input type="text" 
//                     class="form-control amount"  
//                     min="0" max="${voucherID ? credit :"" }"
//                     minlength="1" 
//                     maxlength="13" 
//                     name="credit" 
//                     id="credit${index}" 
//                     value="${voucherID ? credit : ""}" 
//                     style="text-align: right;">
//                 </div>
//                 </td>

//                 <td>
//                     <div class="input-group">
//                         <div class="input-group-prepend">
//                             <span class="input-group-text">₱</span>
//                         </div>
//                         <input type="text" 
//                         class="form-control amount"  
//                         min="0" max="${voucherID ? credit :"" }"
//                         minlength="1" 
//                         maxlength="13" 
//                         id="balance${index}" 
//                         name="balance"
//                         value="${voucherID ? balance : ""}" 
//                         style="text-align: right;">
//                         <div class="invalid-feedback d-block" id="invalid-balance${index}"></div>
//                     </div>
//                 </td>

// 			</tr>`;

//             }
//         })
       
        
//     } else {
//         html += `
//         <tr class="text-center">
//             <td colspan="9">No data available in table</td>
//         </tr>`
//     }

//     return html;
    
// }
// // ----- END GET SERVICE ROW -----

// // ----- GET SERVICE ROW CREDIT -----
// function getItemsRowCredit(id, readOnly = false, voucherID = "") {
//     let html = "";
//     let chartOfAcccts;	
//     // if (voucherID) {


//         // chartOfAcccts = getTableData(
//         //     `fms_check_voucher_details_tbl AS voucherdet
//         //     LEFT JOIN fms_check_voucher_tbl AS voucher USING(voucherID)`,
//         //     `voucher.paymentRequestID,
//         //     voucherdet.accountCode,
//         //     voucherdet.accountName,
//         //     voucherdet.debit,
//         //     voucherdet.credit,
//         //     voucherdet.balance`,
//         //     `voucherdet.voucherID = ${voucherID}`
//         // )
//     // } else {
//         chartOfAcccts = getTableData(  
//             `fms_chart_of_accounts_tbl `, 
//             "accountCode, accountName,chartOfAccountID", 
//             `chartOfAccountID  = ${id} AND accountStatus=1 AND accountBudgetSource =1 `
//         )
//     // }
    
//         chartOfAcccts.map((item, index) => {
       
//             let {
              
//                 chartOfAccountID = "",
//                 accountCode                      = "",
//                 accountName                    = "",
//                 balance = "",
//                 debit="",
//                 credit=""
//             } = item;

//             if (readOnly) {
//                 html += `
//                 <tr class="itemTableRow">
//                     <td>
//                         <div class="accountcode" accountid="${chartOfAccountID}" prevbudgetsource="${chartOfAccountID}"> ${accountCode || "-"}</div>
//                     </td>

//                     <td>
//                         <div class="accountname">${accountName || "-"}</div>
//                     </td>

//                     <td>
//                         <div class="debit  text-right">₱ ${debit || "-"}</div>
//                         <input type="hidden" name="debit" value="${debit || 0}">
//                     </td>

//                     <td>
//                         <div class="credit text-right" name="credit">₱ ${credit || "-"}</div>
//                         <input type="hidden" name="credit" value="${credit || 0}">
//                     </td>

//                     <td>
//                     <div class="balance text-right">₱ ${balance || "-"}</div>
//                     </td>
                   

//                 </tr>`;
//             } else {
//                 html += `
//                 <tr class="itemTableRow">
			
//                 <td>
//                     <div class="accountcode" name="accountcode" accountid="${chartOfAccountID}" prevbudgetsource="${chartOfAccountID}">${ accountCode || "-"}</div>
//                 </td>

//                 <td>
//                     <div class="accountname" name="accountname">${ accountName || "-"}</div>
//                 </td>
               
// 				<td>
//                 <div class="input-group">
//                     <div class="input-group-prepend">
//                         <span class="input-group-text">₱</span>
//                     </div>
//                     <input type="text" 
//                     class="form-control amount text-right"  
//                     data-allowcharacters="[0-9]" 
//                     min="0" max="${voucherID ? debit : ""}"
//                     minlength="1" 
//                     maxlength="13" 
//                     id="debits${index}" 
//                     name="debit" 
//                     value="${voucherID ? debit : ""}" >
//                     <div class="invalid-feedback d-block" id="invalid-debits${index}"></div>
//                 </div>
//                 </td>

//                 <td>
//                  <div class="input-group">
//                     <div class="input-group-prepend">
//                         <span class="input-group-text">₱</span>
//                     </div>
//                     <input type="text" 
//                     class="form-control amount text-right"  
//                     data-allowcharacters="[0-9]" 
//                     min="0" max="${voucherID ? credit : ""}"
//                     minlength="1" 
//                     maxlength="13" 
//                     id="credits${index}" 
//                     name="credit" 
//                     value="${voucherID ? credit : ""}"  >
//                     <div class="invalid-feedback d-block" id="invalid-credits${index}"></div>
//                 </div>
//                 </td>

//                 <td>
//                   <div class="input-group">
//                     <div class="input-group-prepend">
//                         <span class="input-group-text">₱</span>
//                     </div>
//                     <input type="text" 
//                     class="form-control amount text-right"  
//                     data-allowcharacters="[0-9]" 
//                     min="0" max="${voucherID ? balance : ""}"
//                     minlength="1" 
//                     maxlength="13" 
//                     id="balances${index}" 
//                     name="balance" 
//                     value="${voucherID ? balance : ""}"   >
//                     <div class="invalid-feedback d-block" id="invalid-balances${index}"></div>
//                 </div>
//                 </td>

// 			</tr>`;

//             }
//         })
        
    
//     return html;
    
// }
// // ----- END GET SERVICE ROW CREDIT -----

// // ----- SELECT PURCHASE ORDER -----
// $(document).on("change", "[name=voucherBudgetSource]", function() {
//     const accountname = $('option:selected', this).attr("accountname");
//     const accountcode = $('option:selected', this).attr("accountcode");
//     const id 					= $(this).val();
//     let checkvoucherid 	= $('option:selected', this).attr("checkvoucherid");
//     let executeonce 	        = $(this).attr("executeonce") == "true";
//     var readOnly			    = $(this).attr("disabled") == "disabled";
//     const status                = $(this).attr("status");
//     checkvoucherid        = executeonce ? checkvoucherid : null;

//     var prevBudgetSource = $(".purchaseOrderItemsBody").find("tr:last").find("td [name=accountcode]").attr("prevbudgetsource") || 0;
//     if(prevBudgetSource != id && prevBudgetSource != 0 ){
//         $(".purchaseOrderItemsBody").find("tr:last").remove(); // remove last child in table
//     }

//     if(id ==1){
//         $("[name=checkNo]").prop("disabled",true);
//         $("[name=checkNo]").val("");
//         $("[name=checkNo]").removeAttr("required");
//         $("[name=checkNo]").removeClass("is-invalid").removeClass("is-valid");
//         $("#invalid-checkNo").text("");
//     }else{
//         $("[name=checkNo]").prop("disabled",false);
//         $("[name=checkNo]").val("");
//         $("[name=checkNo]").attr("required",true);
//         $("#invalid-checkNo").text("");



//     }

  
    

//     // $("[name=requestorName]").val(requestorname);
//     // $("[name=requestorPosition]").val(designation);
//     // $("[name=requestorDepartment]").val(department);
//     // $("[name=requestorAddress]").val(address);
//     // $("[name=requestorDate]").val(requestordate);
//     // $(".purchaseOrderItemsBody").html('<tr><td colspan="8">'+preloader+'</td></tr>');

//     let purchaseOrderItemsBody = getItemsRowCredit(id, readOnly, checkvoucherid);
//     setTimeout(() => {
//         $(".purchaseOrderItemsBody").append(purchaseOrderItemsBody);
//         initAll();
//         updateTotalDebit();
//         updateTotalCredit();
//         $(this).removeAttr("executeonce");
//     }, 300);
// })
// // ----- END SELECT PURCHASE ORDER -----


// // ----- SELECT PURCHASE ORDER -----
// $(document).on("change", "[name=paymentRequestID]", function() {
//     const department = $('option:selected', this).attr("department");
//     const designation = $('option:selected', this).attr("designation");
//     const address = $('option:selected', this).attr("address");
//     const requestorname = $('option:selected', this).attr("requestorname");
//     const requestordate = $('option:selected', this).attr("requestordate");
//     const id 					= $(this).val();
//     let checkvoucherid 	= $('option:selected', this).attr("checkvoucherid");
//     let executeonce 	        = $(this).attr("executeonce") == "true";
//     var readOnly			    = $(this).attr("disabled") == "disabled";
//     const status                = $(this).attr("status");
//     checkvoucherid        = executeonce ? checkvoucherid : null;
//     var prevPaymentID = $(this).attr("prevPaymentID") ||0;
//     console.log(prevPaymentID)
//     if(prevPaymentID != 0){
//         $('#voucherBudgetSource').val($('#voucherBudgetSource option:first-child').val()).trigger('change');
//     }
//     $(this).attr("prevPaymentID",id);

//     $("#invalid-voucherBudgetSource").text("");
//     $("[name=requestorName]").val(requestorname);
//     $("[name=requestorPosition]").val(designation);
//     $("[name=requestorDepartment]").val(department);
//     $("[name=requestorAddress]").val(address);
//     $("[name=requestorDate]").val(requestordate);
//     $(".purchaseOrderItemsBody").html('<tr><td colspan="8">'+preloader+'</td></tr>');

//     let purchaseOrderItemsBody = getItemsRow(id, readOnly, checkvoucherid);
//     setTimeout(() => {
//         $(".purchaseOrderItemsBody").html(purchaseOrderItemsBody);
//         initAll();
//         updateTotalDebit();
//         updateTotalCredit();
//         $(this).removeAttr("executeonce");
//     }, 300);
// })
// // ----- END SELECT PURCHASE ORDER -----

	// // ----- GET AMOUNT -----
	// const getNonFormattedAmount = (amount = "₱0.00") => {
	// 	return +amount.replaceAll(",", "").replaceAll("₱", "")?.trim();
	// }
	// // ----- END GET AMOUNT -----


	// // ----- KEYUP QUANTITY OR UNITCOST -----
	// $(document).on("keyup", "[name=debit]", function() {
	// 	// const tableRow  = $(this).closest("tr");
	// 	// const quantity  = +getNonFormattedAmount(tableRow.find(`[name="quantity"]`).first().val());
	// 	// const unitcost  = +getNonFormattedAmount(tableRow.find(`[name="unitCost"]`).first().val());
	// 	// const totalcost = quantity * unitcost;
	// 	// tableRow.find(`.totalcost`).first().text(formatAmount(totalcost, true));
    //     updateTotalDebit();
    //     updateTotalCredit();
	// })
	// // ----- END KEYUP QUANTITY OR UNITCOST -----

    //     // ----- UPDATE TOTAL DEBIT -----
	// function updateTotalDebit() {
	// 	const debitArr = $.find(`[name=debit]`).map(element => getNonFormattedAmount(element.value) || "0");
	// 	const creditArr = $.find(`[name=credit]`).map(element => getNonFormattedAmount(element.value) || "0");
	// 	const totalDebit = debitArr.map((dbt) => +dbt ).reduce((a,b) => a + b, 0);
	// 	const totalCredit = creditArr.map((cdt) => +cdt ).reduce((a,b) => a + b, 0);
	// 	// $(`#totalAmount`).text(formatAmount(totalAmount, true));
    //     console.log(debitArr)
    //     $(".computedebit").text(formatAmount(totalDebit, true));

    //     if(parseFloat(totalDebit) != parseFloat(totalCredit) ){
    //           // $("[name=debit] :last").each(function(){
    //         //     if($(this).val() != 0){
    //             $("[name=debit] :last").addClass("is-invalid");
    //             //     }
    //             // });
    
    //             // $("[name=credit] :last").each(function(){
    //             //     if($(this).val() != 0){
    //                     $("[name=credit] :last").addClass("is-invalid");
    //             //     }
    //             // });
    //         $("#invalid-totalDebit").text("Should be equal to credit!");
    //     }else{
    //         $("[name=debit]").each(function(){
              
    //             $(this).removeClass("is-invalid");
            
    //     });

    //     $("[name=credit]").each(function(){
          
    //             $(this).removeClass("is-invalid");
            
    //     });

    //         $("#invalid-totalDebit").text("");
    //     }
      
	// 	return totalDebit;

       
	// }
	// // ----- END UPDATE TOTAL DEBIT -----

    // 	// ----- KEYUP QUANTITY OR UNITCOST -----
	// $(document).on("keyup", "[name=credit]", function() {
	// 	// const tableRow  = $(this).closest("tr");
	// 	// const quantity  = +getNonFormattedAmount(tableRow.find(`[name="quantity"]`).first().val());
	// 	// const unitcost  = +getNonFormattedAmount(tableRow.find(`[name="unitCost"]`).first().val());
	// 	// const totalcost = quantity * unitcost;
	// 	// tableRow.find(`.totalcost`).first().text(formatAmount(totalcost, true));
	// 	updateTotalDebit();
    //     updateTotalCredit();
	// })
	// // ----- END KEYUP QUANTITY OR UNITCOST -----

    //     // ----- UPDATE TOTAL DEBIT -----
	// function updateTotalCredit() {
	// 	const debitArr = $.find(`[name=debit]`).map(element => getNonFormattedAmount(element.value) || "0");
	// 	const creditArr = $.find(`[name=credit]`).map(element => getNonFormattedAmount(element.value) || "0");
	// 	const totalDebit = debitArr.map((dbt) => +dbt ).reduce((a,b) => a + b, 0);
	// 	const totalCredit = creditArr.map((cdt) => +cdt ).reduce((a,b) => a + b, 0);
	// 	// $(`#totalAmount`).text(formatAmount(totalAmount, true));
    //     $(".computecredit").text(formatAmount(totalCredit, true));

    //     if(parseFloat(totalDebit) != parseFloat(totalCredit) ){
    //         // $("[name=debit] :last").each(function(){
    //         //     if($(this).val() != 0){
    //                 $("[name=debit]:last").addClass("is-invalid");
    //         //     }
    //         // });

    //         // $("[name=credit] :last").each(function(){
    //         //     if($(this).val() != 0){
    //                 $("[name=credit]:last").addClass("is-invalid");
    //         //     }
    //         // });
    //         $("#invalid-totalCredit").text("Should be equal to debit!");
    //     }else{
    //         $("[name=debit]").each(function(){
              
    //                 $(this).removeClass("is-invalid");
                
    //         });

    //         $("[name=credit]").each(function(){
              
    //                 $(this).removeClass("is-invalid");
                
    //         });
    //         $("#invalid-totalCredit").text("");
    //     }
      
	// 	return totalCredit;

       
	// }
	// // ----- END UPDATE TOTAL DEBIT -----




// // ----- FORM CONTENT -----
// function formContent(data = false, readOnly = false, isRevise = false, isFromCancelledDocument = false) {
//     $("#page_content").html(preloader);
//     readOnly = isRevise ? false : readOnly;

//     let {
//         voucherID        = "",
//         reviseVoucherID  = "",
//         employeeID              = "",
//         paymentRequestID               = "",
//         voucherBudgetSource	 ="",
//         voucherRemarks  = "",
//         checkNo  = "",
//         voucherTinPayee ="",
//         voucherDescription  = "",
//         approversID             = "",
//         approversStatus         = "",
//         approversDate           = "",
//         voucherStatus   = false,
//         submittedAt             = false,
//         createdAt               = false,
//     } = data && data[0];


//     let purchaseOrderItems = "";
//     if (voucherID) {
//         purchaseOrderItems = getItemsRow(paymentRequestID, readOnly, voucherID);
//     } 

//     // ----- GET EMPLOYEE DATA -----
//     let {
//         fullname:    employeeFullname    = "",
//         department:  employeeDepartment  = "",
//         designation: employeeDesignation = "",
//     } = employeeData(data ? employeeID : sessionID);
//     // ----- END GET EMPLOYEE DATA -----

//     readOnly ? preventRefresh(false) : preventRefresh(true);

//     $("#btnBack").attr("voucherID", voucherID);
//     $("#btnBack").attr("status", voucherStatus);
//     $("#btnBack").attr("employeeID", employeeID);
//     $("#btnBack").attr("cancel", isFromCancelledDocument);

//     let disabled = readOnly ? "disabled" : "";
	

//     // let disabledReference = purchaseOrderID && purchaseOrderID != "0" ? "disabled" : disabled;

//     let tableInventoryReceivingItems = !disabled ? "tableInventoryReceivingItems" : "tableInventoryReceivingItems0";

//     let button = formButtons(data, isRevise, isFromCancelledDocument);
//     let reviseDocumentNo    = isRevise ? voucherID  : reviseVoucherID ;
//     let documentHeaderClass = isRevise || reviseVoucherID  ? "col-lg-4 col-md-4 col-sm-12 px-1" : "col-lg-2 col-md-6 col-sm-12 px-1";
//     let documentDateClass   = isRevise || reviseVoucherID  ? "col-md-12 col-sm-12 px-0" : "col-lg-8 col-md-12 col-sm-12 px-1";
//     let documentReviseNo    = isRevise || reviseVoucherID  ? `
//     <div class="col-lg-4 col-md-4 col-sm-12 px-1">
//         <div class="card">
//             <div class="body">
//                 <small class="text-small text-muted font-weight-bold">Revised Document No.</small>
//                 <h6 class="mt-0 text-danger font-weight-bold">
//                     ${getFormCode("CV", createdAt, reviseDocumentNo)}
//                 </h6>      
//             </div>
//         </div>
//     </div>` : "";

//     let html = `
//     <div class="row px-2">
//         ${documentReviseNo}
//         <div class="${documentHeaderClass}">
//             <div class="card">
//                 <div class="body">
//                     <small class="text-small text-muted font-weight-bold">Document No.</small>
//                     <h6 class="mt-0 text-danger font-weight-bold">
//                         ${voucherID  && !isRevise ? getFormCode("CV", createdAt, voucherID) : "---"}
//                     </h6>      
//                 </div>
//             </div>
//         </div>
//         <div class="${documentHeaderClass}">
//             <div class="card">
//                 <div class="body">
//                     <small class="text-small text-muted font-weight-bold">Status</small>
//                     <h6 class="mt-0 font-weight-bold">
//                         ${voucherStatus && !isRevise ? getStatusStyle(voucherStatus) : "---"}
//                     </h6>      
//                 </div>
//             </div>
//         </div>
//         <div class="${documentDateClass}">
//             <div class="row m-0">
//             <div class="col-lg-4 col-md-4 col-sm-12 px-1">
//                 <div class="card">
//                     <div class="body">
//                         <small class="text-small text-muted font-weight-bold">Date Created</small>
//                         <h6 class="mt-0 font-weight-bold">
//                             ${createdAt && !isRevise ? moment(createdAt).format("MMMM DD, YYYY hh:mm:ss A") : "---"}
//                         </h6>      
//                     </div>
//                 </div>
//             </div>
//             <div class="col-lg-4 col-md-4 col-sm-12 px-1">
//                 <div class="card">
//                     <div class="body">
//                         <small class="text-small text-muted font-weight-bold">Date Submitted</small>
//                         <h6 class="mt-0 font-weight-bold">
//                             ${submittedAt && !isRevise ? moment(submittedAt).format("MMMM DD, YYYY hh:mm:ss A") : "---"}
//                         </h6>      
//                     </div>
//                 </div>
//             </div>
//             <div class="col-lg-4 col-md-4 col-sm-12 px-1">
//                 <div class="card">
//                     <div class="body">
//                         <small class="text-small text-muted font-weight-bold">Date Approved</small>
//                         <h6 class="mt-0 font-weight-bold">
//                             ${getDateApproved(voucherStatus, approversID, approversDate)}
//                         </h6>      
//                     </div>
//                 </div>
//             </div>
//             </div>
//         </div>
//         <div class="col-sm-12 px-1">
//             <div class="card">
//                 <div class="body">
//                     <small class="text-small text-muted font-weight-bold">Remarks</small>
//                     <h6 class="mt-0 font-weight-bold">
//                         ${voucherRemarks && !isRevise ? voucherRemarks : "---"}
//                     </h6>      
//                 </div>
//             </div>
//         </div>
//     </div>
    
    

//     <div class="row" id="form_inventory_receiving">

//         <div class="col-md-4 col-sm-12">
//             <div class="form-group">
//                 <label>Employee Name</label>
//                 <input type="text" class="form-control" disabled value="${employeeFullname}">
//             </div>
//         </div>
//         <div class="col-md-4 col-sm-12">
//             <div class="form-group">
//                 <label>Department</label>
//                 <input type="text" class="form-control" disabled value="${employeeDepartment}">
//             </div>
//         </div>
//         <div class="col-md-4 col-sm-12">
//             <div class="form-group">
//                 <label>Position</label>
//                 <input type="text" class="form-control" disabled value="${employeeDesignation}">
//             </div>
//         </div>

//         <div class="col-md-3 col-sm-12">
//             <div class="form-group">
//                 <label>Reference No. ${!disabled ? "<code>*</code>" : ""}</label>
//                 <select class="form-control validate select2"
//                     name="paymentRequestID"
//                     id="paymentRequestID"
//                     style="width: 100%"
//                     required
//                     ${disabled}
//                     voucherID ="${voucherID}"
//                     readonly="${disabled}"
//                     status="${voucherStatus}"
//                     executeonce="${voucherStatus ? true : false}"
//                    >
//                     <option selected disabled>Select Reference No.</option>
//                     ${getPaymentRequestList(paymentRequestID, voucherStatus,true,voucherID)}           
//                 </select>
//                 <div class="d-block invalid-feedback" id="invalid-paymentRequestID"></div>
//             </div>
//         </div>

//         <div class="col-md-3 col-sm-12">
//             <div class="form-group">
//                 <label>Requestor</label>
//                 <input type="text" class="form-control" name="requestorName" disabled value="">
//             </div>
//         </div>

//         <div class="col-md-3 col-sm-12">
//             <div class="form-group">
//                 <label>Position</label>
//                 <input type="text" class="form-control" name="requestorPosition" disabled value="">
//             </div>
//         </div>

//         <div class="col-md-3 col-sm-12">
//             <div class="form-group">
//                 <label>Department</label>
//                 <input type="text" class="form-control" name="requestorDepartment" disabled value="">
//             </div>
//         </div>

//         <div class="col-md-4 col-sm-12">
//             <div class="form-group">
//                 <label>Address</label>
//                 <input type="text" class="form-control" name="requestorAddress" disabled value="">
//             </div>
//         </div>

//         <div class="col-md-4 col-sm-12">
//             <div class="form-group">
//                 <label>TIN of Payee</label>
//                 <input 
//                 type="text" 
//                 class="form-control inputmask" 
//                 id="voucherTinPayee"
//                 name="voucherTinPayee"
//                 value="${voucherTinPayee}"
//                 data-allowcharacters="[0-9]" 
//                 minlength="15" 
//                 maxlength="15" 
//                 mask="999-999-999-999"
//                 ${disabled}>
             
//             </div>
//         </div>

//         <div class="col-md-4 col-sm-12">
//                 <div class="form-group">
//                 <label>Date</label>
//                 <input type="text" class="form-control" name="requestorDate" disabled value="">
//             </div>
//         </div>

        

//         <div class="col-md-12 col-sm-12">
//             <div class="form-group">
//                 <label>Description ${!disabled ? "<code>*</code>" : ""}</label>
//                 <textarea 
//                 rows="2" 
//                 style="resize: none" 
//                 class="form-control validate" 
//                 name="voucherDescription" 
//                 id="voucherDescription" 
//                 data-allowcharacters="[A-Z][a-z][0-9][.][,][?][!][/][;][:]['][''][-][_][(][)][%][&][*][ ]"
//                 minlength="2"
//                 maxlength="150"
//                 required
//                 ${disabled}>${ voucherDescription || ""}</textarea>
//                 <div class="d-block invalid-feedback" id="invalid-voucherDescription"></div>
//             </div>
//         </div>

//         <div class="col-md-6 col-sm-12">
//             <div class="form-group">
//                 <label>Budget Source ${!disabled ? "<code>*</code>" : ""}</label>
//                 <select class="form-control validate select2"
//                     name="voucherBudgetSource"
//                     id="voucherBudgetSource"
//                     style="width: 100%"
//                     required
//                     voucherID ="${voucherID}"
//                     readonly="${disabled}"
//                     status="${voucherStatus}"
//                     executeonce="${voucherStatus ? true : false}"
//                     ${disabled}
//                     >
//                     <option selected disabled>Select Budget Source</option>
//                     ${getBudgetSourceList(voucherBudgetSource,voucherStatus,true,voucherID)}     
//                 </select>
//                 <div class="d-block invalid-feedback" id="invalid-voucherBudgetSource"></div> 
//             </div>
//         </div>

//         <div class="col-md-6 col-sm-12">
//             <div class="form-group">
//                 <label>Check No.</label>
//                 <input 
//                 type="text" 
//                 class="form-control validate" 
//                 id="checkNo"
//                 name="checkNo"
//                 data-allowcharacters="[0-9][-]"
//                 minlength="7"
//                 maxlength="10"
//                 value="${checkNo || ""}"
//                 ${voucherBudgetSource == 1 ? "disabled" :"required"}
//                 ${disabled}
//                >
//                 <div class="d-block invalid-feedback" id="invalid-checkNo"></div>
//             </div>
//         </div>

//         <div class="col-sm-12">
//             <div class="w-100">
//                 <hr class="pb-1">
//                 <div class="text-primary font-weight-bold" style="font-size: 1.5rem;">Detail/s: </div>
//                 <table class="table table-striped" id="${tableInventoryReceivingItems}">
//                     <thead>
//                         <tr style="white-space: nowrap">
//                             <th>Account No.</th>
//                             <th>Account Name</th>
//                             <th>Debit</th>
//                             <th>Credit</th>
//                             <th>Balance</th>
//                         </tr>
//                     </thead>
//                     <tbody class="purchaseOrderItemsBody">
//                         ${purchaseOrderItems}
//                     </tbody>
//                     <tbody>
//                     <tr class="text-center">
//                         <td  style="font-size: 1.1rem; font-weight:bold" class="text-left">Total:</td>
//                         <td></td>
                        
//                         <td class="text-right text-danger" style="font-size: 1.0rem; font-weight:bold"><span class="computedebit">₱0.00</span> 
//                         <div class=" d-block" id="invalid-totalDebit"></div></td>
                        
//                         <td class="text-right text-danger" style="font-size: 1.0rem; font-weight:bold"><span class="computecredit">₱0.00</span> 
//                         <div class=" d-block" id="invalid-totalCredit"></div></td>
                    
//                         <td></td>
//                     </tr>
//                     </tbody>
//                 </table>
                
                
//             </div>
//         </div>
        
        
//     </div>    
        
//         <div class="col-md-12 text-right mt-3">
//             ${button}
//         </div>
//     </div>
//     <div class="approvers">
//         ${!isRevise  ? getApproversStatus(approversID, approversStatus, approversDate) : ""}
//     </div>`;

//     setTimeout(() => {
//         $("#page_content").html(html);
//         initDataTables();
//         initAll();
//         // updateSerialNumber();
//         paymentRequestID && paymentRequestID != 0 && $("[name=paymentRequestID]").trigger("change");
        
//         // !purchaseOrderID && purchaseOrderID == 0 && $("#dateReceived").val(moment(new Date).format("MMMM DD, YYYY"));
//         // $("#dateReceived").data("daterangepicker").maxDate = moment();
//         return html;
//     }, 300);
// }
// // ----- END FORM CONTENT -----


// ----- PAGE CONTENT -----
function pageContent(isForm = false, data = false, readOnly = false, isRevise = false, isFromCancelledDocument = false) {
    $("#page_content").html(preloader);
    if (!isForm) {
        preventRefresh(false);
        let html = `
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="forApprovalTab" aria-expanded="false">
                <div class="" id="tableForApprovalParent">
                </div>
            </div>
            <div role="tabpanel" class="tab-pane " id="myFormsTab" aria-expanded="false">
                <div class="" id="tableMyFormsParent">
                </div>
            </div>
        </div>`;
        
        $("#page_content").html(html);

        // headerButton(true, "Add Check Voucher");
        headerTabContent();
        forApprovalContent();
        // myFormsContent();
        updateURL();
    } else {
        // headerButton(false, "", isRevise, isFromCancelledDocument);
        // headerTabContent(false);
        // formContent(data, readOnly, isRevise, isFromCancelledDocument);
    }
}
viewDocument();
$("#page_content").text().trim().length == 0 && pageContent(); // CHECK IF THERE IS ALREADY LOADED ONE
// ----- END PAGE CONTENT -----


// // ----- GET INVENTORY RECEIVING DATA -----
// function getInventoryReceivingData(action = "insert", method = "submit", status = "1", id = null, currentStatus = "0", isObject = false) {

//     /**
//      * ----- ACTION ---------
//      *    > insert
//      *    > update
//      * ----- END ACTION -----
//      * 
//      * ----- STATUS ---------
//      *    0. Draft
//      *    1. For Approval
//      *    2. Approved
//      *    3. Denied
//      *    4. Cancelled
//      * ----- END STATUS -----
//      * 
//      * ----- METHOD ---------
//      *    > submit
//      *    > save
//      *    > deny
//      *    > approve
//      * ----- END METHOD -----
//      */
// console.log("id "+ id)
// console.log("status "+ status)
//      let data = { items: [] }, formData = new FormData;
//     const approversID = method != "approve" && moduleApprover;

//     if (id) {
//         data["voucherID"] = id;
//         formData.append("voucherID", id);

//         if (status != "2") {
//             data["voucherStatus"] = status;
//             formData.append("voucherStatus", status);
//         }
//     }

//     data["action"]    = action;
//     data["method"]    = method;
//     data["updatedBy"] = sessionID;

//     formData.append("action", action);
//     formData.append("method", method);
//     formData.append("updatedBy", sessionID);

//     if (currentStatus == "0" && method != "approve") {
        
//         data["employeeID"] = sessionID;
//         data["paymentRequestID"]  = $("[name=paymentRequestID]").val() || null;
//         data["voucherTinPayee"]  = $("[name=voucherTinPayee]").val() || null;
//         data["voucherDescription"]  = $("[name=voucherDescription]").val()?.trim() || null;
//         data["voucherBudgetSource"]  = $("[name=voucherBudgetSource]").val() || null;
//         data["checkNo"]  = $("[name=checkNo]").val() || null;
//         data["voucherAmount"]  = $(".computecredit").text().replaceAll(",","").replaceAll("₱","")?.trim() || null;

//         formData.append("employeeID", sessionID);
//         formData.append("paymentRequestID", $("[name=paymentRequestID]").val() || null);
//         formData.append("voucherTinPayee", $("[name=voucherTinPayee]").val() || null);
//         formData.append("voucherDescription", $("[name=voucherDescription]").val()?.trim());
//         formData.append("voucherBudgetSource", $("[name=voucherBudgetSource]").val()?.trim());
//         formData.append("checkNo", $("[name=checkNo]").val()?.trim());
//         formData.append("voucherAmount", $(".computecredit").text().replaceAll(",","").replaceAll("₱","")?.trim());

//         if (action == "insert") {
//             data["createdBy"] = sessionID;
//             data["createdAt"] = dateToday();

//             formData.append("createdBy", sessionID);
//             formData.append("createdAt", dateToday());
//         } else if (action == "update") {
//             data["voucherID"] = id;

//             formData.append("voucherID", id);
//         }

//         if (method == "submit") {
//             data["submittedAt"] = dateToday();
//             formData.append("submittedAt", dateToday());
//             if (approversID) {
//                 data["approversID"] = approversID;
//                 data["voucherStatus"] = 1;

//                 formData.append("approversID", approversID);
//                 formData.append("voucherStatus", 1);
//             } else {  // AUTO APPROVED - IF NO APPROVERS
//                 data["approversID"]     = sessionID;
//                 data["approversStatus"] = 2;
//                 data["approversDate"]   = dateToday();
//                 data["voucherStatus"] = 2;

//                 formData.append("approversID", sessionID);
//                 formData.append("approversStatus", 2);
//                 formData.append("approversDate", dateToday());
//                 formData.append("voucherStatus", 2);
//             }
//         }

//         $(".itemTableRow").each(function(i, obj) {
//             const paymentRequestID = $(this).attr("paymentRequestID");
//             const chartOfAccountID     = $("td [name=accountcode]", this).attr("accountid");	
//             const accountCode  = $("td [name=accountcode]", this).text().trim();	
//             const accountName  = $("td [name=accountname]", this).text().trim();	
//             const debit  = $("td [name=debit]", this).val().replaceAll(",","");	
//             const credit  = $("td [name=credit]", this).val().replaceAll(",","");	
//             const balance  = $("td [name=balance]", this).val().replaceAll(",","");	
           
//             let temp = {
//                 paymentRequestID,
//                 chartOfAccountID,
//                 accountCode,
//                 accountName,
//                 debit,
//                 credit,
//                 balance
//             };

//             formData.append(`items[${i}][paymentRequestID]`, paymentRequestID);
//             formData.append(`items[${i}][chartOfAccountID]`, chartOfAccountID);
//             formData.append(`items[${i}][accountCode]`, accountCode);
//             formData.append(`items[${i}][accountName]`, accountName);
//             formData.append(`items[${i}][debit]`, debit);
//             formData.append(`items[${i}][credit]`, credit);
//             formData.append(`items[${i}][balance]`, balance);
           

//             data["items"].push(temp);
//         });
//     } 

    

//     return isObject ? data : formData;
// }
// // ----- END GET INVENTORY RECEIVING DATA -----


// // ----- OPEN ADD FORM -----
// $(document).on("click", "#btnAdd", function () {
//     pageContent(true);
//     updateURL(null, true);
// });
// // ----- END OPEN ADD FORM -----


// // ----- OPEN EDIT FORM -----
// $(document).on("click", ".btnEdit", function () {
//     const id = $(this).attr("id");
//     viewDocument(id);
// });
// // ----- END OPEN EDIT FORM -----


// // ----- VIEW DOCUMENT -----
// $(document).on("click", ".btnView", function () {
//     const id = $(this).attr("id");
//     viewDocument(id, true);
// });
// // ----- END VIEW DOCUMENT -----


// // ----- VIEW DOCUMENT -----
// $(document).on("click", "#btnRevise", function () {
//     const id = $(this).attr("voucherID");
//     viewDocument(id, false, true);
// });
// // ----- END VIEW DOCUMENT -----

// // ----- SUBMIT DOCUMENT -----
// $(document).on("click", ".btnRelease", function () {
//     const salaryReleaseID       = decryptString($(this).attr("id"));
//     const payrollID       = decryptString($(this).attr("payrollID"));
//     const payrollItemID       = decryptString($(this).attr("payrollItemID"));
//     const monthID   = decryptString($(this).attr("monthID"));
//     const monthDetailsID    = decryptString($(this).attr("monthDetailsID"));
//     let method = "submit";
//     let formData = new FormData;
//     formData.append("employeeID", sessionID);
//     formData.append("salaryReleaseID", salaryReleaseID || null);
//     formData.append("payrollID", payrollID || null);
//     formData.append("payrollItemID", payrollItemID || null);
//     formData.append("monthID", monthID || null);
//     formData.append("monthDetailsID", monthDetailsID || null);
   

   
//         const confirmation = getConfirmation(method);
//         confirmation.then(res => {
//             if (res.isConfirmed) {
//                 $.ajax({
//                     method:      "POST",
//                     url:         `salary_release/updateStatus`,
//                     data:formData,
//                     processData: false,
//                     contentType: false,
//                     global:      false,
//                     cache:       false,
//                     async:       false,
//                     dataType:    "json",
//                     beforeSend: function() {
//                         $("#loader").show();
//                     },
//                     success: function(data) {
//                         let result = data.split("|");
        
//                         let isSuccess   = result[0];
//                         let message     = result[1];
//                         let insertedID  = result[2];
//                         let dateCreated = result[3];
    
//                         let swalTitle;
//                         if (method == "submit") {
//                             swalTitle = `${getFormCode("SRL", dateCreated, insertedID)} released successfully!`;
//                         } else if (method == "save") {
//                             swalTitle = `${getFormCode("SRL", dateCreated, insertedID)} saved successfully!`;
//                         } else if (method == "cancelform") {
//                             swalTitle = `${getFormCode("SRL", dateCreated, insertedID)} cancelled successfully!`;
//                         } else if (method == "approve") {
//                             swalTitle = `${getFormCode("SRL", dateCreated, insertedID)} approved successfully!`;
//                         } else if (method == "deny") {
//                             swalTitle = `${getFormCode("SRL", dateCreated, insertedID)} denied successfully!`;
//                         } else if (method == "drop") {
//                             swalTitle = `${getFormCode("SRL", dateCreated, insertedID)} dropped successfully!`;
//                         }	
        
//                         if (isSuccess == "true") {
//                             setTimeout(() => {
//                                 $("#loader").hide();
//                                 closeModals();
//                                 Swal.fire({
//                                     icon:              "success",
//                                     title:             swalTitle,
//                                     showConfirmButton: false,
//                                     timer:             2000,
//                                 });
//                                 myFormsContent();
//                             }, 500);
    
    
//                         } else {
//                             setTimeout(() => {
//                                 $("#loader").hide();
//                                 Swal.fire({
//                                     icon:              "danger",
//                                     title:             message,
//                                     showConfirmButton: false,
//                                     timer:             2000,
//                                 });
//                             }, 500);
//                         }
    
                        
//                     },
//                     error: function() {
//                         setTimeout(() => {
//                             $("#loader").hide();
//                             showNotification("danger", "System error: Please contact the system administrator for assistance!");
//                         }, 500);
//                     }
//                 }).done(function() {
//                     setTimeout(() => {
//                         $("#loader").hide();
//                     }, 500);
//                 })
//             }
//             //  else {
//             //     if (res.dismiss === "cancel" && method != "submit") {
//             //         if (method != "deny") {
//             //             if (method != "cancelform") {
//             //                 true && callback();
//             //             }
//             //         } else {
//             //             $("#modal_inventory_receiving").text().length > 0 && $("#modal_inventory_receiving").modal("show");
//             //         }
//             //     } else if (res.isDismissed) {
//             //         if (method == "deny") {
//             //             $("#modal_inventory_receiving").text().length > 0 && $("#modal_inventory_receiving").modal("show");
//             //         }
//             //     }
//             // }
//         });
    
        
    
// });
// // ----- END SUBMIT DOCUMENT -----

// --------- MODAL FOR LOGS --------//
// $(document).on("click", "#btnLog", function () {

//     const id       = $(this).attr("salaryReleaseID");
//     const feedback = $(this).attr("code") || getFormCode("CV", dateToday(), id);

//     $("#modal_inventory_receiving_content").html(preloader);
//     $("#modal_inventory_receiving .page-title").text("SALARY RELEASED LOGS");
//     $("#modal_inventory_receiving").modal("show");

//     let logData = getTableData(
//         `hris_salary_release_log_tbl AS isrt 
//         LEFT JOIN hris_employee_list_tbl AS helt USING(employeeID)`,
//         `isrt.*, CONCAT(employeeFirstname, ' ', employeeLastname) AS fullname,employeeStatus,
//         CASE
//         WHEN isrt.payrollID = 0 THEN monthCode
//         WHEN isrt.payrollID =! 0 THEN CONCAT('PAY-',LPAD(isrt.payrollID,3,'0')) 
//         END AS referenceCode,
//         concat('SRL-',SUBSTR(isrt.createdAt,3,2),'-',LPAD(isrt.salaryReleaseID,5,'0')) AS salaryReleaseCode`,
//         ``,
//         `salaryReleaseLogID DESC`
//     );

//     let html =` <div class="card stats-box" style="height: 474px;
//     max-height: 405px;
//     overflow-y: auto;">

//         <div class="card-body" style="height: 400px;
//                 overflow-y: auto;">`;

//     logData.map((item) => {
//         let {
//             fullname,
//             salaryReleaseID,
//             salaryReleaseCode,
//             payrollID,
//             referenceCode,
//             payrollItemID,
//             employeeID,
//             employeeStatus,
//             payrollHoldStatus,
//             netPay,
//             dateRelease,
//             action,
//             createdAt
//         } = item;
//         let dateCreated   = moment(createdAt).format("dddd, MMMM DD, YYYY");
//         let dateReleased   = moment(dateRelease).format("dddd MMMM DD, YYYY");
//         let timeCreated   = moment(createdAt).format("LT");
//         let timeReleased   = moment(dateRelease).format("LT");

//         html +=`<div class="timeline-item blue pb-1" date-is="${payrollHoldStatus == 9 ? dateReleased : dateCreated}">
//                 <h5>${salaryReleaseCode}</h5>
//                 <small>${action == "insert" ? `Inserted document` : `Released Document`} |</small>
//                 <small>${payrollHoldStatus == 9 ? timeReleased : timeCreated}</small>
//             </div>`;

//     });

//     if(logData.length <=0){
//         html +=`<div class="w-100 h-100 d-flex justify-content-center align-items-center flex-column">
//         <img src="http://localhost/erpsys/assets/modal/no-data.gif" style="max-width: 300px;
//             width: auto;
//             min-width: 100px;
//             height: auto;" alt="No history yet.">
//         <span class="font-weight-bold">No history yet.</span>
//     </div>`
//     }


    
            
        
//     html +=`
//         </div>
//     </div>`;

//     setTimeout(() => {

        
//     $("#modal_inventory_receiving_content").html(html);
//         initDataTables();
//         return html;
//     }, 300);
// });
// --------- MODAL FOR LOGS --------//


// // ----- SAVE CLOSE FORM -----
// $(document).on("click", "#btnBack", function () {
//     const id         = $(this).attr("voucherID");
//     const isFromCancelledDocument = $(this).attr("cancel") == "true";
//     const revise     = $(this).attr("revise") == "true";
//     const employeeID = $(this).attr("employeeID");
//     const feedback   = $(this).attr("code") || getFormCode("CV", dateToday(), id);
//     const status     = $(this).attr("status");

//     if (status != "false" && status != 0) {
        
//         if (revise) {
//             // const action = revise && "insert" || (id && feedback ? "update" : "insert");
//             const action = revise && !isFromCancelledDocument && "insert" || (id ? "update" : "insert");
//             const data   = getInventoryReceivingData(action, "save", "0", id);
//             data["voucherStatus"]   = 0;
//             data.append("voucherStatus", 0);
//             // data["revisevoucherID"] = id;
//             // delete data["voucherID"];

//             if (!isFromCancelledDocument) {
//                 data.append("revisevoucherID", id);
//                 data.delete("voucherID");
//             } else {
//                 data.append("voucherID", id);
//                 data.delete("action");
//                 data.append("action", "update");
//             }

//             saveInventoryReceiving(data, "save", null, pageContent);
//         } else {
//             $("#page_content").html(preloader);
//             pageContent();

//             if (employeeID != sessionID) {
//                 $("[redirect=forApprovalTab]").length > 0 && $("[redirect=forApprovalTab]").trigger("click");
//             }
//         }

//     } else {
//         const action = id && feedback ? "update" : "insert";
//         const data   = getInventoryReceivingData(action, "save", "0", id);
//         data["voucherStatus"] = 0;
//         data.append("voucherStatus", 0);

//         saveInventoryReceiving(data, "save", null, pageContent);
//     }
// });
// // ----- END SAVE CLOSE FORM -----


// // ----- SAVE DOCUMENT -----
// $(document).on("click", "#btnSave, #btnCancel", function () {
//     let receivedCondition = $("[name=received]").hasClass("is-invalid");
//     let serialNumberCondition = $("[name=serialNumber]").hasClass("is-invalid");
//     if(!receivedCondition && !serialNumberCondition){

//         const id       = $(this).attr("voucherID");
//         const isFromCancelledDocument = $(this).attr("cancel") == "true";
//         const revise   = $(this).attr("revise") == "true";
//         const feedback = $(this).attr("code") || getFormCode("CV", dateToday(), id);
//         const action   = revise && "insert" || (id && feedback ? "update" : "insert");
//         const data     = getInventoryReceivingData(action, "save", "0", id);
//         // data["voucherStatus"] = 0;
//         data.append("voucherStatus", 0);
        
//         if (revise) {
//             // data["revisevoucherID"] = id;
//             // delete data["voucherID"];

//             // if (!isFromCancelledDocument) {
//             //     data["revisevoucherID"] = id;
//             //     delete data["voucherID"];
//             // } else {
//             //     delete data["voucherID"];
//             //     delete data["action"];
//             //     data["action"] = update;
//             // }

//             if (!isFromCancelledDocument) {
//                 data.append("revisevoucherID", id);
//                 data.delete("voucherID");
//             } else {
//                 data.append("voucherID", id);
//                 data.delete("action");
//                 data.append("action", "update");
//             }
//         }

//         saveInventoryReceiving(data, "save", null, pageContent);
//     }else{
//         $("[name=received]").focus();
//         $("[name=serialNumber]").focus();
//     }
    
// });
// // ----- END SAVE DOCUMENT -----


// // ----- REMOVE IS-VALID IN TABLE -----
// function removeIsValid(element = "table") {
//     $(element).find(".validated,.is-valid, .no-error").removeClass("validated")
//     .removeClass("is-valid").removeClass("no-error");
// }
// // ----- END REMOVE IS-VALID IN TABLE -----




// // ----- SUBMIT DOCUMENT -----
// $(document).on("click", "#btnSubmit", function () {

//             var debitValidate = $("[name=debit]").hasClass("is-invalid");
//             var creditValidate = $("[name=credit]").hasClass("is-invalid");

//             if(!debitValidate && !creditValidate){

//                 const validate       = validateForm("page_content");
//                 removeIsValid("#tableInventoryReceivingItems");
//                if(validate){
                   
                   
   
//                    const id             = $(this).attr("voucherID");
//                    const revise         = $(this).attr("revise") == "true";
//                    const action = revise && "insert" || (id ? "update" : "insert");
//                    const data   = getInventoryReceivingData(action, "submit", "1", id);
       

//                    if (revise) {
//                     data.append("revisevoucherID", id);
//                     data.delete("voucherID");
//                     }

//                     let approversID = "", approversDate = "";
//                     for (var i of data) {
//                         if (i[0] == "approversID")   approversID   = i[1];
//                         if (i[0] == "approversDate") approversDate = i[1];
//                     }

//                 //    if (revise) {
//                 //        data["revisevoucherID"] = id;
//                 //        delete data["voucherID"];
//                 //    }
                   
       
//                 //    let approversID   = data["approversID"], 
//                 //        approversDate = data["approversDate"];
       
//                    const employeeID = getNotificationEmployeeID(approversID, approversDate, true);
//                    let notificationData = false;
//                    if (employeeID != sessionID) {
//                        notificationData = {
//                            moduleID:                70,
//                            notificationTitle:       "Check Voucher",
//                            notificationDescription: `${employeeFullname(sessionID)} asked for your approval.`,
//                            notificationType:        2,
//                            employeeID,
//                        };
//                    }
       
//                    saveInventoryReceiving(data, "submit", notificationData, pageContent);
//                }
                
//             }else{
//                 $(".is-invalid").focus(); 
//             }
// });
// // ----- END SUBMIT DOCUMENT -----


// // ----- CANCEL DOCUMENT -----
// $(document).on("click", "#btnCancelForm", function () {
//     const id     = $(this).attr("voucherID");
//     const status = $(this).attr("status");
//     const action = "update";
//     const data   = getInventoryReceivingData(action, "cancelform", "4", id, status);

//     saveInventoryReceiving(data, "cancelform", null, pageContent);
// });
// // ----- END CANCEL DOCUMENT -----


// // ----- APPROVE DOCUMENT -----
// $(document).on("click", "#btnApprove", function () {
//     const id       = decryptString($(this).attr("voucherID"));
//     const feedback = $(this).attr("code") || getFormCode("CV", dateToday(), id);
//     let tableData  = getTableData("fms_check_voucher_tbl", "", "voucherID = " + id);

//     if (tableData) {
//         let approversID     = tableData[0].approversID;
//         let approversStatus = tableData[0].approversStatus;
//         let approversDate   = tableData[0].approversDate;
//         let employeeID      = tableData[0].employeeID;
//         let createdAt       = tableData[0].createdAt;

//         let data = getInventoryReceivingData("update", "approve", "2", id);
//         data["approversStatus"] = updateApproveStatus(approversStatus, 2);
//         data.append("approversStatus", updateApproveStatus(approversStatus, 2));
//         let dateApproved = updateApproveDate(approversDate)
//         data["approversDate"] = dateApproved;
//         data.append("approversDate", dateApproved);
//         let status, notificationData,lastApproveCondition = false;
//         if (isImLastApprover(approversID, approversDate)) {
//             status = 2;
//             notificationData = {
//                 moduleID:                70,
//                 tableID:                 id,
//                 notificationTitle:       "Check Voucher",
//                 notificationDescription: `${feedback}: Your request has been approved.`,
//                 notificationType:        7,
//                 employeeID,
//             };

//             lastApproveCondition = true;
//         } else {
//             status = 1;
//             notificationData = {
//                 moduleID:                70,
//                 tableID:                 id,
//                 notificationTitle:       "Check Voucher",
//                 notificationDescription: `${employeeFullname(employeeID)} asked for your approval.`,
//                 notificationType:         2,
//                 employeeID:               getNotificationEmployeeID(approversID, dateApproved),
//             };
//         }

//         data["voucherStatus"] = status;
//         data.append("voucherStatus", status);
//         saveInventoryReceiving(data, "approve", notificationData, pageContent,lastApproveCondition);
//     }
// });
// // ----- END APPROVE DOCUMENT -----


// // ----- REJECT DOCUMENT -----
// $(document).on("click", "#btnReject", function () {

//     const id       = $(this).attr("voucherID");
//     const feedback = $(this).attr("code") || getFormCode("CV", dateToday(), id);

//     $("#modal_inventory_receiving_content").html(preloader);
//     $("#modal_inventory_receiving .page-title").text("DENY CHECK VOUCHER");
//     $("#modal_inventory_receiving").modal("show");
//     let html = `
//     <div class="modal-body">
//         <div class="form-group">
//             <label>Remarks <code>*</code></label>
//             <textarea class="form-control validate"
//                 data-allowcharacters="[0-9][a-z][A-Z][ ][.][,][_]['][()][?][-][/]"
//                 minlength="2"
//                 maxlength="250"
//                 id="voucherRemarks"
//                 name="voucherRemarks"
//                 rows="4"
//                 style="resize: none"
//                 required></textarea>
//             <div class="d-block invalid-feedback" id="invalid-voucherRemarks"></div>
//         </div>
//     </div>
//     <div class="modal-footer text-right">
//         <button class="btn btn-danger px-5 p-2" id="btnRejectConfirmation"
//         voucherID="${id}"
//         code="${feedback}"><i class="far fa-times-circle"></i> Deny</button>
//         <button class="btn btn-cancel px-5 p-2" data-dismiss="modal"><i class="fas fa-ban"></i> Cancel</button>
//     </div>`;
//     $("#modal_inventory_receiving_content").html(html);
// });

// $(document).on("click", "#btnRejectConfirmation", function () {
//     const id       = decryptString($(this).attr("voucherID"));
//     const feedback = $(this).attr("code") || getFormCode("CV", dateToday(), id);

//     const validate = validateForm("modal_inventory_receiving");
//     if (validate) {
//         let tableData = getTableData("fms_check_voucher_tbl", "", "voucherID = " + id);
//         if (tableData) {
//             let approversStatus = tableData[0].approversStatus;
//             let approversDate   = tableData[0].approversDate;
//             let employeeID      = tableData[0].employeeID;

//             // let data = {};
//             // data["action"] = "update";
//             // data["method"] = "deny";
//             // data["voucherID"] = id;
//             // data["approversStatus"] = updateApproveStatus(approversStatus, 3);
//             // data["approversDate"]   = updateApproveDate(approversDate);
//             // data["voucherRemarks"] = $("[name=voucherRemarks]").val()?.trim();
//             // data["updatedBy"] = sessionID;

//             let data = new FormData;
//             data.append("action", "update");
//             data.append("method", "deny");
//             data.append("voucherID", id);
//             data.append("approversStatus", updateApproveStatus(approversStatus, 3));
//             data.append("approversDate", updateApproveDate(approversDate));
//             data.append("voucherRemarks", $("[name=voucherRemarks]").val()?.trim());
//             data.append("updatedBy", sessionID);

//             let notificationData = {
//                 moduleID:                70,
//                 tableID: 				 id,
//                 notificationTitle:       "Check Voucher",
//                 notificationDescription: `${feedback}: Your request has been denied.`,
//                 notificationType:        1,
//                 employeeID,
//             };

//             saveInventoryReceiving(data, "deny", notificationData, pageContent);
//             $("[redirect=forApprovalTab]").length > 0 && $("[redirect=forApprovalTab]").trigger("click");
//         } 
//     } 
// });
// // ----- END REJECT DOCUMENT -----

// // ----- DROP DOCUMENT -----
// $(document).on("click", "#btnDrop", function() {
//     const voucherID = decryptString($(this).attr("voucherID"));
//     const feedback          = $(this).attr("code") || getFormCode("TR", dateToday(), id);

//     const id = decryptString($(this).attr("voucherID"));
//     let data = new FormData;
//     data.append("voucherID", voucherID);
//     data.append("action", "update");
//     data.append("method", "drop");
//     data.append("updatedBy", sessionID);

//     saveInventoryReceiving(data, "drop", null, pageContent);
// })
// // ----- END DROP DOCUMENT -----


// ----- NAV LINK -----
$(document).on("click", ".nav-link", function () {
    const tab = $(this).attr("href");
    if (tab == "#forApprovalTab") {
        forApprovalContent();
    }
    if (tab == "#myFormsTab") {
        myFormsContent();
    }
});
// ----- END NAV LINK -----


// // ----- APPROVER STATUS -----
// function getApproversStatus(approversID, approversStatus, approversDate) {
//     let html = "";
//     if (approversID) {
//         let idArr = approversID.split("|");
//         let statusArr = approversStatus ? approversStatus.split("|") : [];
//         let dateArr = approversDate ? approversDate.split("|") : [];
//         html += `<div class="row mt-4">`;

//         idArr && idArr.map((item, index) => {
//             let date   = dateArr[index] ? moment(dateArr[index]).format("MMMM DD, YYYY hh:mm:ss A") : "";
//             let status = statusArr[index] ? statusArr[index] : "";
//             let statusBadge = "";
//             if (date && status) {
//                 if (status == 2) {
//                     statusBadge = `<span class="badge badge-info">Approved - ${date}</span>`;
//                 } else if (status == 3) {
//                     statusBadge = `<span class="badge badge-danger">Denied - ${date}</span>`;
//                 }
//             }

//             html += `
//             <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12">
//                 <div class="d-flex justify-content-start align-items-center">
//                     <span class="font-weight-bold">
//                         ${employeeFullname(item)}
//                     </span>
//                     <small>&nbsp;- Level ${index + 1} Approver</small>
//                 </div>
//                 ${statusBadge}
//             </div>`;
//         });
//         html += `</div>`;
//     }
//     return html;
// }
// // ----- END APPROVER STATUS --
})      


// // --------------- DATABASE RELATION ---------------
// function getConfirmation(method = "submit") {
// const title = "Salary Release";
// let swalText, swalImg;

// $("#modal_inventory_receiving").text().length > 0 && $("#modal_inventory_receiving").modal("hide");

// switch (method) {
//     case "save":
//         swalTitle = `SAVE ${title.toUpperCase()}`;
//         swalText  = "Are you sure to save this document?";
//         swalImg   = `${base_url}assets/modal/draft.svg`;
//         break;
//     case "submit":
//         swalTitle = `${title.toUpperCase()}`;
//         swalText  = "Are you sure to release this document?";
//         swalImg   = `${base_url}assets/modal/add.svg`;
//         break;
//     case "approve":
//         swalTitle = `APPROVE ${title.toUpperCase()}`;
//         swalText  = "Are you sure to approve this document?";
//         swalImg   = `${base_url}assets/modal/approve.svg`;
//         break;
//     case "deny":
//         swalTitle = `DENY ${title.toUpperCase()}`;
//         swalText  = "Are you sure to deny this document?";
//         swalImg   = `${base_url}assets/modal/reject.svg`;
//         break;
//     case "cancelform":
//         swalTitle = `CANCEL ${title.toUpperCase()}`;
//         swalText  = "Are you sure to cancel this document?";
//         swalImg   = `${base_url}assets/modal/cancel.svg`;
//         break;
//     case "drop":
//         swalTitle = `DROP ${title.toUpperCase()}`;
//         swalText  = "Are you sure to drop this document?";
//         swalImg   = `${base_url}assets/modal/drop.svg`;
//         break;
//     default:
//         swalTitle = `CANCEL ${title.toUpperCase()}`;
//         swalText  = "Are you sure that you want to cancel this process?";
//         swalImg   = `${base_url}assets/modal/cancel.svg`;
//         break;
// }
// return Swal.fire({
//     title:              swalTitle,
//     text:               swalText,
//     imageUrl:           swalImg,
//     imageWidth:         200,
//     imageHeight:        200,
//     imageAlt:           "Custom image",
//     showCancelButton:   true,
//     confirmButtonColor: "#dc3545",
//     cancelButtonColor:  "#1a1a1a",
//     cancelButtonText:   "No",
//     confirmButtonText:  "Yes"
// })
// }

// function saveInventoryReceiving(data = null, method = "submit", notificationData = null, callback = null,lastApproveCondition =false) {

// // data.lastApproveCondition = lastApproveCondition; // inserting object in data object parameter
//     // console.log(data);
//     // return false;
// if (data) {
//     const confirmation = getConfirmation(method);
//     confirmation.then(res => {
//         if (res.isConfirmed) {
//             $.ajax({
//                 method:      "POST",
//                 url:         `Check_voucher/saveCheckVoucher`,
//                 data,
//                 processData: false,
//                 contentType: false,
//                 global:      false,
//                 cache:       false,
//                 async:       false,
//                 dataType:    "json",
//                 beforeSend: function() {
//                     $("#loader").show();
//                 },
//                 success: function(data) {
//                     let result = data.split("|");
    
//                     let isSuccess   = result[0];
//                     let message     = result[1];
//                     let insertedID  = result[2];
//                     let dateCreated = result[3];

//                     let swalTitle;
//                     if (method == "submit") {
//                         swalTitle = `${getFormCode("CV", dateCreated, insertedID)} submitted successfully!`;
//                     } else if (method == "save") {
//                         swalTitle = `${getFormCode("CV", dateCreated, insertedID)} saved successfully!`;
//                     } else if (method == "cancelform") {
//                         swalTitle = `${getFormCode("CV", dateCreated, insertedID)} cancelled successfully!`;
//                     } else if (method == "approve") {
//                         swalTitle = `${getFormCode("CV", dateCreated, insertedID)} approved successfully!`;
//                     } else if (method == "deny") {
//                         swalTitle = `${getFormCode("CV", dateCreated, insertedID)} denied successfully!`;
//                     } else if (method == "drop") {
//                         swalTitle = `${getFormCode("CV", dateCreated, insertedID)} dropped successfully!`;
//                     }	
    
//                     if (isSuccess == "true") {
//                         setTimeout(() => {
//                             $("#loader").hide();
//                             closeModals();
//                             Swal.fire({
//                                 icon:              "success",
//                                 title:             swalTitle,
//                                 showConfirmButton: false,
//                                 timer:             2000,
//                             });
//                             callback && callback();

//                             if (method == "approve" || method == "deny") {
//                                 $("[redirect=forApprovalTab]").length > 0 && $("[redirect=forApprovalTab]").trigger("click")
//                             }

//                             // ----- SAVE NOTIFICATION -----
//                             if (notificationData) {
//                                 if (Object.keys(notificationData).includes("tableID")) {
//                                     insertNotificationData(notificationData);
//                                 } else {
//                                     notificationData["tableID"] = insertedID;
//                                     insertNotificationData(notificationData);
//                                 }
//                             }
//                             // ----- END SAVE NOTIFICATION -----
//                         }, 500);


//                     } else {
//                         setTimeout(() => {
//                             $("#loader").hide();
//                             Swal.fire({
//                                 icon:              "danger",
//                                 title:             message,
//                                 showConfirmButton: false,
//                                 timer:             2000,
//                             });
//                         }, 500);
//                     }

                    
//                 },
//                 error: function() {
//                     setTimeout(() => {
//                         $("#loader").hide();
//                         showNotification("danger", "System error: Please contact the system administrator for assistance!");
//                     }, 500);
//                 }
//             }).done(function() {
//                 setTimeout(() => {
//                     $("#loader").hide();
//                 }, 500);
//             })
//         } else {
//             if (res.dismiss === "cancel" && method != "submit") {
//                 if (method != "deny") {
//                     if (method != "cancelform") {
//                         callback && callback();
//                     }
//                 } else {
//                     $("#modal_inventory_receiving").text().length > 0 && $("#modal_inventory_receiving").modal("show");
//                 }
//             } else if (res.isDismissed) {
//                 if (method == "deny") {
//                     $("#modal_inventory_receiving").text().length > 0 && $("#modal_inventory_receiving").modal("show");
//                 }
//             }
//         }
//     });

    
// }
// return false;
// }

// --------------- END DATABASE RELATION ---------------//