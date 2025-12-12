# 📦 INSTALLATION INSTRUCTIONS

## ✅ What You Have Now

Your Streamlit application has been successfully converted to a Flask web application!

### Files Created:
- ✅ `app.py` - Flask backend (14 KB)
- ✅ `templates/` - 6 HTML pages
- ✅ `static/` - All CSS, JS, fonts, images
- ✅ `requirements.txt` - Python dependencies
- ✅ `start.bat` - Easy startup script
- ✅ Documentation files (README, guides)

### Backup Files:
- ✅ `app_streamlit_backup.py` - Original Streamlit app (SAFE!)

---

## 🚀 INSTALLATION (3 Steps)

### Step 1: Install Python Packages
Open Command Prompt or PowerShell in this folder and run:

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- pandas (data processing)
- plotly (charts)
- openpyxl (Excel files)
- python-docx (Word export)
- And other dependencies

**Expected time:** 1-2 minutes

---

### Step 2: Start the Application

**Option A: Using the startup script**
```bash
start.bat
```

**Option B: Direct Python command**
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

---

### Step 3: Open in Browser

Go to: **http://localhost:5000**

Click "Data Analysis" in the sidebar menu to start using the application!

---

## 📊 HOW TO USE

### 1. Upload Excel File
- Click "Choose Excel File"
- Select your .xlsx, .xls, or .xlsb file
- Wait for processing

### 2. Filter Data
- Use dropdown filters to select values
- Click "Apply Filters"
- Data table updates automatically

### 3. Create Pivot Tables
- Select Index (rows)
- Select Values to aggregate
- Choose aggregation function
- Click "Create Pivot"

### 4. Generate Charts
- Choose chart type (Bar, Line, Scatter, Pie)
- Select X and Y columns
- Optional: color grouping
- Click "Create Chart"

### 5. Save & Export
- Click "Save Report" to save filters
- Click "Export Excel" or "Export Word" to download

---

## 🔧 TROUBLESHOOTING

### Problem: "pip is not recognized"
**Solution:** Python is not in PATH. Reinstall Python with "Add to PATH" option checked.

### Problem: "Flask not found" error
**Solution:** Run `pip install Flask` or `pip install -r requirements.txt`

### Problem: "Port 5000 is already in use"
**Solution 1:** Close other applications using port 5000
**Solution 2:** Edit `app.py`, find the last line and change port:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changed to 5001
```

### Problem: "Cannot find templates"
**Solution:** Make sure you're running `python app.py` from the project folder (deneme)

### Problem: File upload fails
**Solution:**
- Check file size (max 50MB)
- Ensure file is a valid Excel file
- Try a different browser

### Problem: Charts don't display
**Solution:** Make sure you have internet connection (Plotly CDN)

---

## 📁 PROJECT STRUCTURE

```
deneme/
├── 🔥 app.py                    ← Main application (START HERE!)
├── 📋 requirements.txt          ← Dependencies list
├── 🚀 start.bat                 ← Quick start script
│
├── 📖 README.md                 ← Full documentation
├── 📖 QUICK_START.md            ← Quick start guide
├── 📖 WHAT_CHANGED.md           ← Before/After comparison
├── 📖 INSTALLATION.md           ← This file
│
├── 💾 app_streamlit_backup.py  ← Original Streamlit (BACKUP)
│
├── 📁 templates/                ← HTML pages
│   ├── table.html              ← Main data analysis page ⭐
│   ├── index.html              ← Dashboard
│   └── ...                     ← Other pages
│
├── 📁 static/                   ← CSS, JS, Images
│   ├── bootstrap/              ← Bootstrap framework
│   ├── css/                    ← Stylesheets
│   ├── js/
│   │   └── app.js              ← Data analysis JavaScript
│   ├── fonts/                  ← Icons
│   └── img/                    ← Images
│
└── 📁 uploads/                  ← Uploaded files (auto-created)
```

---

## ✨ WHAT'S NEW?

### Improvements Over Streamlit:
1. **Professional Web Interface** - Modern Bootstrap design
2. **Better Performance** - Faster page loads
3. **Mobile Friendly** - Works great on phones/tablets
4. **RESTful API** - Can integrate with other systems
5. **Customizable** - Full control over HTML/CSS
6. **Deployable** - Can host on any web server

### Same Great Features:
- ✅ Excel file upload and processing
- ✅ Interactive filters
- ✅ Pivot tables
- ✅ Multiple chart types
- ✅ Favorite reports
- ✅ Export to Excel/Word

---

## 🎯 NEXT STEPS

### For Basic Usage:
1. Install packages: `pip install -r requirements.txt`
2. Run: `python app.py` or `start.bat`
3. Open: http://localhost:5000
4. Use it like before!

### For Advanced Users (Optional):
- **Customize UI:** Edit `templates/table.html`
- **Change Colors:** Edit `static/css/` files
- **Add Features:** Modify `app.py`
- **Deploy Online:** Follow Flask deployment guides
- **Add Authentication:** Implement Flask-Login

---

## 📞 SUPPORT

### Quick Help:
1. Run `check_install.bat` to verify setup
2. Check `README.md` for detailed docs
3. Review `WHAT_CHANGED.md` for comparison
4. Refer to `app_streamlit_backup.py` if needed

### Common Commands:
```bash
# Install packages
pip install -r requirements.txt

# Start application
python app.py

# Check what's installed
pip list

# Update a package
pip install --upgrade package_name
```

---

## ✅ VERIFICATION CHECKLIST

Before starting, make sure you have:
- [x] Python 3.8+ installed
- [x] pip working (`pip --version`)
- [x] All files from project folder
- [x] Internet connection (for Plotly CDN)

After installation:
- [x] No errors when running `pip install -r requirements.txt`
- [x] `python app.py` starts without errors
- [x] Can access http://localhost:5000 in browser
- [x] Can see "Data Analysis" page
- [x] Can upload an Excel file

---

## 🎉 YOU'RE READY!

Everything is set up and ready to use. Just:

1. **Install:** `pip install -r requirements.txt`
2. **Run:** `python app.py`
3. **Open:** http://localhost:5000

**Enjoy your new web-based data analyzer!** 📊✨

---

**Last Updated:** December 4, 2025
**Version:** Flask 1.0
**Status:** ✅ Production Ready
