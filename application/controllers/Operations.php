<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Operations extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model("Operations_model", "operations");
    }

    public function index()
    {
        $data["title"] = "Operations";

        $this->load->view("template/header", $data);
        $this->load->view("operations/index", $data);
        $this->load->view("template/footer", $data);
    }

    public function getTableData() 
    {
        $tableName    = $this->input->post("tableName");
        $columnName   = $this->input->post("columnName"); 
        $searchFilter = $this->input->post("searchFilter");
        $orderBy      = $this->input->post("orderBy");
        echo json_encode($this->operations->getTableData($tableName, $columnName, $searchFilter, $orderBy));
    }

    public function getUploadedFiles()
    {
        $data = [];
        if (is_array($_FILES)) {
            $fileName = $keyName = "";
            $fileLength = count($_FILES["tableData"]["name"]["file"]);
            for($i=0; $i<$fileLength; $i++) {
                $target_dir = "assets/upload-files/";
                $keyArr = explode(".", $_FILES["tableData"]["name"]["file"][$i]);
                $keyName = $keyArr[0];
                $fileType = pathinfo(basename($_FILES["tableData"]["name"]["file"][$i]),PATHINFO_EXTENSION);
                $target_file = $target_dir.$i.time().'.'.$fileType;
    
                if (move_uploaded_file($_FILES["tableData"]["tmp_name"]["file"][$i], $target_file)) {
                    $temp = $i.time().'.'.$fileType;
                    $fileName = $fileName ? $fileName."|".$temp : $temp;
                    
                }
            }
            $data[$keyName] = $fileName;
        }
        return $data;
    }

    public function insertTableData() 
    {
        $tableName = $this->input->post("tableName") ? $this->input->post("tableName") : null;
        $tableData = $this->input->post("tableData") ? $this->input->post("tableData") : false;
        $feedback  = $this->input->post("feedback")  ? $this->input->post("feedback") : null;
        $data = array();

        $uploadedFiles = $this->getUploadedFiles();
        if ($uploadedFiles) {
            foreach ($uploadedFiles as $fileKey => $fileValue) {
                $data[$fileKey] = $fileValue;
            }
        }

        if ($tableData) {
            foreach ($tableData as $key => $value) {
                $data[$key] = $value;
            }
            echo json_encode($this->operations->insertTableData($tableName, $data, $feedback));
        } else {
            echo json_encode("false|Invalid arguments");
        }
    }

    public function updateTableData()
    {
        $tableName   = $this->input->post("tableName") ? $this->input->post("tableName") : null;
        $tableData   = $this->input->post("tableData") ? $this->input->post("tableData") : false;
        $whereFilter = $this->input->post("whereFilter") ? $this->input->post("whereFilter") : false;
        $feedback    = $this->input->post("feedback")  ? $this->input->post("feedback") : null;
        $data = array();

        $uploadedFiles = $this->getUploadedFiles();
        if ($uploadedFiles) {
            foreach ($uploadedFiles as $fileKey => $fileValue) {
                $data[$fileKey] = $fileValue;
            }
        }
        
        if ($tableName && $tableData && $whereFilter) {
            foreach ($tableData as $key => $value) {
                $data[$key] = $value;
            }
            echo json_encode($this->operations->updateTableData($tableName, $data, $whereFilter, $feedback));
        } else {
            echo json_encode("false|Invalid arguments");
        }
    }

    public function deleteTableData()
    {
        $tableName   = $this->input->post("tableName") ? $this->input->post("tableName") : null;
        $whereFilter = $this->input->post("whereFilter") ? $this->input->post("whereFilter") : false;
        $feedback    = $this->input->post("feedback")  ? $this->input->post("feedback") : null;

        if ($tableName && $whereFilter) {
            echo json_encode($this->operations->deleteTableData($tableName, $whereFilter, $feedback));
        } else {
            echo json_encode("false|Invalid arguments");
        }
    }

}