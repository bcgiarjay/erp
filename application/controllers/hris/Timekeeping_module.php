<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Timekeeping_module extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model("hris/TimekeepingModule_model", "timekeeping");
        $this->load->model("hris/EmployeeAttendance_model", "employeeattendance");
        isAllowed(109);
    }

    public function index()
    {
        $syncEmployee   = $this->employeeattendance->syncEmployeeToBiotime();
        $syncAttendance = $this->employeeattendance->syncEmployeeAttendance();

        $data["title"] = "Timekeeping Module";
        $this->load->view("template/header", $data);
        $this->load->view("hris/timekeeping_module/index");
        $this->load->view("template/footer");
    }

    public function searchTimesheet()
    {
        $timekeepingID = $this->input->post("timekeepingID");
        $startDate     = $this->input->post("startDate");
        $endDate       = $this->input->post("endDate");
        echo json_encode($this->timekeeping->searchTimesheet($timekeepingID, $startDate, $endDate));
    }

    public function saveTimekeeping()
    {
        $action               = $this->input->post("action");
        $method               = $this->input->post("method");
        $timekeepingID        = $this->input->post("timekeepingID") ?? null;
        $reviseTimekeepingID  = $this->input->post("reviseTimekeepingID") ?? null;
        $employeeID           = $this->input->post("employeeID");
        $timekeepingReason    = $this->input->post("timekeepingReason") ?? null;
        $timekeepingStartDate = $this->input->post("timekeepingStartDate") ?? null;
        $timekeepingEndDate   = $this->input->post("timekeepingEndDate") ?? null;
        $timekeepingStatus    = $this->input->post("timekeepingStatus") ?? null;
        $approversID          = $this->input->post("approversID") ?? null;
        $approversStatus      = $this->input->post("approversStatus") ?? null;
        $approversDate        = $this->input->post("approversDate") ?? null;
        $createdBy            = $this->input->post("createdBy") ?? null;
        $updatedBy            = $this->input->post("updatedBy") ?? null;
        $createdAt            = $this->input->post("createdAt") ?? null;
        $submittedAt          = $this->input->post("submittedAt") ?? null;
        $timekeepingRemarks   = $this->input->post("timekeepingRemarks") ?? null;
        $items                = $this->input->post("items") ?? null;

        $timekeepingData = [
            "reviseTimekeepingID"  => $reviseTimekeepingID,
            "employeeID"           => $employeeID,
            "timekeepingReason"    => $timekeepingReason,
            "timekeepingStartDate" => $timekeepingStartDate,
            "timekeepingEndDate"   => $timekeepingEndDate,
            "timekeepingStatus"    => $timekeepingStatus,
            "approversID"          => $approversID,
            "approversStatus"      => $approversStatus,
            "approversDate"        => $approversDate,
            "submittedAt"          => $submittedAt,
            "createdBy"            => $createdBy,
            "updatedBy"            => $updatedBy,
            "createdAt"            => $createdAt
        ];

        if ($action == "update") {
            unset($timekeepingData["reviseTimekeepingID"]);
            unset($timekeepingData["createdBy"]);
            unset($timekeepingData["createdAt"]);

            if ($method == "cancelform") {
                $timekeepingData = [
                    "timekeepingStatus" => 4,
                    "updatedBy"         => $updatedBy,
                ];
            } else if ($method == "approve") {
                $timekeepingData = [
                    "approversStatus"   => $approversStatus,
                    "approversDate"     => $approversDate,
                    "timekeepingStatus" => $timekeepingStatus,
                    "updatedBy"         => $updatedBy,
                ];
            } else if ($method == "deny") {
                $timekeepingData = [
                    "approversStatus"    => $approversStatus,
                    "approversDate"      => $approversDate,
                    "timekeepingStatus"  => 3,
                    "timekeepingRemarks" => $timekeepingRemarks,
                    "updatedBy"          => $updatedBy,
                ];
            } else if ($method == "drop") {
                $timekeepingData = [
                    "reviseTimekeepingID" => $reviseTimekeepingID,
                    "timekeepingStatus"   => 5,
                    "updatedBy"           => $updatedBy,
                ]; 
            }
        }

        $saveTimekeepingData = $this->timekeeping->saveTimekeepingData($action, $timekeepingData,$timekeepingID);

        if ($saveTimekeepingData) {
            $result = explode("|", $saveTimekeepingData);

            if ($result[0] == "true") {
                $timekeepingID = $result[2];

                if ($items) {
                    $deleteTimekeeping = $this->timekeeping->deleteTimekeeping($timekeepingID);

                    $timekeepingProduction = [];
                    foreach($items as $item) {
                        $employeeID            = $item["employeeID"] ?? null;
                        $scheduleDate          = $item["scheduleDate"] ?? null;
                        $scheduleIn            = $item["scheduleIn"] ?? null;
                        $scheduleOut           = $item["scheduleOut"] ?? null;
                        $scheduleBreakDuration = $item["scheduleBreakDuration"] ?? null;
                        $scheduleDuration      = $item["scheduleDuration"] ?? null;
                        $checkIn               = $item["checkIn"] ?? null;
                        $checkOut              = $item["checkOut"] ?? null;
                        $noTimeIn              = $item["noTimeIn"] ?? null;
                        $noTimeOut             = $item["noTimeOut"] ?? null;
                        $noInOutID             = $item["noInOutID"] ?? null;
                        $noInOutReference      = $item["noInOutReference"] ?? null;
                        $overtimeIn            = $item["overtimeIn"] ?? null;
                        $overtimeOut           = $item["overtimeOut"] ?? null;
                        $overtimeBreakDuration = $item["overtimeBreakDuration"] ?? null;
                        $overtimeID            = $item["overtimeID"] ?? null;
                        $overtimeReference     = $item["overtimeReference"] ?? null;
                        $leaveIn               = $item["leaveIn"] ?? null;
                        $leaveOut              = $item["leaveOut"] ?? null;
                        $leaveID               = $item["leaveID"] ?? null;
                        $leaveReference        = $item["leaveReference"] ?? null;
                        $leaveType             = $item["leaveType"] ?? null;
                        $leaveDuration         = $item["leaveDuration"] ?? null;
                        $checkDuration         = $item["checkDuration"] ?? null;
                        $basicHours            = $item["basicHours"] ?? null;
                        $overtimeHours         = $item["overtimeHours"] ?? null;
                        $nightDifferential     = $item["nightDifferential"] ?? null;
                        $totalHours            = $item["totalHours"] ?? null;
                        $status                = $item["status"] ?? null;

                        $odHours       = $item["odHours"] ?? 0;
                        $odOtHours     = $item["odOtHours"] ?? 0;
                        $odNsHours     = $item["odNsHours"] ?? 0;
                        $odNsOtHours   = $item["odNsOtHours"] ?? 0;
                        $odRdHours     = $item["odRdHours"] ?? 0;
                        $odRdOtHours   = $item["odRdOtHours"] ?? 0;
                        $odRdNsHours   = $item["odRdNsHours"] ?? 0;
                        $odRdNsOtHours = $item["odRdNsOtHours"] ?? 0;
                        $sdRdHours     = $item["sdRdHours"] ?? 0;
                        $sdRdOtHours   = $item["sdRdOtHours"] ?? 0;
                        $sdRdNsHours   = $item["sdRdNsHours"] ?? 0;
                        $sdRdNsOtHours = $item["sdRdNsOtHours"] ?? 0;
                        $rhRdHours     = $item["rhRdHours"] ?? 0;
                        $rhRdOtHours   = $item["rhRdOtHours"] ?? 0;
                        $rhRdNsHours   = $item["rhRdNsHours"] ?? 0;
                        $rhRdNsOtHours = $item["rhRdNsOtHours"] ?? 0;
                        $dhRdHours     = $item["dhRdHours"] ?? 0;
                        $dhRdOtHours   = $item["dhRdOtHours"] ?? 0;
                        $dhRdNsHours   = $item["dhRdNsHours"] ?? 0;
                        $dhRdNsOtHours = $item["dhRdNsOtHours"] ?? 0;

                        $timekeepingItem = [
                            "timekeepingID"         => $timekeepingID,
                            "employeeID"            => $employeeID,
                            "scheduleDate"          => $scheduleDate,
                            "scheduleIn"            => $scheduleIn,
                            "scheduleOut"           => $scheduleOut,
                            "scheduleBreakDuration" => $scheduleBreakDuration,
                            "scheduleDuration"      => $scheduleDuration,
                            "checkIn"               => $checkIn,
                            "checkOut"              => $checkOut,
                            "noInOutID"             => $noInOutID,
                            "noInOutReference"      => $noInOutReference,
                            "noTimeIn"              => $noTimeIn,
                            "noTimeOut"             => $noTimeOut,
                            "overtimeID"            => $overtimeID,
                            "overtimeReference"     => $overtimeReference,
                            "overtimeIn"            => $overtimeIn,
                            "overtimeOut"           => $overtimeOut,
                            "overtimeBreakDuration" => $overtimeBreakDuration,
                            "leaveID"               => $leaveID,
                            "leaveReference"        => $leaveReference,
                            "leaveType"             => $leaveType,
                            "leaveIn"               => $leaveIn,
                            "leaveOut"              => $leaveOut,
                            "leaveDuration"         => $leaveDuration,
                            "checkDuration"         => $checkDuration,
                            "basicHours"            => $basicHours,
                            "overtimeHours"         => $overtimeHours,
                            "nightDifferential"     => $nightDifferential,
                            "totalHours"            => $totalHours,
                            "timekeepingItemStatus" => $status,
                            "createdBy"             => $updatedBy,
                            "updatedBy"             => $updatedBy,
                        ];
                        $saveTimekeepingItem = $this->timekeeping->saveTimekeepingItem($timekeepingID, $timekeepingItem);

                        if ($saveTimekeepingItem) 
                        {
                            $timekeepingItemID = $saveTimekeepingItem;
                            $temp = [
                                "timekeepingID"     => $timekeepingID,
                                "timekeepingItemID" => $timekeepingItemID,
                                "scheduleDate"      => $scheduleDate,
                                "odHours"           => $odHours,
                                "odOtHours"         => $odOtHours,
                                "odNsHours"         => $odNsHours,
                                "odNsOtHours"       => $odNsOtHours,
                                "odRdHours"         => $odRdHours,
                                "odRdOtHours"       => $odRdOtHours,
                                "odRdNsHours"       => $odRdNsHours,
                                "odRdNsOtHours"     => $odRdNsOtHours,
                                "sdRdHours"         => $sdRdHours,
                                "sdRdOtHours"       => $sdRdOtHours,
                                "sdRdNsHours"       => $sdRdNsHours,
                                "sdRdNsOtHours"     => $sdRdNsOtHours,
                                "rhRdHours"         => $rhRdHours,
                                "rhRdOtHours"       => $rhRdOtHours,
                                "rhRdNsHours"       => $rhRdNsHours,
                                "rhRdNsOtHours"     => $rhRdNsOtHours,
                                "dhRdHours"         => $dhRdHours,
                                "dhRdOtHours"       => $dhRdOtHours,
                                "dhRdNsHours"       => $dhRdNsHours,
                                "dhRdNsOtHours"     => $dhRdNsOtHours,
                                "createdBy"         => $updatedBy,
                                "updatedBy"         => $updatedBy,
                            ];

                            array_push($timekeepingProduction, $temp);
                        }
                    }

                    $saveTimekeepingProduction = $this->timekeeping->saveTimekeepingProduction($timekeepingID, $timekeepingProduction);
                }
            }
        }

        echo json_encode($saveTimekeepingData);
    }




    // ----- UPLOAD TIMESHEET -----
    public function checkDate($date = "", $isDateTime = false)
    {
        if ($date) {
            $format     = $isDateTime ? "Y-m-d H:i" : "Y-m-d";
            $dateformat = $isDateTime ? "Y-m-d H:i:s" : "Y-m-d";
            $d = DateTime::createFromFormat($format, $date);
            $isValid = $d && $d->format($format) == $date;
            
            if ($isValid) {
                return date($dateformat, strtotime($date)) ?? false;
            }
        }
        return false;
    }

    public function getEmployeeID($code = "")
    {
        $result = false;
        if ($code) {
            $arr = explode("-", $code);
            if (count($arr) == 3) {
                $result = floatval($arr[2]);
            }
        }
        return $result;
    }

    public function getUploadedTimesheet() 
    {
        $result  = [];
        $errors  = [];
        $columns = ["employeecode", "schedule", "timein", "timeout", "breakduration"];
        
        if (isset($_FILES["files"])) {
            $file_array = explode(".", $_FILES["files"]["name"]);
            $file_name = $file_array[0];
            $file_ext  = end($file_array);

            $column_name = [];
            $final_data  = [];

            $file_data  = file_get_contents($_FILES["files"]["tmp_name"]);
            $data_array = array_map("str_getcsv", explode("\n", $file_data));
            
            $labels = array_shift($data_array);
            foreach($labels as $label) {
                if ($label) $column_name[] = $label;
            }

            if (count($columns) == count($column_name)) {

                $file_data_array = [];
                foreach($data_array as $dt) {
                    $flag = false;
                    if (!empty($dt[0]) && count($dt) >= 5) $flag = true;
                    if ($flag) {
                        $temp = [];
                        foreach($column_name as $x => $col) {
                            $temp[] = $dt[$x];
                        }
                        $file_data_array[] = $temp;
                    } 
                }

                foreach($file_data_array as $x => $arr) {
                    $row = $x + 2;
                    if (count($columns) == count($arr)) {
                        $flag = true;
                        $data = [];
                        foreach($columns as $y => $col) {
                            $value = $arr[$y];
                            if ($value) {
                                $data["row"] = $row;
                                if ($col == "employeecode") {
                                    $employeeID = $this->getEmployeeID($value);
                                    if ($employeeID) {
                                        $data["employeeid"]   = $employeeID;
                                        $data["employeecode"] = $value;
                                    }
                                } else if ($col == "schedule" || $col == "timein" || $col == "timeout") {
                                    $isDateTime = ($col == "timein" || $col == "timeout") ? true : false;
                                    $valid = $this->checkDate($value, $isDateTime);
                                    if (!$valid) {
                                        $error = "danger|Invalid date format at line $row";
                                        $errors[] = $error;
                                        $flag = false;
                                        break;
                                    } else {
                                        $value = $valid;
                                    }
                                }
                                $data[$col] = $value;
                            } else {
                                $error = "danger|There is an incomplete value at line $row";
                                $errors[] = $error;
                                $flag = false;
                                break;
                            }
                        }
                        if ($flag) {
                            $final_data[] = $data;
                        } 
                    } else {
                        $error = "danger|Incorrect column length at line $row";
                        $errors[] = $error;
                    }
                }

            } else {
                $error = "danger|Incorrect column length";
                $errors[] = $error;
            }


            $employeeDataArr = [];
            $employeeIDArr   = [];
            foreach($final_data as $data) {
                $employeeID   = $data["employeeid"];
                $employeeCode = $data["employeecode"];
                if (!in_array($employeeID, $employeeIDArr)) {
                    $employeeIDArr[] = $employeeID;
                    $employeeDataArr[] = [
                        "employeeID"   => $employeeID,
                        "employeeCode" => $employeeCode
                    ];
                }
            }

            $final_result = [];
            foreach($employeeDataArr as $empID) {
                $employeeID   = $empID["employeeID"];
                $employeeCode = $empID["employeeCode"];

                $temp = [
                    "employeeID"   => $employeeID,
                    "employeeCode" => $employeeCode,
                    "data"         => [],
                ];
                foreach($final_data as $data) {
                    $id = $data["employeeid"];
                    if ($id == $employeeID) $temp["data"][] = $data;
                }
                $final_result[] = $temp;
            }

            // $result = $file_data_array;
            $result = [$errors, $final_result];
        }
        return $result;
    }

    public function uploadTimesheet()
    {
        $timekeepingID = $this->input->post("timekeepingID") ?? null;
        $startDate     = $this->input->post("startDate");
        $endDate       = $this->input->post("endDate");
        $file          = $this->getUploadedTimesheet();

        
        // echo json_encode($file);
        echo json_encode($this->timekeeping->searchTimesheet($timekeepingID, $startDate, $endDate, $file));
    }
    // ----- END UPLOAD TIMESHEET -----

}