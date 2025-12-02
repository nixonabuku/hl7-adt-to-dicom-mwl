# 📘 **HL7 ADT A04 → DICOM Modality Worklist (MWL) Transformer**
*A Mirth Connect project converting HL7 radiology registrations into DICOM-style MWL JSON entries.*

---

## 🩺 **Project Overview**

This project demonstrates a real healthcare interoperability workflow:

**HL7 ADT A04 (Radiology Registration)** → **Mirth Connect Transformer** → **DICOM Modality Worklist–style JSON**

Hospital imaging departments rely on **Modality Worklist (MWL)** so imaging devices (CR, CT, MRI, US) can automatically pull patient and procedure data.  
Since many clinical systems send **HL7 v2.x** messages, an integration engine must convert HL7 into MWL-friendly structures.

This project delivers exactly that: a complete HL7→MWL transformation pipeline built in **Mirth Connect**.

---

## 🎯 **Key Features**

✔ Converts HL7 ADT A04 messages into MWL JSON  
✔ Extracts PID, PV1, OBR, and OBX radiology information  
✔ Produces structured JSON representing a MWL worklist item  
✔ Implemented entirely in **Mirth Connect** using JavaScript  
✔ Includes HL7 sample input and JSON sample output  
✔ Includes exported Mirth channel (.xml)  
✔ Fully documented with screenshots for reproducibility  
✔ Perfect for resumes and healthcare IT portfolios  

---

## ⚙️ **Architecture Flow**

```
HL7 ADT A04 (.txt file)
            ↓
     Mirth Connect Channel
   Source: File Reader
            ↓
 Transformer (JavaScript)
  HL7 → MWL JSON mapping
            ↓
 Destination: File Writer
 Outputs: mwl_sample_output.json
```

---

## 📁 **Repository Structure**

```
hl7-adt-to-dicom-mwl/
│
├── README.md
│
├── src/
│   └── transformer.js
│
├── channel/
│   └── HL7_ADT_to_DICOM_MWL.xml
│
├── sample-hl7/
│   └── ADT_A04_Radiology_Registration.txt
│
├── sample-output/
│   └── mwl_sample_output.json
│
└── screenshots/
    ├── channel_summary.png
    ├── file_reader_settings.png
    ├── file_reader_settings_part2.png
    ├── transformer_code.png
    ├── file_writer_settings.png
    ├── file_writer_template.png
    └── output_json_preview.png
```

---

## 🧩 **HL7 → MWL Field Mapping**

| MWL Field | HL7 Field | Description |
|----------|-----------|-------------|
| PatientID | PID-3.1 | MRN |
| AssigningAuthority | PID-3.4 | MRN Issuer |
| PatientName | PID-5 | Last^First^Middle |
| BirthDate | PID-7 | Date of Birth |
| Sex | PID-8 | Gender |
| Address | PID-11 | Street/City/State/Zip |
| Phone | PID-13 | Contact number |
| VisitNumber | PV1 | Visit/Encounter ID |
| Location | PV1-3 | Point of care, room, bed |
| ProcedureCode | OBR-4 | CPT / internal code |
| ProcedureDescription | OBX-5 or OBR-4 | Human-readable text |
| ScheduledDateTime | OBR-7 | Imaging appointment time |
| PerformingPhysician | OBR-14 | Ordering/Performing provider |
| MessageControlID | MSH-10 | Unique message ID |

---

## 🧪 **Sample Input**

```
sample-hl7/ADT_A04_Radiology_Registration.txt
```

---

## 📤 **Sample Output**

```
sample-output/mwl_sample_output.json
```

---

## 🛠️ **How to Run**

### **1. Import the channel**
Go to:  
**Mirth → Channels → Import**  
Select:
```
channel/HL7_ADT_to_DICOM_MWL.xml
```

### **2. Configure Source (File Reader)**
Reads `.txt` HL7 files from your Input folder or `sample-hl7/`.

### **3. Transformer**
Runs the JavaScript logic in:
```
src/transformer.js
```
Produces `mwlJson` via:
```
channelMap.put("mwlJson", builtJsonString)
```

### **4. Destination (File Writer)**
Outputs JSON to:
```
sample-output/
```
Filename pattern:
```
mwl_${message.id}.json
```

### **5. Run the channel**
Drop in any HL7 file → JSON is generated automatically.

---

## 📸 **Screenshots**
See `/screenshots` folder for:
- Channel summary  
- File Reader settings  
- File Writer settings  
- Transformer code  
- Output preview  

---

## 💼 **Resume Summary**

**HL7 to DICOM MWL Integration — Mirth Connect**  
Developed an HL7 ADT A04 → DICOM MWL transformation interface using Mirth Connect. Implemented a custom JavaScript transformer to parse PID, PV1, OBR, and OBX segments and generate MWL‑compliant JSON including Patient, Visit, Requested Procedure, and Scheduled Procedure Step modules. Delivered full channel configuration, sample HL7 input, JSON output, and documentation for a portfolio‑ready healthcare integration project.

---

## 🚀 **Future Enhancements**
- Support ORM^O01 orders  
- Multi-OBR study support  
- True DICOM MWL SCP integration  
- Orthanc MWL plugin compatibility  
- Docker deployment for Mirth  

---
