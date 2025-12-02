// ========= Helper: safe string conversion =========
function s(v) {
    if (v == null) return '';
    try {
        return v.toString();
    } catch (e) {
        return '' + v;
    }
}

function trim(v) {
    return s(v).replace(/^\s+|\s+$/g, '');
}

// ========= Grab core segments =========
var msh = msg['MSH'];
var pid = msg['PID'];
var pv1 = msg['PV1'];
var orc = msg['ORC'];     // not used yet, but available
var obr = msg['OBR'];     // single radiology order
var obx = msg['OBX'];     // single OBX in our sample

// ========= Patient Demographics (PID) =========
var patientId              = s(pid['PID.3']['PID.3.1']);   // 98765432
var patientIdAssigningAuth = s(pid['PID.3']['PID.3.4']);   // HOSPITAL1

var patientLast            = s(pid['PID.5']['PID.5.1']);   // DOE
var patientFirst           = s(pid['PID.5']['PID.5.2']);   // JANE
var patientMiddle          = s(pid['PID.5']['PID.5.3']);   // MARIE
var patientNameHL7         = patientLast + '^' + patientFirst + '^' + patientMiddle;

var dob                    = s(pid['PID.7']['PID.7.1']);   // 19870412
var sex                    = s(pid['PID.8']['PID.8.1']);   // F

var addressStreet          = s(pid['PID.11']['PID.11.1']); // 123 BLUEBIRD LN
var addressCity            = s(pid['PID.11']['PID.11.3']); // NEWARK
var addressState           = s(pid['PID.11']['PID.11.4']); // NJ
var addressZip             = s(pid['PID.11']['PID.11.5']); // 07104
var addressCountry         = s(pid['PID.11']['PID.11.6']); // USA

var phone                  = s(pid['PID.13']['PID.13.1']); // (973)555-3421

// ========= Visit / Encounter (PV1) =========
var patientClass           = s(pv1['PV1.2']['PV1.2.1']);   // O (outpatient)

var locationPoint          = s(pv1['PV1.3']['PV1.3.1']);   // RAD
var locationRoom           = s(pv1['PV1.3']['PV1.3.2']);   // RM3
var locationBed            = s(pv1['PV1.3']['PV1.3.3']);   // B1
var locationFacility       = s(pv1['PV1.3']['PV1.3.4']);   // HOSPITAL1

var visitNumber            = s(pv1['PV1.15']['PV1.15.1']); // VST4321987
var admitDateTime          = s(pv1['PV1.39']['PV1.39.1']); // 20250201103000

// ========= Ordering / Performing Physician & Procedure (OBR) =========
var ordProvId        = '';
var ordProvLast      = '';
var ordProvFirst     = '';
var ordProvMiddle    = '';
var ordProvNameHL7   = '';

var procCode         = '';
var procText         = '';
var procCodingSys    = '';

var schedDateTime    = '';
var observationDate  = '';

if (obr != null) {
    // In your sample, physician is in OBR-14
    ordProvId      = s(obr['OBR.14']['OBR.14.1']);
    ordProvLast    = s(obr['OBR.14']['OBR.14.2']);
    ordProvFirst   = s(obr['OBR.14']['OBR.14.3']);
    ordProvMiddle  = s(obr['OBR.14']['OBR.14.4']);
    ordProvNameHL7 = ordProvLast + '^' + ordProvFirst + '^' + ordProvMiddle;

    // Procedure code (OBR-4)
    procCode       = s(obr['OBR.4']['OBR.4.1']);             // XRCHEST

    // Description is split in OBR.4.2.1 + OBR.4.2.2
    var procText1  = trim(obr['OBR.4']['OBR.4.2']['OBR.4.2.1']); // "Chest X-Ray PA "
    var procText2  = trim(obr['OBR.4']['OBR.4.2']['OBR.4.2.2']); // "LAT"
    procText       = (procText1 + ' ' + procText2).trim();       // "Chest X-Ray PA LAT"

    procCodingSys  = s(obr['OBR.4']['OBR.4.3']);              // L

    // Scheduled datetime (OBR-7)
    schedDateTime  = s(obr['OBR.7']['OBR.7.1']);             // 20250201113000

    // Observation date – your sample has value in OBR.23.4
    observationDate = s(obr['OBR.23']['OBR.23.4']);          // 20250201
}

// ========= OBX: Requested Procedure Text =========
var requestedProcText = '';

if (obx != null) {
    var obxId = s(obx['OBX.3']['OBX.3.1']); // REQPROCTEXT
    if (obxId == 'REQPROCTEXT') {
        // OBX.5.1.1 + OBX.5.1.2 → "Chest X-Ray PA  Lateral"
        var obxText1 = trim(obx['OBX.5']['OBX.5.1']['OBX.5.1.1']);
        var obxText2 = trim(obx['OBX.5']['OBX.5.1']['OBX.5.1.2']);
        requestedProcText = (obxText1 + ' ' + obxText2).trim();
    }
}

// Fallback: if OBX not present or not REQPROCTEXT, use OBR text
if (requestedProcText == '') {
    requestedProcText = procText;
}

// ========= Build DICOM-style MWL object =========

var mwl = {
    "Patient": {
        "PatientID": patientId,
        "AssigningAuthority": patientIdAssigningAuth,
        "PatientName": patientNameHL7,
        "PatientSex": sex,
        "PatientBirthDate": dob,
        "PatientAddress": {
            "Street": addressStreet,
            "City": addressCity,
            "State": addressState,
            "Zip": addressZip,
            "Country": addressCountry
        },
        "PatientPhone": phone
    },
    "Visit": {
        "PatientClass": patientClass,
        "VisitNumber": visitNumber,
        "Location": {
            "PointOfCare": locationPoint,
            "Room": locationRoom,
            "Bed": locationBed,
            "Facility": locationFacility
        },
        "AdmitDateTime": admitDateTime
    },
    "RequestedProcedure": {
        "RequestedProcedureID": visitNumber,
        "RequestedProcedureDescription": requestedProcText,
        "RequestedProcedureCode": {
            "CodeValue": procCode,
            "CodeMeaning": procText,
            "CodingSchemeDesignator": procCodingSys
        },
        "ScheduledProcedureStep": {
            "StartDateTime": schedDateTime,
            "Modality": "CR",
            "StationAETitle": "XRAY_ROOM_3",
            "PerformingPhysicianName": ordProvNameHL7
        }
    },
    "Meta": {
        "HL7MessageControlId": s(msh['MSH.10']['MSH.10.1']),
        "CreationDateTime": s(msh['MSH.7']['MSH.7.1']),
        "SourceSystem": s(msh['MSH.3']['MSH.3.1']),
        "ReceivingSystem": s(msh['MSH.5']['MSH.5.1']),
        "ObservationDate": observationDate
    }
};

var mwlJson = JSON.stringify(mwl, null, 2);
channelMap.put('mwlJson', mwlJson);

return msg;