# Excel Data Analyzer - Flask Web Application

## 📊 Overview
This is a Flask web application that provides Excel data analysis capabilities with an interactive web interface. The application was converted from a Streamlit app to work with the existing HTML templates.

## ✨ Features
- 📁 **File Upload**: Upload Excel files (.xlsx, .xls, .xlsb)
- 🔍 **Interactive Filters**: Filter data by multiple columns
- 📐 **Pivot Tables**: Create custom pivot tables with various aggregations
- 📈 **Charts**: Generate bar, line, scatter, and pie charts using Plotly
- ⭐ **Save Reports**: Save favorite filter configurations
- 💾 **Export**: Download reports in Excel or Word format
- 📊 **Data Analysis**: Automatic calculation of KAR/ZARAR columns

## 🚀 Installation

### 1. Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Run the Application
```powershell
python app.py
```

The application will start on `http://localhost:5000`

## 📁 Project Structure
```
deneme/
├── app.py                      # Main Flask application
├── app_streamlit_backup.py     # Original Streamlit app (backup)
├── requirements.txt            # Python dependencies
├── favorite_reports.json       # Saved reports (auto-generated)
├── uploads/                    # Uploaded files folder (auto-generated)
├── templates/                  # HTML templates
│   ├── index.html             # Dashboard page
│   ├── table.html             # Data analysis page (main)
│   ├── login.html             # Login page
│   ├── register.html          # Register page
│   ├── profile.html           # Profile page
│   └── forgot-password.html   # Forgot password page
└── static/                     # Static assets
    ├── bootstrap/             # Bootstrap CSS & JS
    ├── css/                   # Custom CSS
    ├── fonts/                 # Font Awesome icons
    ├── img/                   # Images
    └── js/
        ├── app.js             # Data analysis JavaScript
        ├── theme.js           # Theme JavaScript
        └── ...                # Other JS files
```

## 🔧 How to Use

### 1. Upload Excel File
1. Navigate to the "Data Analysis" page (`/table.html`)
2. Click "Choose Excel File"
3. Select your Excel file (.xlsx, .xls, or .xlsb)
4. The file will be uploaded and processed automatically

### 2. Filter Data
- Use the filter dropdowns to select specific values
- Click "Apply Filters" to filter the data
- Click "Clear Filters" to reset

### 3. Create Pivot Tables
- Select Index column (rows)
- Optional: Select Columns column
- Select one or more Values columns
- Choose aggregation function (Sum, Mean, Count, Min, Max)
- Click "Create Pivot"

### 4. Generate Charts
- Select chart type (Bar, Line, Scatter, Pie)
- Choose X and Y axis columns
- Optional: Select color grouping column
- Click "Create Chart"

### 5. Save Reports
- After configuring filters, click "Save Report"
- Enter a name for your report
- The configuration will be saved for later use

### 6. Export Data
- Click "Export Excel" for Excel format
- Click "Export Word" for Word document format

## 🔌 API Endpoints

### File Upload
- **POST** `/api/upload` - Upload and process Excel file

### Data Operations
- **POST** `/api/filter` - Apply filters to data
- **POST** `/api/pivot` - Create pivot table
- **POST** `/api/chart` - Generate chart
- **POST** `/api/export` - Export report (Excel/Word)

### Favorites
- **GET** `/api/favorites` - Get saved reports
- **POST** `/api/favorites` - Save new report
- **DELETE** `/api/favorites/<name>` - Delete saved report

## 📝 Notes

### Excel File Requirements
- Supported formats: .xlsx, .xls, .xlsb
- Maximum file size: 50MB
- If a "DATABASE" sheet exists, it will be loaded automatically
- Otherwise, the first sheet is loaded

### Calculated Columns
The application automatically calculates:
- **KAR/ZARAR**: İşveren-Hakediş (USD) - General Total Cost (USD)
- **BF KAR/ZARAR**: İşveren-Hakediş Birim Fiyat (USD) - Hourly Unit Rate (USD)

### Session Management
- Uploaded files are stored in session
- Files are saved in the `uploads/` folder
- Session expires when browser is closed

## 🔒 Security Notes
- Change the `app.secret_key` in `app.py` before deploying to production
- Consider adding authentication for sensitive data
- Implement file upload validation and virus scanning in production

## 🐛 Troubleshooting

### Import Errors
If you see import errors, make sure all dependencies are installed:
```powershell
pip install -r requirements.txt
```

### Port Already in Use
If port 5000 is already in use, edit `app.py` and change the port:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### File Upload Fails
- Check file size (max 50MB)
- Ensure the file is a valid Excel file
- Check if `uploads/` folder has write permissions

## 📚 Dependencies
- Flask 3.0.0 - Web framework
- pandas 2.1.4 - Data manipulation
- openpyxl 3.1.2 - Excel file handling
- pyxlsb 1.0.10 - Binary Excel file support
- plotly 5.18.0 - Interactive charts
- python-docx 1.1.0 - Word document generation
- xlsxwriter 3.1.9 - Excel file writing

## 🎨 Frontend Technologies
- Bootstrap 5 - UI framework
- Font Awesome - Icons
- Plotly.js - Interactive charts
- Vanilla JavaScript - Data handling

## 📄 License
Copyright © 2025 Veri Analizı

## 🤝 Contributing
This is a private project. For questions or issues, contact the development team.

## 📞 Support
For support and questions, refer to the internal documentation or contact the system administrator.
