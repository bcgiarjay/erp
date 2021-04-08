$(document).ready(function(){
    // $("#container_2").hide();
    // $("#btnCancel").toggle(false);

    // ----- OPEN ADD MODAL -----
    $(document).on("click", "#btnAdd", function() {
        $("#modalTitleAddClientHeader").text("ADD CLIENT");
        $("#modalProjectClient").modal("show");
        $("#modalProjectClientContent").html(preloader);
        const content = modalContent();
        $("#modalProjectClientContent").html(content);
        initAll();
    });
    // ----- END OPEN ADD MODAL -----

     // ----- MODAL CONTENT -----
     function modalContent(data = false) {
        let userAccountID = "";   
        let button = userAccountID ? `
        <button 
            class="btn btn-update" 
            id="btnUpdate" 
            accountid="${userAccountID}"><i class="fas fa-save"></i>
            Update
        </button>` : `
        <button class="btn btn-save" id="btnSave"><i class="fas fa-save"></i> Save</button>`;

        let html = `
            <div class="modal-body">
                <div class="row">
                    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Client No. <span class="text-danger font-weight-bold">*</span></label>
                            <input 
                            type="text" 
                            class="form-control validate" 
                            name="clientId" 
                            id="clientId" 
                            data-allowcharacters="[A-Z][a-z][0-9][ ][@]" 
                            minlength="2" 
                            maxlength="20" 
                            required 
                            value=""
                            autocomplete="off" readonly>
                            <div class="invalid-feedback d-block" id="invalidInputClientNo"></div>
                        </div>
                    </div>
                    <div class="col-xl-9 col-lg-8 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Client Name <span class="text-danger font-weight-bold">*</span></label>
                            <input 
                                type="text" 
                                class="form-control validate" 
                                name="clientName" 
                                id="clientName" 
                                data-allowcharacters="[A-Z][a-z][0-9][ ][@]" 
                                minlength="2" 
                                maxlength="20" 
                                required 
                                value=""
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalidInputClientName"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>Region <span
                                    class="text-danger font-weight-bold">*</span></label>
                            <select class=" form-control show-tick select2 validate" name="region" required="" oldRegion=""
                                id="region" readonly=""></select></select>
                                <div class="invalid-feedback d-block" id="invalid-region"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>Province <span
                                    class="text-danger font-weight-bold">*</span></label>
                            <select class=" form-control show-tick select2 validate" name="province" required="" oldProvince=""
                                id="province" readonly=""></select>
                                <div class="invalid-feedback d-block" id="invalid-province"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>City <span
                                    class="text-danger font-weight-bold validate">*</span></label>
                            <select class=" form-control show-tick select2" required="" id="city" name="city" readonly="" oldCity=""></select> 
                            <div class="invalid-feedback d-block" id="invalid-city"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>Barangay</label>
                            <select class=" form-control show-tick select2 validate" name="barangay" required="" oldBarangay=""
                                id="barangay" readonly=""></select>
                                <div class="invalid-feedback d-block" id="invalid-barangay"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-2 col-xl-2">
                        <div class="form-group">
                            <label>Unit Number <span
                                    class="text-danger font-weight-bold">*</span></label>
                            <input class="form-control validate" required=""
                            data-allowcharacters="[a-z][A-Z][.][-][#][0-9][ ]" minlength="1" maxlength="35"  id="unitNumber" name="unitNumber" value="" type="text">
                            <div class="invalid-feedback d-block" id="invalid-unitNumber"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
                        <div class="form-group">
                            <label>Building/House Number <span
                                    class="text-danger font-weight-bold">*</span></label>
                            <input class="form-control validate" required=""
                            data-allowcharacters="[a-z][A-Z][.][,][-]['][#][0-9][ ]" minlength="1" maxlength="35" id="houseNo" name="houseNumber" value="" type="text">
                            <div class="invalid-feedback d-block" id="invalid-houseNumber"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3 col-xl-3">
                        <div class="form-group">
                            <label>Country <span
                                    class="text-danger font-weight-bold">*</span></label>
                            <input class="form-control validate" required=""
                                data-allowcharacters="[a-z][A-Z][ ]" id="country" name="country" minlength="6"
                                maxlength="50" value="" type="text">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-country"></div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-3 col-xl-3">
                        <div class="form-group">
                            <label>Zip Code <span
                                    class="text-danger font-weight-bold">*</span></label>
                            <input class="form-control validate" required=""
                                data-allowcharacters="[0-9]" id="postalCode" name="postalCode" minlength="4"
                                maxlength="4" value="" type="text">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-postalCode"></div>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Contact Person <span class="text-danger font-weight-bold">*</span></label>
                            <input 
                                type="text" 
                                class="form-control validate" 
                                name="contactPerson" 
                                id="contactPerson" 
                                data-allowcharacters="[A-Z][a-z][0-9][ ][@]" 
                                minlength="2" 
                                maxlength="30" 
                                required 
                                value=""
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalidInputContactPerson"></div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Email Address <span class="text-danger font-weight-bold">*</span></label>
                            <input 
                                type="email" 
                                class="form-control validate" 
                                name="emailAddress" 
                                id="emailAddress" 
                                data-allowcharacters="[A-Z][a-z][0-9][ ][@]" 
                                minlength="2" 
                                maxlength="50" 
                                value=""
                                autocomplete="off" unique>
                            <div class="invalid-feedback d-block" id="invalidInputEmailAddress"></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Tax Identification Number <span class="text-danger font-weight-bold">*</span></label>
                            <input 
                                type="text" 
                                class="form-control validate inputmask" 
                                name="tin" 
                                id="tin" 
                                data-allowcharacters="[0-9][ ]" 
                                minlength="15" 
                                maxlength="15" 
                                value=""
                                mask="999 999 999 999"
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalidInputTIN"></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Mobile No. <span class="text-danger font-weight-bold">*</span></label>
                                <input 
                                type="text" 
                                class="form-control validate inputmask" 
                                name="mobileNo" 
                                id="mobileNo" 
                                data-allowcharacters="[0-9]" 
                                mask="(+63) 999 9999 999" 
                                minlength="18" 
                                maxlength="18" 
                                required="" value="">
                            <div class="invalid-feedback d-block" id="invalidInputMobileNo"></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Telephone No. <span class="text-danger font-weight-bold">*</span></label>
                                <input type="text" 
                                class="form-control validate inputmask" 
                                name="telephoneNo" 
                                id="telephoneNo" 
                                data-allowcharacters="[0-9]" 
                                mask="(99) 9999 9999" 
                                minlength="13" 
                                maxlength="13" 
                                required="" 
                                value="">
                            <div class="invalid-feedback d-block" id="invalidInputTelephoneNo"></div>
                        </div>
                    </div>
                    <div class="col-xl-10 col-lg-8 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Website <small class="text-muted">(Optional)</small></label>
                            <input 
                                type="text" 
                                class="form-control validate" 
                                name="brandName" 
                                id="brandName" 
                                data-allowcharacters="[A-Z][a-z][0-9][ ][@]" 
                                minlength="2" 
                                maxlength="30" 
                                required 
                                value=""
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalidInputBrandName"></div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-4 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Status <span class="text-danger font-weight-bold">*</span></label>
                            <select class=" form-control show-tick select2 validate" name="status" id="status" autocomplete="off" required>
                                <option value="0">Active</option>   
                                <option value="1">Inactive</option>
                                <div class="invalid-feedback d-block" id="invalidInputStatus"></div>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${button}
                <button class="btn btn-cancel btnCancel"><i class="fas fa-ban"></i> Cancel</button>
            </div>`;
        return html;
    } 
    // ----- END MODAL CONTENT ----


    // ----- SAVE MODAL -----
    $(document).on("click", "#btnSave", function() {
    const validate = validateForm("modalReturnItemForm");
    if (validate) {
        $("#modalReturnItemForm").modal("hide");
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to save this?",
            imageUrl: `${base_url}assets/custom/isometric_image/save.png`,
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Custom image',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#1A1A1A',
            confirmButtonText: 'Save'
          }).then((result) => {
            if (result.isConfirmed) {

            // /**
            //  * ----- FORM DATA -----
            //  * tableData = {} -> Objects
            //  */
            // let data = getFormData("modal_user_account");
            // data.append("tableName", "user_account_tbl");
            // data.append("feedback", "Your choice");
            // /**
            //  * ----- DATA -----
            //  * 1. tableName
            //  * 2. tableData
            //  * 3. feedback
            //  */

            // const saveData = insertTableData(data);
            // if (saveData) {
            //     tableContent();
            // }
                
            Swal.fire({
                icon: 'success',
                title: 'Successfully saved!',
                showConfirmButton: false,
                timer: 2000
              })
            }else{
                $("#modalReturnItemForm").modal("show");
            }
        });
            
        }
    });
    // ----- END SAVE MODAL -----

    // ----- OPEN EDIT MODAL -----
    $(document).on("click", ".btnEdit", function() {
        const id       = $(this).attr("id");
        const feedback = $(this).attr("feedback");
        $("#modalReturnItemFormHeader").text("VIEW CLIENT");
        $("#modalReturnItemForm").modal("show")

        // Display preloader while waiting for the completion of getting the data
        $("#modalReturnItemForm").html(preloader); 

        const tableData = getTableData("inventory_conditions_tbl", "*", "userAccountID="+id, "");
        if (tableData) {
            const content = modalContent(tableData);
            setTimeout(() => {
                $("#modalReturnItemForm").html(content);
                // $("#btnSaveConfirmationEdit").attr("accountid", id);
                // $("#btnSaveConfirmationEdit").attr("feedback", feedback);
                initAll();
            }, 500);
        }
    });
    // ----- END OPEN EDIT MODAL -----

    // ----- UPDATE MODAL -----
    $(document).on("click", "#btnUpdate", function() {
        const validate = validateForm("modalReturnItemForm");
        if (validate) {
            $("#modalReturnItemForm").modal("hide");
            Swal.fire({
                title: 'Are you sure?',
                text: "You want to save this?",
                imageUrl: `${base_url}assets/custom/isometric_image/save.png`,
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: 'Custom image',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#1A1A1A',
                confirmButtonText: 'Save'
              }).then((result) => {
                if (result.isConfirmed) {
    
                // /**
                //  * ----- FORM DATA -----
                //  * tableData = {} -> Objects
                //  */
                // let data = getFormData("modal_user_account");
                // data.append("tableName", "user_account_tbl");
                // data.append("feedback", "Your choice");
                // /**
                //  * ----- DATA -----
                //  * 1. tableName
                //  * 2. tableData
                //  * 3. feedback
                //  */
    
                // const saveData = insertTableData(data);
                // if (saveData) {
                //     tableContent();
                // }
                    
                Swal.fire({
                    icon: 'success',
                    title: 'Successfully saved!',
                    showConfirmButton: false,
                    timer: 2000
                  })
                }else{
                    $("#modalReturnItemForm").modal("show");
                }
            });
                
            }
        });
        // ----- END UPDATE MODAL -----

    // ------- CANCEl MODAL-------- 
    $(document).on("click",".btnCancel",function(){
        $("#modalReturnItemForm").modal("hide");
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            imageUrl: `${base_url}assets/custom/isometric_image/questions.png`,
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Custom image',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#1A1A1A',
            confirmButtonText: 'Yes, discard!'
          }).then((result) => {
            if (result.isConfirmed) {

            // /**
            //  * ----- FORM DATA -----
            //  * tableData = {} -> Objects
            //  */
            // let data = getFormData("modal_user_account");
            // data.append("tableName", "user_account_tbl");
            // data.append("feedback", "Your choice");
            // /**
            //  * ----- DATA -----
            //  * 1. tableName
            //  * 2. tableData
            //  * 3. feedback
            //  */

            // const saveData = insertTableData(data);
            // if (saveData) {
            //     tableContent();
            // }
                
            Swal.fire({
                icon: 'success',
                title: 'Changes successfully discard!',
                showConfirmButton: false,
                timer: 2000
              })
            }else{
                $("#modalReturnItemForm").modal("show");
            }
        });


    });
    // -------- END CANCEL MODAL-----------


      // ----- DATATABLES -----
      function initDataTables() {
        if ($.fn.DataTable.isDataTable('#tableReturnItemList')){
            $('#tableReturnItemList').DataTable().destroy();
        }
        
        var table = $("#tableReturnItemList").css({"min-width": "100%"}).removeAttr('width').DataTable({
            proccessing:    false,
            serverSide:     false,
            scrollX:        true,
            scrollCollapse: true,
            columnDefs: [
                { targets: 0, width: 50 },
                { targets: 1, width: 100 },
                { targets: 2, width: 200 },
                { targets: 3, width: 200 },
                { targets: 4, width: 200 },
                { targets: 5, width: 100 },
                { targets: 6, width: 100 },
                { targets: 7, width: 50 },
                { targets: 8, width: 50 }
            ],
        });
    }
    initDataTables();
    // ----- END DATATABLES -----

    // ----- TABLE CONTENT -----
    function tableContent() {
        // Reset the unique datas
        uniqueData = []; 

        $.ajax({
            url:      `${base_url}operations/getTableData`,
            method:   'POST',
            async:    false,
            dataType: 'json',
            data:     {tableName: "gen_operations_tbl "},
            beforeSend: function() {
                $("#table_content").html(preloader);
                // $("#inv_headerID").text("List of Inventory Item");
            },
            success: function(data) {
                console.log(data);
                let html = `
                <table class="table table-bordered table-striped table-hover" id="tableReturnItemList">
                    <thead>
                        <tr class="text-center" style="white-space:nowrap">
                            <th>No.</th>
                            <th>Return Item Code</th>
                            <th>Requestor</th>
                            <th>Position</th>
                            <th>Date</th>
                            <th>Date Submitted</th>
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>`;

                data.map((item, index, array) => {
                    // ----- INSERT UNIQUE DATA TO uniqueData VARIABLE ----
                    let unique = {
                        id:       item.userAccountID, // Required
                        username: item.username,
                        email:    item.email,
                    }
                    uniqueData.push(unique);
                    // ----- END INSERT UNIQUE DATA TO uniqueData VARIABLE ----

                    html += `
                    <tr>
                        <td>No.</td>
                        <td>Return Item Code</td>
                        <td>Requestor</td>
                        <td>Position</td>
                        <td>Date</td>
                        <td>Date Submitted</td>
                        <td>Remarks</td>
                        <td><span class="badge badge-outline-success w-100">Active</span></td>
                        <td>
                            <ul class="header-dropdown" style="list-style-type:none;">
                                <li class="dropdown"> <a href="javascript:void(0);" class="dropdown-toggle float-right" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> <i class="fad fa-grip-horizontal"></i> </a>
                                    <ul class="dropdown-menu">
                                        <li><a href="javascript:void(0);"><i class="fad fa-edit"></i> Edit</a></li>
                                        <li><a href="javascript:void(0);"><i class="fad fa-save"></i> Save</a></li>
                                        <li><a href="javascript:void(0);"><i class="fad fa-ban"></i> Cancel</a></li>
                                        <li><a href="javascript:void(0);"><i class="fad fa-paper-plane"></i> Send</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </td>
                    </tr>`;
                })
                html += `</tbody>
                </table>`;

                setTimeout(() => {
                    $("#table_content").html(html);
                    initDataTables();
                }, 500);
            },
            error: function() {
                let html = `
                    <div class="w-100 h5 text-center text-danger>
                        There was an error fetching data.
                    </div>`;
                $("#table_content").html(html);
            }
        })
    }
    tableContent();
    // ----- END TABLE CONTENT -----

      // ----- DATATABLES -----
      function initDataTables() {
        if ($.fn.DataTable.isDataTable('#tableReturnItemForm')){
            $('#tableReturnItemForm').DataTable().destroy();
        }
        
        var table = $("#tableReturnItemForm").css({"min-width": "100%"}).removeAttr('width').DataTable({
            proccessing:    false,
            serverSide:     false,
            scrollX:        true,
            scrollCollapse: true,
            columnDefs: [
                { targets: 0, width: 50 },
                { targets: 1, width: 100 },
                { targets: 2, width: 200 },
                { targets: 3, width: 200 },
                { targets: 4, width: 200 },
                { targets: 5, width: 100 },
                { targets: 6, width: 100 }
            ],
        });
    }
    initDataTables();
    // ----- END DATATABLES -----
    // ----- TABLE CONTENT -----
    function tableContentForm() {
        // Reset the unique datas
        uniqueData = []; 

        $.ajax({
            url:      `${base_url}operations/getTableData`,
            method:   'POST',
            async:    false,
            dataType: 'json',
            data:     {tableName: "gen_operations_tbl "},
            beforeSend: function() {
                $("#table_contentForm").html(preloader);
                // $("#inv_headerID").text("List of Inventory Item");
            },
            success: function(data) {
                console.log(data);
                let html = `
                <table class="table table-bordered table-striped table-hover" id="tableReturnItemForm">
                    <thead>
                        <tr class="text-center" style="white-space:nowrap">
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Model</th>
                            <th>Serial No.</th>
                            <th>Purpose</th>
                            <th>Date Return</th>
                            <th>Signature</th>
                        </tr>
                    </thead>
                    <tbody>`;

                data.map((item, index, array) => {
                    // ----- INSERT UNIQUE DATA TO uniqueData VARIABLE ----
                    let unique = {
                        id:       item.userAccountID, // Required
                        username: item.username,
                        email:    item.email,
                    }
                    uniqueData.push(unique);
                    // ----- END INSERT UNIQUE DATA TO uniqueData VARIABLE ----

                    html += `
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>`;
                })
                html += `</tbody>
                </table>`;

                setTimeout(() => {
                    $("#table_contentForm").html(html);
                    initDataTables();
                }, 500);
            },
            error: function() {
                let html = `
                    <div class="w-100 h5 text-center text-danger>
                        There was an error fetching data.
                    </div>`;
                $("#table_contentForm").html(html);
            }
        })
    }
    tableContentForm();
    // ----- END TABLE CONTENT -----
});