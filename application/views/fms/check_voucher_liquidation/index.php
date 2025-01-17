<div class="body_area after_bg">
    <div class="block-header pb-0">
        <div class="container" id="headerContainer">
            <div class="row clearfix">
                <div class="col-lg-6 col-md-6">
                    <ul class="breadcrumb pl-0 pb-0 ">
                        <li class="breadcrumb-item"><a href="#"><i class="zmdi zmdi-home"></i> Dashboard</a></li>
						<li class="breadcrumb-item"><i class="fas fa-users"></i> &nbsp;Finance Modules</li>
                        <li class="breadcrumb-item active">Check Voucher Liquidations</li>
                    </ul>
                    <h1 class="mt-3">List of Check Voucher Liquidations</h1>
                    <span>This module is used to manage check voucher liquidations form details.</span>
                </div>
                <div class="col-lg-6 col-md-6 text-right" id="headerButton">
				<button type="button" class="btn btn-default btn-add" id="btnAdd" data-toggle="tab" href="#addPR"><i class="icon-plus"></i> &nbsp;Add Check Voucher Liquidation</button></div>
            </div>
            <div class="bh_divider appendHeader"></div>
            <div class="row clearfix appendHeader">
                <div class="col-12">
                    <ul class="nav nav-tabs">
                        <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#forApprovalTab" redirect="forApprovalTab">For Approval</a></li>
                        <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#myFormsTab" redirect="myFormsTab">My Forms</a></li>
                    </ul>
                </div>
            </div>
           
        </div>
    </div>

    <div class="container">
		<div class="row clearfix row-deck mx-1">
            <div class="card col-md-12">
                <div class="tab-content mt-3">
                    <div role="tabpanel" class="tab-pane" id="forApprovalTab">                   
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered table-striped table-hover js-basic-example dataTable">
                                    <thead>
                                        <tr>
                                            <th>Document No.</th>
                                            <th>Date Created</th>
                                            <th>Date Submitted</th>
                                            <th>Date Approved</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>                
                    <div role="tabpanel" class="tab-pane in active" id="myFormsTab"> 
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-bordered table-striped table-hover js-basic-example dataTable">
                                    <thead>
                                        <tr>
                                            <th>Document No.</th>
                                            <th>Date Created</th>
                                            <th>Date Submitted</th>
                                            <th>Date Approved</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="addPR"> 
                        <div class="card-body">
                            <div class="row px-2">
                                <div class="col-lg-2 col-md-6 col-sm-12 px-1">
                                    <div class="card">
                                        <div class="body">
                                            <small class="text-small text-muted font-weight-bold">Document No.</small>
                                            <h6 class="mt-0 text-danger font-weight-bold">
                                            CV-2021-00001
                                            </h6>      
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-6 col-sm-12 px-1">
                                    <div class="card">
                                        <div class="body">
                                            <small class="text-small text-muted font-weight-bold">Status</small>
                                            <h6 class="mt-0 font-weight-bold">
                                                <span class="badge badge-info w-100">Approved</span>
                                            </h6>      
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-8 col-md-12 col-sm-12 px-1">
                                    <div class="row m-0">
                                        <div class="col-lg-4 col-md-4 col-sm-12 px-1">
                                            <div class="card">
                                                <div class="body">
                                                    <small class="text-small text-muted font-weight-bold">Date Created</small>
                                                    <h6 class="mt-0 font-weight-bold">
                                                        ---
                                                    </h6>      
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-12 px-1">
                                            <div class="card">
                                                <div class="body">
                                                    <small class="text-small text-muted font-weight-bold">Date Submitted</small>
                                                    <h6 class="mt-0 font-weight-bold">
                                                        ---
                                                    </h6>      
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-12 px-1">
                                            <div class="card">
                                                <div class="body">
                                                    <small class="text-small text-muted font-weight-bold">Date Approved</small>
                                                    <h6 class="mt-0 font-weight-bold">
                                                        ---
                                                    </h6>      
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 px-1">
                                    <div class="card">
                                        <div class="body">
                                            <small class="text-small text-muted font-weight-bold">Remarks</small>
                                            <h6 class="mt-0 font-weight-bold">
                                                ---
                                            </h6>      
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label>Employee Name <code>*</code></label>
                                            <input type="text" class="form-control" disabled value="">
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label>Department <code>*</code></label>
                                            <input type="text" class="form-control" disabled value="">
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12">
                                    <div class="form-group">
                                        <label>Position</label>
                                        <input type="text" class="form-control" disabled value="">
                                    </div>
                                </div>
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label>Reason <code>*</code></label>
                                        <textarea class="form-control validate"
                                            data-allowcharacters="[a-z][A-Z][0-9][ ][.][,][-][()]['][/][&]"
                                            minlength="1"
                                            maxlength="200"
                                            id="checkVoucherLiquidationReason"
                                            name="checkVoucherLiquidationReason"
                                            required
                                            rows="4"
                                            style="resize:none;"></textarea>
                                        <div class="d-block invalid-feedback" id="invalid-checkVoucherLiquidationReason"></div>
                                    </div>
                                </div>
                            </div>
                            <hr class="pb-1">
                            <h3 class="font-weight-bolder mb-3 text-center">CHECK VOUCHER</h3>
                            <table class="table table-striped table-hover" id="tableForApprroval" role="grid">
                                <thead>
                                    <tr style="white-space: nowrap">
                                        <th class="text-center" width="50">
                                            <div class="action">
                                                <input type="checkbox" class="checkboxall" project="true">
                                            </div>
                                        </th>
                                        <th width="400">Description</th>
                                        <th width="150">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-center">
                                            <div class="action">
                                                <input type="checkbox" class="checkboxrow" id="checkboxrow0" company="true">
                                            </div>
                                        </td>
                                        <td>
                                            <textarea rows="2" style="resize: none" class="form-control" name="checkVoucherLiquidationDescription" id="input_checkVoucherLiquidationDescription" data-allowcharacters="[a-z][A-Z][0-9][ ][.][,][-][()]['][/][&]"></textarea>
                                        </td>
                                        <td>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">₱</span>
                                                </div>
                                                <input type="text" class="form-control amount" min="0.1" max="999999" minlength="1" maxlength="20" name="amount" id="amount0" value="0" project="true" style="text-align: right;">
                                            </div>
                                            <div class="invalid-feedback d-block" id="invalid-amount"></div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr style="background-color:#f1f1f1;">
                                        <td class="text-right font-weight-bolder" colspan="2">Total Amount Requested:</td>
                                        <td>
                                            <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text">₱</span>
                                                    </div>
                                                    <input type="text" class="form-control amount" disabled min="0.1" max="999999" minlength="1" maxlength="20" name="amount" id="amount0" value="0" project="true" style="text-align: right;">
                                                </div>
                                            <div class="invalid-feedback d-block" id="invalid-amount"></div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="w-100 d-flex justify-content-between align-items-center py-2 addReq">
                            <!-- <div>${buttonProjectAddDeleteRow}</div> -->
                                <div class="w-100 text-left my-2 addReq">
                                    <button class="btn btn-primary btnAddRow" id="btnAddRow" project="true"><i class="fas fa-plus-circle"></i> Add Row</button>
                                    <button class="btn btn-danger btnDeleteRow" id="btnDeleteRow" project="true" disabled><i class="fas fa-minus-circle"></i> Delete Row/s</button>
                                </div>
                            </div>
                            <hr class="pb-1">
                            <div class="row">
                                <div class="col-md-12 col-sm-12">
                                    <div class="form-group">
                                        <label>Liquidation  Type</label>
                                        <select class="form-control validate select2"
                                            name="liquidationType"
                                            id="input_liquidationType"
                                            style="width: 100%"
                                            required>
                                            <option selected disabled>Select Liquidation Type</option>             
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <hr class="pb-1">
                            <h3 class="font-weight-bolder mb-3 text-center">LIQUIDATION FORM</h3>    
                            <table class="table table-striped table-hover" id="tableForApprroval" role="grid">
                                <thead>
                                    <tr style="background-color:#f1f1f1;">
                                        <th class="text-center font-weight-bolder" colspan="10">ITEMS</th>
                                    </tr>
                                    <tr style="white-space: nowrap">
                                        <th class="text-center" width="50">
                                            <div class="action">
                                                <input type="checkbox" class="checkboxall" project="true">
                                            </div>
                                        </th>
                                        <th>Client</th>
                                        <th>Description</th>
                                        <th>VAT Sales</th>
                                        <th>VAT</th>
                                        <th>SRF No.</th>
                                        <th>Charge Code</th>
                                        <th>Amount</th>
                                        <th>Remarks</th>
                                        <th>Referrence No.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-center">
                                            <div class="action">
                                                <input type="checkbox" class="checkboxrow" id="checkboxrow0" company="true">
                                            </div>
                                        </td>
                                        <td><input type="text" class="form-control" disabled value="${client}"></td>
                                        <td>
                                            <textarea rows="2" style="resize: none" class="form-control" name="liquidationDescription" id="input_liquidationDescription" data-allowcharacters="[a-z][A-Z][0-9][ ][.][,][-][()]['][/][&]"></textarea>
                                        </td>
                                        <td><input type="text" class="form-control" disabled value=""></td>
                                        <td><input type="text" class="form-control" disabled value=""></td>
                                        <td><input type="text" class="form-control" disabled value="${srfNo}"></td>
                                        <td><input type="text" class="form-control" disabled value="${chargeCode}"></td>
                                        <td>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">₱</span>
                                                </div>
                                                <input type="text" class="form-control amount" min="0.1" max="999999" minlength="1" maxlength="20" name="amount" id="amount0" value="0" project="true" style="text-align: right;">
                                            </div>
                                            <div class="invalid-feedback d-block" id="invalid-amount"></div>
                                        </td>
                                        <td>
                                            <textarea rows="2" style="resize: none" class="form-control" name="remarks" id="input_Remarks" data-allowcharacters="[a-z][A-Z][0-9][ ][.][,][-][()]['][/][&]"></textarea>
                                        </td>
                                        <td><input type="text" class="form-control" data-allowcharacters="[A-Z][ ]"  value=""></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td class="font-weight-bolder">TOTAL:</td>
                                        <td colspan="8"></td>
                                    </tr>
                                    <tr></tr>
                                    <tr></tr>
                                    <tr>
                                        <td></td>
                                        <td class="font-weight-bolder">TOTAL EXPENSES:</td>
                                        <td colspan="8"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="font-weight-bolder">BUDGET:</td>
                                        <td colspan="8"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="font-weight-bolder">EXCESS/(SHORTAGE):</td>
                                        <td colspan="8"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="font-weight-bolder">DISPOSITION OF EXCESS/(SHORTAGE):</td>
                                        <td colspan="8"></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="w-100 d-flex justify-content-between align-items-center py-2 addReq">
                            <!-- <div>${buttonProjectAddDeleteRow}</div> -->
                                <div class="w-100 text-left my-2 addReq">
                                    <button class="btn btn-primary btnAddRow" id="btnAddRow" project="true"><i class="fas fa-plus-circle"></i> Add Row</button>
                                    <button class="btn btn-danger btnDeleteRow" id="btnDeleteRow" project="true" disabled><i class="fas fa-minus-circle"></i> Delete Row/s</button>
                                </div>
                            </div>
                            <div class="col-md-12 text-right pr-0 mt-3 mb-3 addReq">
                                <button class="btn btn-submit px-5 p-2" id="btnSubmit"><i class="fas fa-paper-plane"></i> Submit
                                </button>
                                <button class="btn btn-cancel px-5 p-2" id="btnCancel"><i class="fas fa-ban"></i> 
                                    Cancel
                                </button>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>

            
        </div>
	</div>
</div>
    

    
</div>


<!-- ----- MODAL ----- -->
<div id="modal_petty_cash_request" class="modal custom-modal fade" data-backdrop="static" data-keyboard="false" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-md" role="document">
		<div class="modal-content">
			<div class="modal-header bg-primary text-light">
				<h6 class="page-title font-weight-bold">ADD PETTY CASH REQUEST</h6>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span class="text-light" aria-hidden="true">&times;</span>
				</button>
			</div>

            <div id="modal_petty_cash_request_content"></div>
        </div>
	</div>
</div>
<!-- ----- END MODAL ----- -->


<script src="<?= base_url('assets/custom/js/gen/approver-function.js') ?>"></script>
<!-- <script src="<?= base_url('assets/custom/js/fms/petty-cash-request.js') ?>"></script> -->
<script>
    $(document).ready(function () {
        $("#addRequest").show();
        $("#pcrDetails").show();
        $(".addReq").show();

        $(document).on("click", "#btnAdd", function () {
            $("#addRequest").show();
            $("#pcrDetails").show();
            $(".addReq").show();
            $("#pcrDatatable").hide();
        });


	});
</script>