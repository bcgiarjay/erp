$(document).ready(function () {

    // ----- GET PHILIPPINE ADDRESSES -----
	const getPhAddresses = () => {
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
	};
	const address = getPhAddresses();

	const phRegion = [
		{ key: "01",    name: "REGION I" },
		{ key: "02",    name: "REGION II" },
		{ key: "03",    name: "REGION III" },
		{ key: "4A",    name: "REGION IV-A" },
		{ key: "4B",    name: "REGION IV-B" },
		{ key: "05",    name: "REGION V" },
		{ key: "06",    name: "REGION VI" },
		{ key: "07",    name: "REGION VII" },
		{ key: "08",    name: "REGION VIII" },
		{ key: "09",    name: "REGION IX" },
		{ key: "10",    name: "REGION X" },
		{ key: "11",    name: "REGION XI" },
		{ key: "12",    name: "REGION XII" },
		{ key: "13",    name: "REGION XIII" },
		{ key: "BARMM", name: "BARMM" },
		{ key: "CAR",   name: "CAR" },
		{ key: "NCR",   name: "NCR" },
	];

    const getRegionName = (regionKey = "01") => {
        let region = phRegion.filter(item => {
            if (item.key == regionKey) {
                return item;
            }
        });
        return region.length > 0 ? region[0].name : "";
    }

    function getRegionOptions(regionKey = false) {
        let html = "";
        phRegion.map(item => {
            html += `<option value="${item.key}" ${regionKey == item.key && "selected"}>${item.name}</option>`;
        })
        return html;
    }

    function getProvinceOptions(provinceKey = false, region = "01", doEmpty = false) {
        let html = !provinceKey && `<option value="" selected>Select Province</option>`;
        if (!doEmpty) {
            const provinceList = region && Object.keys(address[region].province_list);
            provinceList && provinceList.map(item => {
                html += `<option value="${item}" ${provinceKey == item && "selected"}>${item}</option>`;
            })
        }
        return html;
    }

    function getMunicipalityOptions(municipalityKey = false, region = "01", province = "ILOCOS NORTE", doEmpty = false) {
        let html = !municipalityKey && `<option value="" selected>Select City/Municipality</option>`;
        if (!doEmpty) {
            const municipalityList = region && province && Object.keys(address[region].province_list[province].municipality_list);
            municipalityList && municipalityList.map(item => {
                html += `<option value="${item}" ${municipalityKey == item && "selected"}>${item}</option>`;
            })
        }
        return html;
    }

    function getBarangayOptions(barangayKey = false, region = "01", province = "ILOCOS NORTE", city = "ADAMS", doEmpty = false) {
        let html = !barangayKey && `<option value="" selected>Select Barangay</option>`;
        if (!doEmpty) {
            const barangayList = region && region && province && address[region].province_list[province].municipality_list[city].barangay_list;
            barangayList && barangayList.map(item => {
                html += `<option value="${item}" ${barangayKey == item && "selected"}>${item}</option>`;
            })
        }
        return html;
    }

    $(document).on("change", "[name=inventoryVendorRegion]", function() {
        const region = $(this).val();

        if (region) {
            const provinceOptions = getProvinceOptions(false, region);
            $("[name=inventoryVendorProvince]").html(provinceOptions);
        } else {
            const provinceOptions = getProvinceOptions(false, "", true);
            $("[name=inventoryVendorProvince]").html(provinceOptions);
        }

        const municipality = getMunicipalityOptions(false, "", "", true);
        $("[name=inventoryVendorCity]").html(municipality); 

        const barangay = getBarangayOptions(false, "", "", "", true);
        $("[name=inventoryVendorBarangay]").html(barangay);
    })

    $(document).on("change", "[name=inventoryVendorProvince]", function() {
        const region   = $("[name=inventoryVendorRegion]").val();
        const province = $(this).val();
        
        if (province) {
            const municipalityOptions = getMunicipalityOptions(false, region, province);
            $("[name=inventoryVendorCity]").html(municipalityOptions);
        } else {
            const municipalityOptions = getMunicipalityOptions(false, "", "", true);
            $("[name=inventoryVendorCity]").html(municipalityOptions);
        }

        const barangay = getBarangayOptions(false, "", "", "", true);
        $("[name=inventoryVendorBarangay]").html(barangay);
    })

    $(document).on("change", "[name=inventoryVendorCity]", function() {
        const region   = $("[name=inventoryVendorRegion]").val();
        const province = $("[name=inventoryVendorProvince]").val();
        const city     = $(this).val();

        if (city) {
            const barangay = getBarangayOptions(false, region, province, city);
            $("[name=inventoryVendorBarangay]").html(barangay);
        } else {
            const barangay = getBarangayOptions(false, "", "", "", true);
            $("[name=inventoryVendorBarangay]").html(barangay);
        }
    })
	// ----- END GET PHILIPPINE ADDRESSES -----


	// ----- DATATABLES -----
	function initDataTables() {
		if ($.fn.DataTable.isDataTable("#tableInventoryVendor")) {
			$("#tableInventoryVendor").DataTable().destroy();
		}

		var table = $("#tableInventoryVendor")
			.css({ "min-width": "100%" })
			.removeAttr("width")
			.DataTable({
				proccessing: false,
				serverSide: false,
				scrollX: true,
				scrollCollapse: true,
				columnDefs: [
					{ targets: 0,  width: 50 },
					{ targets: 1,  width: 150 },
					{ targets: 2,  width: 300 },
					{ targets: 3,  width: 150 },
					{ targets: 4,  width: 100 },
					{ targets: 5,  width: 100 },
					{ targets: 6,  width: 100 },
					{ targets: 7,  width: 100 },
					{ targets: 8,  width: 100 },
					{ targets: 9,  width: 150 },
					{ targets: 10, width: 80 }
				],
			});
	}
	initDataTables();
	// ----- END DATATABLES -----


	// ----- TABLE CONTENT -----
	function tableContent() {
        preventRefresh(false);

		// Reset the unique datas
		uniqueData = [];

		$.ajax({
			url: `${base_url}operations/getTableData`,
			method: "POST",
			async: false,
			dataType: "json",
			data: { tableName: "ims_inventory_vendor_tbl" },
			beforeSend: function () {
				$("#table_content").html(preloader);
			},
			success: function (data) {
				let html = `
                <table class="table table-bordered table-striped table-hover" id="tableInventoryVendor">
                    <thead>
                        <tr style="white-space:nowrap">
                            <th>Vendor Code</th>
                            <th>Vendor Name</th>
                            <th>Vendor Address</th>
                            <th>Contact Person</th>
                            <th>Email Address</th>
                            <th>TIN</th>
                            <th>Mobile No.</th>
                            <th>Telephone No.</th>
                            <th>VAT</th>
                            <th>Brand Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>`;

				data.map((item, index, array) => {
					// ----- INSERT UNIQUE DATA TO uniqueData VARIABLE ----
					let unique = {
						id: item.inventoryVendorID, // Required
						inventoryVendorName: item.inventoryVendorName,
					};
					uniqueData.push(unique);
					// ----- END INSERT UNIQUE DATA TO uniqueData VARIABLE ----

                    let status =
						item.inventoryVendorStatus == 1
							? `
                    <span class="badge badge-outline-success w-100">Active</span>`
							: `
                    <span class="badge badge-outline-danger w-100">Inactive</span>`;

					html += `
                    <tr class="btnEdit" id="${item.inventoryVendorID}">
                        <td>${item.inventoryVendorCode}</td>
                        <td>${item.inventoryVendorName}</td>
                        <td>
                            ${item.inventoryVendorUnit+", "} 
                            ${item.inventoryVendorBuilding && titleCase(item.inventoryVendorBuilding)+", "} 
                            ${item.inventoryVendorStreet && titleCase(item.inventoryVendorStreet)+", "}
                            ${item.inventoryVendorSubdivision && titleCase(item.inventoryVendorSubdivision)+", "} 
                            ${item.inventoryVendorBarangay && titleCase(item.inventoryVendorBarangay)+", "} 
                            ${item.inventoryVendorCity && titleCase(item.inventoryVendorCity)+", "} 
                            ${item.inventoryVendorProvince && titleCase(item.inventoryVendorProvince)+", "}
                            ${item.inventoryVendorCountry && titleCase(item.inventoryVendorCountry)+", "} 
                            ${item.inventoryVendorZipCode && titleCase(item.inventoryVendorZipCode)}
                        </td>
                        <td>${item.inventoryVendorPerson}</td>
                        <td>${item.inventoryVendorEmail}</td>
                        <td>${item.inventoryVendorTIN}</td>
                        <td>${item.inventoryVendorMobile}</td>
                        <td>${item.inventoryVendorTelephone}</td>
                        <td>${item.inventoryVendorVAT == 1 ? "Vatable" : "Non Vatable"}</td>
                        <td>${item.inventoryVendorBrand}</td>
                        <td>${status}</td>
                    </tr>`;
				});
				html += `</tbody>
                </table>`;

				setTimeout(() => {
					$("#table_content").html(html);
					initDataTables();
				}, 500);
			},
			error: function () {
				let html = `
                    <div class="w-100 h5 text-center text-danger>
                        There was an error fetching data.
                    </div>`;
				$("#table_content").html(html);
			},
		});
	}
	tableContent();
	// ----- END TABLE CONTENT -----


	// ----- MODAL CONTENT -----
	function modalContent(data = false) {
        let { 
            inventoryVendorID          = "",
            inventoryVendorName        = "",
            inventoryVendorRegion      = false,
            inventoryVendorProvince    = false,
            inventoryVendorCity        = false,
            inventoryVendorBarangay    = false,
            inventoryVendorUnit        = "",
            inventoryVendorBuilding    = "",
            inventoryVendorStreet      = "",
            inventoryVendorSubdivision = "",
            inventoryVendorCountry     = "",
            inventoryVendorZipCode     = "",
            inventoryVendorPerson      = "",
            inventoryVendorEmail       = "",
            inventoryVendorTIN         = "",
            inventoryVendorMobile      = "",
            inventoryVendorTelephone   = "",
            inventoryVendorBrand       = "",
            inventoryVendorVAT         = "1",
            inventoryVendorStatus      = "1",
        } = data && data[0];

		let button = data
			? `
        <button 
            class="btn btn-update" 
            id="btnUpdate" 
            vendorID="${inventoryVendorID}"><i class="fas fa-save"></i>
            Update
        </button>`
			: `
        <button class="btn btn-save" id="btnSave"><i class="fas fa-save"></i> Save</button>`;

		let html = `
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-12 col-sm-12">
                        <div class="form-group">
                            <label>Supplier Name <code>*</code></label>
                            <input 
                                type="text" 
                                class="form-control validate" 
                                name="inventoryVendorName" 
                                id="supplierName" 
                                data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][ ]" 
                                minlength="2" 
                                maxlength="75" 
                                required 
                                value="${inventoryVendorName}"
                                unique="${inventoryVendorID}"
                                title="Supplier Name"
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalid-supplierName"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>Region</label>
                            <select class=" form-control show-tick select2 validate" name="inventoryVendorRegion" id="input_inventoryVendorRegion">
                            <option value="" selected>Select Region</option>
                            ${getRegionOptions(inventoryVendorRegion)}
                            </select>
                            <div class="invalid-feedback d-block" id="invalid-input_inventoryVendorRegion"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>Province </label>
                            <select class=" form-control show-tick select2 validate" name="inventoryVendorProvince"
                            id="inventoryVendorProvince">
                                <option value="" selected>Select Province</option>
                                ${data && getProvinceOptions(inventoryVendorProvince, inventoryVendorRegion)}
                            </select>
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorProvince"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>City/Municipality</label>
                            <select class=" form-control show-tick select2" id="inventoryVendorCity" name="inventoryVendorCity">
                                <option value="" selected>Select City/Municipality</option>
                                ${data && getMunicipalityOptions(inventoryVendorCity, inventoryVendorRegion, inventoryVendorProvince)}
                            </select> 
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorCity"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        <div class="form-group">
                            <label>Barangay</label>
                            <select class=" form-control show-tick select2 validate" name="inventoryVendorBarangay" id="inventoryVendorBarangay">
                                <option value="" selected>Select Barangay</option>
                                ${data && getBarangayOptions(inventoryVendorBarangay, inventoryVendorRegion, inventoryVendorProvince, inventoryVendorCity)}
                            </select>
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorBarangay"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-2 col-xl-2">
                        <div class="form-group">
                            <label>Unit Number </label>
                            <input class="form-control validate"
                            data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/]"  minlength="2" maxlength="50"  id="unitNumber" value="${inventoryVendorUnit}" name="inventoryVendorUnit" type="text">
                            <div class="invalid-feedback d-block" id="invalid-unitNumber"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5">
                        <div class="form-group">
                            <label>Building/House Number </label>
                            <input class="form-control validate"
                            data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][ ]"  minlength="2" maxlength="75" id="input_houseNumber" name="inventoryVendorBuilding" value="${inventoryVendorBuilding}" type="text">
                            <div class="invalid-feedback d-block" id="invalid-input_houseNumber"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5">
                        <div class="form-group">
                            <label>Street Name </label>
                            <input class="form-control validate"
                            data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][ ]"  minlength="2" maxlength="75" id="input_street" name="inventoryVendorStreet" value="${inventoryVendorStreet}" type="text">
                            <div class="invalid-feedback d-block" id="invalid-input_street"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5">
                        <div class="form-group">
                            <label>Subdivision Name </label>
                            <input class="form-control validate"
                            data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][ ]"  minlength="2" maxlength="75" id="input_subdivision" name="inventoryVendorSubdivision" value="${inventoryVendorSubdivision}" type="text">
                            <div class="invalid-feedback d-block" id="invalid-input_subdivision"></div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5">
                        <div class="form-group">
                            <label>Country </label>
                            <input class="form-control validate"
                                data-allowcharacters="[a-z][A-Z][ ]" id="inventoryVendorCountry" name="inventoryVendorCountry" minlength="2"
                                maxlength="75" value="${inventoryVendorCountry}" type="text">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-inventoryVendorCountry"></div>
                    </div>
                    <div class="col-sm-12 col-md-6 col-lg-2 col-xl-2">
                        <div class="form-group">
                            <label>Zip Code </label>
                            <input class="form-control validate"
                                data-allowcharacters="[0-9]" id="inventoryVendorZipCode" name="inventoryVendorZipCode" minlength="4"
                                maxlength="4" value="${inventoryVendorZipCode}" type="text">
                        </div>
                        <div class="invalid-feedback d-block" id="invalid-inventoryVendorZipCode"></div>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Contact Person </label>
                            <input 
                                type="text" 
                                class="form-control validate" 
                                name="inventoryVendorPerson" 
                                id="inventoryVendorPerson" 
                                data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][ ]"
                                minlength="2" 
                                maxlength="75" 
                                value="${inventoryVendorPerson}"
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorPerson"></div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Email Address </label>
                            <input 
                                type="email" 
                                class="form-control validate" 
                                name="inventoryVendorEmail" 
                                id="inventoryVendorEmail" 
                                data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][_][@]"
                                minlength="2" 
                                maxlength="50" 
                                value="${inventoryVendorEmail}"
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorEmail"></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Tax Identification Number </label>
                            <input 
                                type="text" 
                                class="form-control validate inputmask" 
                                name="inventoryVendorTIN" 
                                id="inventoryVendorTIN" 
                                data-allowcharacters="[0-9]" 
                                minlength="15" 
                                maxlength="15" 
                                value="${inventoryVendorTIN}"
                                mask="999-999-999-999"
                                autocomplete="off">
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorTIN"></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Mobile No. </label>
                                <input 
                                type="text" 
                                class="form-control validate inputmask" 
                                name="inventoryVendorMobile" 
                                id="inventoryVendorMobile" 
                                data-allowcharacters="[0-9]" 
                                mask="0\\999-9999-999" 
                                minlength="13" 
                                maxlength="13"
                                value="${inventoryVendorMobile}">
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorMobile"></div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Telephone No. </label>
                                <input type="text" 
                                class="form-control validate inputmask" 
                                name="inventoryVendorTelephone" 
                                id="inventoryVendorTelephone" 
                                data-allowcharacters="[0-9]" 
                                mask="(99)-9999-9999" 
                                minlength="14" 
                                maxlength="14"  
                                value="${inventoryVendorTelephone}">
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorTelephone"></div>
                        </div>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Brand Name <code>*</code></label>
                            <input 
                                type="text" 
                                class="form-control validate" 
                                name="inventoryVendorBrand" 
                                id="inventoryVendorBrand" 
                                data-allowcharacters="[A-Z][a-z][0-9][.][,][-][()]['][/][ ]"
                                minlength="2" 
                                maxlength="50" 
                                value="${inventoryVendorBrand}"
                                autocomplete="off"
                                required>
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorBrand"></div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>VAT <code>*</code></label>
                            <select class=" form-control show-tick select2 validate" name="inventoryVendorVAT" id="inventoryVendorVAT" autocomplete="off">
                                <option value="1" ${inventoryVendorVAT == 1 && "selected"}>Vatable</option>   
                                <option value="0" ${inventoryVendorVAT == 0 && "selected"}>Non-Vatable</option>
                            </select>
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorVAT"></div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                        <div class="form-group">
                            <label>Status <code>*</code></label>
                            <select class=" form-control show-tick select2 validate" name="inventoryVendorStatus" id="inventoryVendorStatus" autocomplete="off" title="Select Status">
                                <option value="1" ${inventoryVendorStatus == 1 && "selected"}>Active</option>   
                                <option value="0" ${inventoryVendorStatus == 0 && "selected"}>Inactive</option>
                            </select>
                            <div class="invalid-feedback d-block" id="invalid-inventoryVendorStatus"></div>
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
	// ----- END MODAL CONTENT -----


	// ----- OPEN ADD MODAL -----
	$(document).on("click", "#btnAdd", function () {
        preventRefresh(true);

		$("#modal_inventory_vendor .page-title").text("ADD INVENTORY VENDOR");
		$("#modal_inventory_vendor").modal("show");
		$("#modal_inventory_vendor_content").html(preloader);
		const content = modalContent();
		$("#modal_inventory_vendor_content").html(content);
		initAll();
	});
	// ----- END OPEN ADD MODAL -----


	// ----- SAVE MODAL -----
	$(document).on("click", "#btnSave", function () {
		const validate = validateForm("modal_inventory_vendor");
		if (validate) {
            let data = getFormData("modal_inventory_vendor", true);
            data["tableData[inventoryVendorCode]"] = generateCode("VEN", false, "ims_inventory_vendor_tbl", "inventoryVendorCode");
            data["tableData[createdBy]"] = sessionID;
            data["tableData[updatedBy]"] = sessionID;
            data["tableName"]            = "ims_inventory_vendor_tbl";
            data["feedback"]             = $("[name=inventoryVendorName]").val();

            sweetAlertConfirmation("add", "Vendor", "modal_inventory_vendor", null, data, true, tableContent);
		}
	});
	// ----- END SAVE MODAL -----

    
	// ----- OPEN EDIT MODAL -----
	$(document).on("click", ".btnEdit", function () {
        preventRefresh(true);

		const id = $(this).attr("id");
		$("#modal_inventory_vendor .page-title").text("EDIT INVENTORY VENDOR");
		$("#modal_inventory_vendor").modal("show");

		// Display preloader while waiting for the completion of getting the data
		$("#modal_inventory_vendor_content").html(preloader);

		const tableData = getTableData(
			"ims_inventory_vendor_tbl",
			"*",
			"inventoryVendorID=" + id,
			""
		);
		if (tableData) {
			const content = modalContent(tableData);
			setTimeout(() => {
				$("#modal_inventory_vendor_content").html(content);
				initAll();
			}, 500);
		}
	});
	// ----- END OPEN EDIT MODAL -----


	// ----- UPDATE MODAL -----
	$(document).on("click", "#btnUpdate", function () {
		const id = $(this).attr("vendorID");

		const validate = validateForm("modal_inventory_vendor");
		if (validate) {
			let data = getFormData("modal_inventory_vendor", true);
			data["tableData[updatedBy]"] = sessionID;
			data["tableName"]            = "ims_inventory_vendor_tbl";
			data["whereFilter"]          = "inventoryVendorID=" + id;
			data["feedback"]             = $("[name=inventoryVendorName]").val();

			sweetAlertConfirmation(
				"update",
				"Vendor",
				"modal_inventory_vendor",
				"",
				data,
				true,
				tableContent
			);
		}
	});
	// ----- END UPDATE MODAL -----


	// ------- CANCEL MODAL--------
	$(document).on("click", ".btnCancel", function () {
		let formEmpty = isFormEmpty("modal_inventory_vendor");
		if (!formEmpty) {
			sweetAlertConfirmation(
				"cancel",
				"Vendor",
				"modal_inventory_vendor"
			);
		} else {
            preventRefresh(false);
			$("#modal_inventory_vendor").modal("hide");
		}
	});
	// -------- END CANCEL MODAL-----------

});