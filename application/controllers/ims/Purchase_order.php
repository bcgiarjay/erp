<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

use PhpOffice\PhpSpreadsheet\Helper\Sample;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\RichText\RichText;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Protection;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Worksheet\ColumnDimension;
use PhpOffice\PhpSpreadsheet\Worksheet;

class Purchase_order extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model("ims/PurchaseOrder_model", "purchaseorder");
        isAllowed(47);
    }

    public function index()
    {
        $data["title"] = "Purchase Order";

        $this->load->view("template/header",$data);
        $this->load->view("ims/purchase_order/index");
        $this->load->view("template/footer");
    }

    public function insertPurchaseOrder()
    {
        $sessionID = 
            $CI->session->has_userdata("otherSessionID") ? 
            $CI->session->userdata("otherSessionID") : 1;

        $purchaseOrderID   = $this->input->get("purchaseOrderID");
        $bidRecapID        = $this->input->get("bidRecapID");
        $categoryType      = $this->input->get("categoryType");
        $inventoryVendorID = $this->input->get("inventoryVendorID");

        $data = [];
        $inventoryVendor = $this->purchaseorder->getInventoryVendor($inventoryVendorID);
        if ($inventoryVendor) {
            $vendorName           = $inventoryVendor->vendorName;
            $vendorAddress        = $inventoryVendor->vendorAddress;
            $vendorContactDetails = $inventoryVendor->vendorContactDetails;
            $vendorContactPerson  = $inventoryVendor->vendorContactPerson;
            
            $requestItems = $this->purchaseorder->getOrderItems($purchaseOrderID, $inventoryVendorID, $categoryType);

            $total            = 0;
            $discount         = 0;
            $totalAmount      = 0;
            $vatSales         = 0;
            $vat              = 0;
            $totalVat         = 0;
            $lessEwt          = 0;
            $grandTotalAmount = 0;
            $requestItemsID   = [];
            if ($requestItems) {
                foreach ($requestItems as $requestItem) {
                    array_push($requestItemsID, $requestItem["requestItemID"]);
                    $total += $requestItem["totalCost"];
                }
            }

            $data = [
                "purchaseOrderID"    => $purchaseOrderID,
                "bidRecapID"           => $bidRecapID,
                "categoryType"         => $categoryType,
                "inventoryVendorID"    => $inventoryVendorID,
                "vendorName"           => $vendorName,
                "vendorAddress"        => $vendorAddress,
                "vendorContactDetails" => $vendorContactDetails,
                "vendorContactPerson"  => $vendorContactPerson,
                "total"                => $total,
                "discount"             => $discount,
                "totalAmount"          => $totalAmount,
                "vatSales"             => $vatSales,
                "vat"                  => $vat,
                "totalVat"             => $totalVat,
                "lessEwt"              => $lessEwt,
                "grandTotalAmount"     => $grandTotalAmount,
                "createdBy"            => $sessionID,
                "updatedBy"            => $sessionID
            ];
            $requestItemsID = implode(", ", $requestItemsID);
            $insertPurchaseOrder = $this->purchaseorder->insertPurchaseOrder($data, $requestItemsID);
            echo json_encode($insertPurchaseOrder);
        }
    }

    public function savePurchaseOrder()
    {
        $action                = $this->input->post("action");
        $method                = $this->input->post("method");
        $purchaseOrderID       = $this->input->post("purchaseOrderID") ?? null;
        $revisePurchaseOrderID = $this->input->post("revisePurchaseOrderID") ?? null;
        $paymentTerms          = $this->input->post("paymentTerms") ?? null;
        $deliveryDate          = $this->input->post("deliveryDate") ?? null;
        $total                 = $this->input->post("total") ?? null;
        $discount              = $this->input->post("discount") ?? null;
        $totalAmount           = $this->input->post("totalAmount") ?? null;
        $vatSales              = $this->input->post("vatSales") ?? null;
        $vat                   = $this->input->post("vat") ?? null;
        $totalVat              = $this->input->post("totalVat") ?? null;
        $lessEwt               = $this->input->post("lessEwt") ?? null;
        $grandTotalAmount      = $this->input->post("grandTotalAmount") ?? null;
        $approversID           = $this->input->post("approversID") ?? null;
        $approversStatus       = $this->input->post("approversStatus") ?? null;
        $approversDate         = $this->input->post("approversDate") ?? null;
        $purchaseOrderStatus   = $this->input->post("purchaseOrderStatus");
        $purchaseOrderRemarks  = $this->input->post("purchaseOrderRemarks");
        $submittedAt           = $this->input->post("submittedAt") ?? null;
        $updatedBy             = $this->input->post("updatedBy");
        $items                 = $this->input->post("items") ?? null;

        $purchaseOrderData = [
            "revisePurchaseOrderID" => $revisePurchaseOrderID,
            "paymentTerms"          => $paymentTerms,
            "deliveryDate"          => $deliveryDate,
            "total"                 => $total,
            "discount"              => $discount,
            "totalAmount"           => $totalAmount,
            "vatSales"              => $vatSales,
            "vat"                   => $vat,
            "totalVat"              => $totalVat,
            "lessEwt"               => $lessEwt,
            "grandTotalAmount"      => $grandTotalAmount,
            "approversID"           => $approversID,
            "approversStatus"       => $approversStatus,
            "approversDate"         => $approversDate,
            "purchaseOrderStatus"   => $purchaseOrderStatus,
            "submittedAt"           => $submittedAt,
            "updatedBy"             => $updatedBy,
        ];

        $purchaseRequestID = $inventoryVendorID = "";
        if ($revisePurchaseOrderID) {
            $getPurchaseOrder = $this->purchaseorder->getPurchaseOrder($revisePurchaseOrderID);
            if ($getPurchaseOrder) {
                $purchaseRequestID = $getPurchaseOrder->purchaseRequestID;
                $inventoryVendorID = $getPurchaseOrder->inventoryVendorID;
                $purchaseOrderData["employeeID"]           = $getPurchaseOrder->employeeID;
                $purchaseOrderData["purchaseRequestID"]    = $purchaseRequestID;
                $purchaseOrderData["bidRecapID"]           = $getPurchaseOrder->bidRecapID;
                $purchaseOrderData["categoryType"]         = $getPurchaseOrder->categoryType;
                $purchaseOrderData["inventoryVendorID"]    = $inventoryVendorID;
                $purchaseOrderData["vendorName"]           = $getPurchaseOrder->vendorName;
                $purchaseOrderData["vendorAddress"]        = $getPurchaseOrder->vendorAddress;
                $purchaseOrderData["vendorContactDetails"] = $getPurchaseOrder->vendorContactDetails;
                $purchaseOrderData["vendorContactPerson"]  = $getPurchaseOrder->vendorContactPerson;
            }
        }

        if ($action == "update") {
            unset($purchaseOrderData["revisePurchaseOrderID"]);

            if ($method == "cancelform") {
                $purchaseOrderData = [
                    "purchaseOrderStatus" => 4,
                    "updatedBy"           => $updatedBy,
                ];
            } else if ($method == "approve") {
                $purchaseOrderData = [
                    "approversStatus"       => $approversStatus,
                    "approversDate"         => $approversDate,
                    "purchaseOrderStatus"   => $purchaseOrderStatus,
                    "updatedBy"             => $updatedBy,
                ];
            } else if ($method == "deny") {
                $purchaseOrderData = [
                    "approversStatus"      => $approversStatus,
                    "approversDate"        => $approversDate,
                    "purchaseOrderStatus"  => 3,
                    "purchaseOrderRemarks" => $purchaseOrderRemarks,
                    "updatedBy"            => $updatedBy,
                ];
            }
        }

        $savePurchaseOrderData = $this->purchaseorder->savePurchaseOrderData($action, $purchaseOrderData, $purchaseOrderID);
        if ($savePurchaseOrderData) {
            $result = explode("|", $savePurchaseOrderData);

            if ($result[0] == "true") {
                $purchaseOrderID = $result[2];

                if ($items) {
                    $purchaseOrderItems = [];
                    foreach($items as $index => $item) {
                        $temp = [
                            "purchaseRequestID" => $purchaseRequestID,
                            "purchaseOrderID"   => $purchaseOrderID,
                            "inventoryVendorID" => $inventoryVendorID,
                            "itemID"            => $item["itemID"] != "null" ? $item["itemID"] : null,
                            "categoryType"      => $item["categoryType"],
                            "quantity"          => $item["quantity"],
                            "unitCost"          => $item["unitcost"],
                            "totalCost"         => $item["totalcost"],
                            "files"             => array_key_exists("existingFile", $item) ? $item["existingFile"] : null, 
                            "remarks"           => $item["remarks"] ? $item["remarks"] : null, 
                            "createdBy"         => $item["createdBy"],
                            "updatedBy"         => $item["updatedBy"],
                        ];
                        array_push($purchaseOrderItems, $temp);
                    }
                    
                    if (isset($_FILES["items"])) {
                        $length = count($_FILES["items"]["name"]);
                        $keys   = array_keys($_FILES["items"]["name"]);
                        for ($i=0; $i<$length; $i++) {
                            $uploadedFile = explode(".", $_FILES["items"]["name"][$keys[$i]]["file"]);

                            $index     = (int)$uploadedFile[0]; 
                            $extension = $uploadedFile[1];
                            $filename  = $i.time().'.'.$extension;

                            $folderDir = "assets/upload-files/request-items/";
                            if (!is_dir($folderDir)) {
                                mkdir($folderDir);
                            }
                            $targetDir = $folderDir.$filename;

                            if (move_uploaded_file($_FILES["items"]["tmp_name"][$index]["file"], $targetDir)) {
                                $purchaseOrderItems[$index]["files"] = $filename;
                            }
                            
                        } 

                        // ----- UPDATE ITEMS FILE -----
                        foreach ($purchaseOrderItems as $key => $prItem) {
                            if (!array_key_exists("files", $prItem)) {
                                $purchaseOrderItems[$key]["files"] = null;
                            }
                        }
                        // ----- END UPDATE ITEMS FILE -----
                    }

                    $savePurchaseOrderItems = $this->purchaseorder->savePurchaseOrderItems($purchaseOrderItems, $purchaseOrderID);
                }

            }
            
        }
        echo json_encode($savePurchaseOrderData);
    }

    public function purchaseOrderExcel($data) {
        $fileName    = "PurchaseOrder.xlsx";
        $spreadsheet = new Spreadsheet();
        $sheet       = $spreadsheet->getActiveSheet();

        $spreadsheet->getDefaultStyle()->getFont()->setName('Segoe UI');
        $spreadsheet->getDefaultStyle()->getFont()->setSize(9);
        $spreadsheet->getDefaultStyle()->getAlignment()->setVertical(Alignment::VERTICAL_BOTTOM);
        $spreadsheet->getDefaultStyle()->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $spreadsheet->getActiveSheet()->getDefaultRowDimension()->setRowHeight(16);

        $sheet->getColumnDimension('A')->setWidth(3 * 1.139);
        $sheet->getColumnDimension('B')->setWidth(12 * 1.139);
        $sheet->getColumnDimension('C')->setWidth(8 * 1.139);
        $sheet->getColumnDimension('D')->setWidth(8 * 1.139);
        $sheet->getColumnDimension('E')->setWidth(8 * 1.139);
        $sheet->getColumnDimension('F')->setWidth(8 * 1.139);
        $sheet->getColumnDimension('G')->setWidth(9 * 1.139);
        $sheet->getColumnDimension('H')->setWidth(9 * 1.139);
        $sheet->getColumnDimension('I')->setWidth(7 * 1.139);
        $sheet->getColumnDimension('J')->setWidth(14 * 1.139);
        $sheet->getColumnDimension('K')->setWidth(14 * 1.139);

        $sheet->getRowDimension('1')->setRowHeight(19);
        $sheet->getRowDimension('2')->setRowHeight(17);
        $sheet->getRowDimension('3')->setRowHeight(27);
        $sheet->getRowDimension('4')->setRowHeight(17);
        $sheet->getRowDimension('5')->setRowHeight(17);
        $sheet->getRowDimension('6')->setRowHeight(17);
        $sheet->getRowDimension('7')->setRowHeight(17);

        // ----- STYLES -----
        $documentNoStyle = [
            "font" => [
                "bold"  => true,
                "color" => array("rgb" => "fe0000"),
                "size"  => 10
            ],
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_CENTER,
                "horizontal" => Alignment::HORIZONTAL_RIGHT
            ],
        ];

        $titleStyle = [
            "font" => [
                "bold"  => true,
                "color" => array("rgb" => "800000"),
                "size"  => 14
            ],
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_BOTTOM,
                "horizontal" => Alignment::HORIZONTAL_CENTER
            ],
        ];

        $labelFillStyle = [
            "font" => [
                "color" => array("rgb" => "FFFFFF"), 
                "bold" => true,
            ],
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_BOTTOM,
                "horizontal" => Alignment::HORIZONTAL_LEFT
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'FF161616',
                ],
            ],
        ];

        $labelBoldStyle = [
            "font" => [
                "bold" => true,
            ],
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_CENTER,
                "horizontal" => Alignment::HORIZONTAL_LEFT
            ]
        ];

        $commentInstructionStyle = [
            "font" => [
                "size" => 7
            ],
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_TOP,
                "horizontal" => Alignment::HORIZONTAL_LEFT,
                "wrapText"   => true
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        $approversStyle = [
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_CENTER,
                "horizontal" => Alignment::HORIZONTAL_LEFT,
                "wrapText"   => true
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        $amountWordStyle = [
            "alignment" => [
                "vertical"   => Alignment::VERTICAL_CENTER,
                "horizontal" => Alignment::HORIZONTAL_CENTER,
                "wrapText"   => true
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        $allBorderStyle = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        $sideBorderStyle = [
            'borders' => [
                'left' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
                'right' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];

        $bottomBorderStyle = [
            'borders' => [
                'bottom' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'],
                ],
            ],
        ];
        // ----- END STYLES -----

        // ----- TITLE -----
        $sheet->mergeCells('A1:K1');
        $sheet->setCellValue('A1', getFormCode("PO", $data["createdAt"], $data["purchaseOrderID"]));
        $sheet->getStyle('A1')->applyFromArray($documentNoStyle);
        $sheet->mergeCells('A2:K2');
        $sheet->setCellValue('A2', "PURCHASE ORDER");
        $sheet->getStyle('A2')->applyFromArray($titleStyle);
        // ----- END TITLE -----

        // ----- HEADER -----
        $sheet->mergeCells('B3:C3');
        $sheet->setCellValue('B3', "Company Name: ");
        $sheet->mergeCells('D3:G3');
        $sheet->setCellValue('D3', $data["companyName"]);
        $sheet->mergeCells('H3:I3');
        $sheet->setCellValue('H3', "Date: ");
        $sheet->mergeCells('J3:K3');
        $sheet->setCellValue('J3', $data["dateAproved"]);

        $sheet->mergeCells('B4:C4');
        $sheet->setCellValue('B4', "Address: ");
        $sheet->mergeCells('D4:G4');
        $sheet->setCellValue('D4', $data["address"]);
        $sheet->mergeCells('H4:I4');
        $sheet->setCellValue('H4', "Reference No.: ");
        $sheet->mergeCells('J4:K4');
        $sheet->setCellValue('J4', $data["referenceNo"]);
        $sheet->getRowDimension('4')->setRowHeight(26.25);

        $sheet->mergeCells('B5:C5');
        $sheet->setCellValue('B5', "Contact Details: ");
        $sheet->mergeCells('D5:G5');
        $sheet->setCellValue('D5', $data["contactDetails"]);
        $sheet->mergeCells('H5:I5');
        $sheet->setCellValue('H5', "Payment Terms: ");
        $sheet->mergeCells('J5:K5');
        $sheet->setCellValue('J5', $data["paymentTerms"]);

        $sheet->mergeCells('B6:C6');
        $sheet->setCellValue('B6', "Contact Person: ");
        $sheet->mergeCells('D6:G6');
        $sheet->setCellValue('D6', $data["contactPerson"]);
        $sheet->mergeCells('H6:I6');
        $sheet->setCellValue('H6', "Delivery Date: ");
        $sheet->mergeCells('J6:K6');
        $sheet->setCellValue('J6', $data["deliveryDate"]);

        $sheet->getStyle("B3:C6")->applyFromArray($labelFillStyle);
        $sheet->getStyle("H3:I6")->applyFromArray($labelFillStyle);
        $sheet->getStyle("A3:K6")->applyFromArray($allBorderStyle);
        // ----- END HEADER -----

        // ----- REQUEST ITEMS -----
        $sheet->setCellValue('B8', "Code");
        $sheet->mergeCells('C8:G8');
        $sheet->setCellValue('C8', "Item Description");
        $sheet->setCellValue('H8', "Qty");
        $sheet->setCellValue('I8', "Unit");
        $sheet->setCellValue('J8', "Unit Cost");
        $sheet->setCellValue('K8', "Total Amount");
        $sheet->getStyle("B8:K8")->applyFromArray($labelFillStyle);
        $sheet->getStyle("B8:K8")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $rowNumber = 9;
        $requestItems = $data["items"];
        $limit = count($requestItems) <= 20 ? 20 : count($requestItems);
        for ($i=0; $i<$limit; $i++) { 
            $code = $desc = $qty = $unit = $unitcost = $totalamount = "";
            if ($i < count($requestItems)) {
                $code        = $requestItems[$i]["code"] ?? "";
                $desc        = $requestItems[$i]["desc"] ?? "";
                $qty         = $requestItems[$i]["qty"] ?? "";
                $unit        = $requestItems[$i]["unit"] ?? "";
                $unitcost    = $requestItems[$i]["unitcost"] ? formatAmount($requestItems[$i]["unitcost"] ?? 0.00) : "";
                $totalamount = $requestItems[$i]["totalamount"] ? formatAmount($requestItems[$i]["totalamount"] ?? 0.00) : "";
            }
            $sheet->setCellValue("B$rowNumber", $code);
            $sheet->mergeCells("C$rowNumber:G$rowNumber");
            $sheet->setCellValue("C$rowNumber", $desc);
            $sheet->setCellValue("H$rowNumber", $qty);
            $sheet->setCellValue("I$rowNumber", $unit);
            $sheet->setCellValue("J$rowNumber", $unitcost);
            $sheet->setCellValue("K$rowNumber", $totalamount);

            $sheet->getStyle("B$rowNumber")->applyFromArray($sideBorderStyle);
            $sheet->getStyle("C$rowNumber")->applyFromArray($sideBorderStyle);
            $sheet->getStyle("H$rowNumber")->applyFromArray($sideBorderStyle);
            $sheet->getStyle("I$rowNumber")->applyFromArray($sideBorderStyle);
            $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
            $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);

            $sheet->getStyle("J$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

            $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
            $rowNumber++;
        }
        $sheet->getStyle("B".($rowNumber-1).":K".($rowNumber-1))->applyFromArray($bottomBorderStyle);
        // ----- END REQUEST ITEMS -----

        // ----- FOOTER -----
        $sheet->mergeCells("B$rowNumber:I$rowNumber");
        $sheet->setCellValue("B$rowNumber", "COMMENTS/INSTRUCTION");
        $sheet->getStyle("B$rowNumber:I$rowNumber")->applyFromArray($labelFillStyle);
        $sheet->setCellValue("J$rowNumber", "Total");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["total"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $sheet->getStyle("J$rowNumber:J".($rowNumber+7))->applyFromArray($labelBoldStyle);
        $rowNumber++;
        $commentInstructionText = "1. Purchase Order must appear in all documents.\n2. The price of the Goods and/or Services stated in this purchase order shall be the price agreed upon in writing by the Company and the Supplier.\n3. Goods are subject to inspection upon arrival Goods must conform to description and specification set above, otherwise this will be return at the supplier's expenses.\n4. Original Invoice and/or Delivery receipt are left with Receiving Clerk to facilitate payment.";
        $sheet->mergeCells("B$rowNumber:I".($rowNumber+3));
        $sheet->setCellValue("B$rowNumber", $commentInstructionText);
        $sheet->getStyle("B$rowNumber:I".($rowNumber+3))->applyFromArray($commentInstructionStyle);
        $sheet->setCellValue("J$rowNumber", "Discount");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["discount"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;
        $sheet->setCellValue("J$rowNumber", "Total Amount");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["totalAmount"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;
        $sheet->setCellValue("J$rowNumber", "Vatable Sales");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["vatSales"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;
        $sheet->setCellValue("J$rowNumber", "Vat 12%");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["vat"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;
        
        $sheet->mergeCells("B$rowNumber:I$rowNumber");
        $sheet->setCellValue("B$rowNumber", "AMOUNT IN WORDS");
        $sheet->getStyle("B$rowNumber:I$rowNumber")->applyFromArray($labelFillStyle);
        $sheet->setCellValue("J$rowNumber", "Total");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["totalVat"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;
        $sheet->mergeCells("B$rowNumber:I".($rowNumber+1));
        $sheet->setCellValue("B$rowNumber", $data["grandTotalAmount"] != null ? convertNumberToWords($data["grandTotalAmount"] ?? "0") : "");
        $sheet->getStyle("B$rowNumber:I".($rowNumber+1))->applyFromArray($amountWordStyle);
        $sheet->setCellValue("J$rowNumber", "Less EWT");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["lessEwt"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;
        $sheet->setCellValue("J$rowNumber", "Grand Total");
        $sheet->getStyle("J$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->setCellValue("K$rowNumber", formatAmount($data["grandTotalAmount"] ?? 0.00));
        $sheet->getStyle("K$rowNumber")->applyFromArray($sideBorderStyle);
        $sheet->getStyle("K$rowNumber")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17);
        $rowNumber++;

        $employees      = $data["employees"];
        $countEmployees = count($employees);
        if ($countEmployees > 3) {
            $columns = [["B", "F"], ["G", "K"]];
        } else {
            $columns = [["B", "E"], ["F", "H"], ["I", "K"]];
        }

        foreach ($employees as $index => $employee) {
            if ($countEmployees > 3) {
                if ($index % 2 == 0) {
                    if ($index != 0) $rowNumber++;
                    $cell     = $columns[0][0].$rowNumber.":".$columns[0][1].$rowNumber;
                    $baseCell = $columns[0][0].$rowNumber;
                    if (($index+1) == $countEmployees) {
                        $cell     = "B".$rowNumber.":K".$rowNumber;
                        $baseCell = "B".$rowNumber;
                    }
                } else {
                    $cell     = $columns[1][0].$rowNumber.":".$columns[1][1].$rowNumber;
                    $baseCell = $columns[1][0].$rowNumber;
                }
            } else {
                $cell     = $columns[$index][0].$rowNumber.":".$columns[$index][1].$rowNumber;
                $baseCell = $columns[$index][0].$rowNumber;
            }
            $sheet->mergeCells($cell);
            
            $titleName = $employee["title"].": ".$employee["name"];
            $position  = $employee["position"];

            $richText = new RichText();
            $richText->createText('');
            $cellText = $richText->createTextRun($titleName);
            $cellText->getFont()->setBold(true);
            $richText->createText("\n$position");

            $sheet->setCellValue($baseCell, $richText);
            $sheet->getStyle($cell)->applyFromArray($approversStyle);
            $sheet->getRowDimension($rowNumber)->setRowHeight(17*2);
        }
        $rowNumber++;

        $sheet->mergeCells("B$rowNumber:E$rowNumber");
        $sheet->setCellValue("B$rowNumber", "Acknowledge by: ");
        $sheet->getStyle("B$rowNumber:E$rowNumber")->applyFromArray($allBorderStyle);
        $sheet->mergeCells("F$rowNumber:H$rowNumber");
        $sheet->setCellValue("F$rowNumber", "Supplier's Signature: ");
        $sheet->getStyle("F$rowNumber:H$rowNumber")->applyFromArray($allBorderStyle);
        $sheet->mergeCells("I$rowNumber:K$rowNumber");
        $sheet->setCellValue("I$rowNumber", "Date: ");
        $sheet->getStyle("I$rowNumber:K$rowNumber")->applyFromArray($allBorderStyle);
        $sheet->getRowDimension("$rowNumber")->setRowHeight(17*2);
        $sheet->getStyle("B$rowNumber:K$rowNumber")->getFont()->setBold(true);
        // ----- END FOOTER -----

        $writer = new Xlsx($spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="'. urlencode($fileName).'"');
        $writer->save('php://output');
    }

    public function downloadExcel()
    {
        $purchaseOrderID = $this->input->get("id");
        if ($purchaseOrderID) {
            $purchaseOrderData = $this->purchaseorder->getPurchaseOrderData($purchaseOrderID);
            if ($purchaseOrderData) {
                $this->purchaseOrderExcel($purchaseOrderData);
            }
        }
    }

    public function savePurchaseOrderContract()
    {
        $purchaseOrderID = $this->input->post("purchaseOrderID");
        if (isset($_FILES["files"])) {
            $uploadedFile = explode(".", $_FILES["files"]["name"]);
            $extension    = $uploadedFile[1];
            $filename     = implode(".", $uploadedFile).time().'.'.$extension;

            $folderDir = "assets/upload-files/contracts/";
            if (!is_dir($folderDir)) {
                mkdir($folderDir);
            }

            $targetDir = $folderDir.$filename;
            if (move_uploaded_file($_FILES["files"]["tmp_name"], $targetDir)) {
                $employeeProfile = $filename;

                $savePurchaseOrderContract = $this->purchaseorder->savePurchaseOrderContract($purchaseOrderID, $filename);
                echo json_encode($savePurchaseOrderContract);
            }
        }
    }

}