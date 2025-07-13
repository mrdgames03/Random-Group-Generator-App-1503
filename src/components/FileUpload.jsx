import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUpload, FiFileText, FiAlertCircle } = FiIcons;

const FileUpload = ({ onNamesImported }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          processFileData(results.data);
        },
        header: false,
        skipEmptyLines: true
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        processFileData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a CSV or Excel file');
    }

    // Reset file input
    event.target.value = '';
  };

  const processFileData = (data) => {
    // Extract names from the data, flatten arrays, and remove empty values
    const names = data
      .flat()
      .map(name => String(name).trim())
      .filter(name => name && name.length > 0);

    if (names.length === 0) {
      alert('No valid names found in the file');
      return;
    }

    // Remove duplicates
    const uniqueNames = [...new Set(names)];
    onNamesImported(uniqueNames);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,.xlsx,.xls"
        className="hidden"
      />
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={triggerFileInput}
        className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white rounded-xl p-4 transition-colors duration-300"
      >
        <div className="flex flex-col items-center space-y-2">
          <SafeIcon icon={FiUpload} className="w-6 h-6" />
          <div className="text-sm font-medium">Upload Names</div>
          <div className="flex items-center space-x-2 text-xs text-white/70">
            <SafeIcon icon={FiFileText} className="w-4 h-4" />
            <span>CSV or Excel files</span>
          </div>
        </div>
      </motion.button>

      <div className="mt-2 flex items-start space-x-2 text-xs text-white/60">
        <SafeIcon icon={FiAlertCircle} className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          File should contain names in a single column. Duplicate names will be automatically removed.
        </span>
      </div>
    </div>
  );
};

export default FileUpload;