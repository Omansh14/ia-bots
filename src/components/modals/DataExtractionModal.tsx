import { useState, useEffect } from 'react';
import { DialogContent, DialogTitle, DialogClose } from '../ui/dialog';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { files } from '@/constants';
import { formatCSVForDisplay, parseExcelFile } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';

export interface UploadedFile {
  id: string;
  name: string;
  content?: string;
  type: string;
  isMapped?: boolean;
}

interface ExcelSheet {
  name: string;
  data: any[][];
}

const DataExtractionModal = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('1');
  const [fromCellId, setFromCellId] = useState<string>('');
  const [toCellId, setToCellId] = useState<string>('');
  const [excelData, setExcelData] = useState<ExcelSheet[] | null>(null);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const selectedFile = files.find((file) => file.id === selectedFileId);

  // Load Excel file on component mount
  useEffect(() => {
    const loadExcelData = async () => {
      try {
        setLoading(true);
        const data = await parseExcelFile('O2C Master.xlsx');
        setExcelData(data.sheets as ExcelSheet[]);
        setSelectedSheetIndex(0);
      } catch (error) {
        console.error('Failed to load Excel file:', error);
        setExcelData([]);
      } finally {
        fromCellId;
        setLoading(false);
      }
    };

    loadExcelData();
  }, []);

  // Handle uppercase conversion for cell IDs
  const handleFromCellChange = (value: string) => {
    setFromCellId(value.toUpperCase());
  };

  const handleToCellChange = (value: string) => {
    setToCellId(value.toUpperCase());
  };

  // Format content based on file type
  const getFormattedContent = () => {
    if (!selectedFile) return null;

    if (selectedFile.type === 'csv') {
      return {
        html: formatCSVForDisplay(selectedFile.content || ''),
        isHTML: true,
      };
    } else if (selectedFile.type === 'xlsx' || selectedFile.type === 'xls') {
      // Parse JSON representation of Excel data
      try {
        const excelDataObj = JSON.parse(selectedFile.content || '{}');
        if (excelDataObj.sheets && excelDataObj.sheets.length > 0) {
          const firstSheet = excelDataObj.sheets[0];
          const rows = firstSheet.data as any[][];
          let html = '<table class="border-collapse border border-gray-300 w-full"><tbody>';

          rows.forEach((row, rowIndex) => {
            html += `<tr class="${rowIndex === 0 ? 'bg-blue-100 font-semibold' : ''}">`;
            row.forEach((cell: any) => {
              const tag = rowIndex === 0 ? 'th' : 'td';
              html += `<${tag} class="border border-gray-300 px-4 py-2">${String(cell || '')}</${tag}>`;
            });
            html += '</tr>';
          });

          html += '</tbody></table>';
          return { html, isHTML: true };
        }
      } catch (e) {
        console.error('Error parsing Excel data:', e);
      }
    }

    return {
      html: selectedFile.content || 'Unable to read file content',
      isHTML: false,
    };
  };

  const formattedContent = getFormattedContent();

  // Format Excel sheet data to HTML table with row/column headers
  const formatExcelSheetToHTML = (sheetData: any[][]): string => {
    if (!sheetData || sheetData.length === 0) return '<p>No data available</p>';

    // Generate column letters (A, B, C, ... Z, AA, AB, etc.)
    const getColumnLetter = (index: number): string => {
      let letter = '';
      while (index >= 0) {
        letter = String.fromCharCode(65 + (index % 26)) + letter;
        index = Math.floor(index / 26) - 1;
      }
      return letter;
    };

    let html = '<table class="border-collapse border border-gray-300 w-full text-sm"><tbody>';

    // Add header row with column letters
    html += '<tr class="bg-gray-200 font-semibold sticky top-0">';
    html +=
      '<td class="border border-gray-300 px-2 py-1 bg-gray-300 text-center font-bold w-10"></td>'; // Empty corner cell
    for (let i = 0; i < sheetData[0]?.length || 0; i++) {
      html += `<td class="border border-gray-300 px-2 py-1 text-center bg-gray-200 font-semibold">${getColumnLetter(i)}</td>`;
    }
    html += '</tr>';

    // Add data rows with row numbers
    sheetData.forEach((row, rowIndex) => {
      html += `<tr class="${rowIndex === 0 ? 'bg-blue-50' : ''}">`;
      // Row number column
      html += `<td class="border border-gray-300 px-2 py-1 text-center bg-gray-200 font-semibold w-10">${rowIndex + 1}</td>`;
      // Data cells
      row.forEach((cell: any, colIndex: number) => {
        const tag = rowIndex === 0 ? 'th' : 'td';
        html += `<${tag} class="border border-gray-300 px-3 py-2 whitespace-nowrap">${String(cell || '')}</${tag}>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  };

  return (
    <DialogContent className="min-w-screen h-screen max-w-none p-0 rounded-none border-0 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <DialogTitle className="text-2xl font-bold">Data Extraction</DialogTitle>
      </div>
      <div className="flex flex-1 overflow-hidden gap-0 bg-white h-full">
        {/* LEFT PANE: File List (20%) */}
        <div className="w-1/5 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Files</h3>
          </div>

          <ScrollArea className="flex-1 p-3 h-full">
            <div className="space-y-2">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedFileId === file.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedFileId(file.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="">
                      {' '}
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{file.type.toUpperCase()}</p>
                    </div>
                    {!file.isMapped && <CircleAlert className="h-6 w-6 text-red-600 mt-1" />}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* CENTER PANEL: Preview (60%) */}
        <div className="w-3/5 flex flex-col border-r bg-white">
          <div className="p-4 border-b">
            {excelData && excelData.length > 0 ? (
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <select
                  value={selectedSheetIndex}
                  onChange={(e) => setSelectedSheetIndex(Number(e.target.value))}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {excelData.map((sheet, index) => (
                    <option key={index} value={index}>
                      {sheet.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <h3 className="text-lg font-semibold">
                {loading
                  ? 'Loading Excel file...'
                  : selectedFile
                    ? `Preview: ${selectedFile.name}`
                    : 'No file selected'}
              </h3>
            )}
          </div>

          <ScrollArea className="flex-1 p-4 h-full">
            {excelData && excelData.length > 0 ? (
              <div
                className="bg-gray-50 p-4 rounded border overflow-auto"
                dangerouslySetInnerHTML={{
                  __html: formatExcelSheetToHTML(excelData[selectedSheetIndex]?.data || []),
                }}
              />
            ) : selectedFile ? (
              formattedContent?.isHTML ? (
                <div
                  className="bg-gray-50 p-4 rounded border overflow-auto"
                  dangerouslySetInnerHTML={{ __html: formattedContent.html }}
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded border font-mono text-sm whitespace-pre-wrap break-words">
                  {formattedContent?.html}
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {loading ? 'Loading Excel file...' : 'Select a file to see its preview'}
              </div>
            )}
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>

        {/* RIGHT PANEL: Cell Selection Dropdowns (20%) */}
        <div className="w-1/5 bg-gray-50 flex flex-col border-l">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Cell Range Selection</h3>
          </div>

          <div className="flex-1 p-4 space-y-6">
            {/* From Cell ID Text Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">From Cell ID</label>
              <Input
                type="text"
                placeholder="e.g., A1"
                value={fromCellId}
                onChange={(e) => handleFromCellChange(e.target.value)}
              />
            </div>
            {/* To Cell ID Text Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">To Cell ID</label>
              <Input
                type="text"
                placeholder="e.g., Z10"
                value={toCellId}
                onChange={(e) => handleToCellChange(e.target.value)}
              />
            </div>

            <Separator />

            {/* Selection Summary */}
            {(fromCellId || toCellId) && (
              <div className="mt-6 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Selected Range:</p>
                <p className="text-sm text-blue-700 mt-1">
                  {fromCellId || 'Start'} → {toCellId || 'End'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t space-y-2">
            <DialogClose asChild>
              <Button className="w-full" variant="default">
                Save Selection
              </Button>
            </DialogClose>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default DataExtractionModal;
