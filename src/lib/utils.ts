import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from 'xlsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse Excel file (xlsx, xls) from public folder and return formatted data
 * @param filePath - File path relative to public folder (e.g., '0.All Master Data.xlsx')
 * @returns Promise containing parsed sheet data as JSON
 */
export async function parseExcelFile(filePath: string): Promise<any> {
  try {
    // Construct the full path to the file in the public folder
    const fullPath = `/${filePath}`;
    const response = await fetch(fullPath)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    
    const parsedData: any = {
      fileName: filePath.split('/').pop(),
      sheets: []
    }
    
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      parsedData.sheets.push({
        name: sheetName,
        data: data
      })
    })
    
    return parsedData
  } catch (error) {
    console.error('Error parsing Excel file:', error)
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Convert Excel data to formatted table HTML for display
 * @param data - Array of arrays representing spreadsheet data
 * @returns HTML string representation of the data
 */
export function formatExcelDataForDisplay(data: any[][]): string {
  if (!data || data.length === 0) return '<p>No data available</p>'
  
  let html = '<table class="border-collapse border border-gray-300 w-full"><tbody>'
  
  data.forEach((row, rowIndex) => {
    html += `<tr class="${rowIndex === 0 ? 'bg-blue-100 font-semibold' : ''}">`
    row.forEach((cell) => {
      const tag = rowIndex === 0 ? 'th' : 'td'
      html += `<${tag} class="border border-gray-300 px-4 py-2">${String(cell || '')}</${tag}>`
    })
    html += '</tr>'
  })
  
  html += '</tbody></table>'
  return html
}

/**
 * Format CSV data for display
 * @param csvContent - CSV content as string
 * @returns HTML string representation
 */
export function formatCSVForDisplay(csvContent: string): string {
  const rows = csvContent.split('\n').filter(row => row.trim())
  if (rows.length === 0) return '<p>No data available</p>'
  
  let html = '<table class="border-collapse border border-gray-300 w-full"><tbody>'
  
  rows.forEach((row, rowIndex) => {
    const cells = row.split(',')
    html += `<tr class="${rowIndex === 0 ? 'bg-blue-100 font-semibold' : ''}">`
    cells.forEach((cell) => {
      const tag = rowIndex === 0 ? 'th' : 'td'
      html += `<${tag} class="border border-gray-300 px-4 py-2">${cell.trim()}</${tag}>`
    })
    html += '</tr>'
  })
  
  html += '</tbody></table>'
  return html
}

// Custom styles for react-select
export const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '40px',
      borderRadius: '0.5rem',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      zIndex: 50,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: 'lightblue',
      border: 'blue 1px solid',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'blue',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: 'red',
      '&:hover': {
        backgroundColor: 'hsl(var(--destructive))',
        color: 'hsl(var(--destructive-foreground))',
      },
    }),
  };

  export const customStylesForResizable = {
    container: (provided: any) => ({
      ...provided,
      width: 'auto', // let the container size to content
      minWidth: 120, // smallest width when empty
      maxWidth: '60vw', // optional cap to avoid overflow; tweak as needed
      borderRadius: '0.5rem',
    }),
    control: (provided: any) => ({
      ...provided,
      minWidth: 120, // control shouldn't collapse smaller than this
      boxSizing: 'border-box',
      borderRadius: '0.5rem',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '4px 8px',
      borderRadius: '0.5rem',
    }),
  };
