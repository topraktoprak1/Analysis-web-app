from openpyxl import load_workbook
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.io as pio
import plotly.graph_objects as go
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
import io
from datetime import datetime
import json
from PIL import Image
from st_aggrid import AgGrid, GridOptionsBuilder, GridUpdateMode, DataReturnMode, JsCode

# This is the original Streamlit app - backed up before conversion to Flask
